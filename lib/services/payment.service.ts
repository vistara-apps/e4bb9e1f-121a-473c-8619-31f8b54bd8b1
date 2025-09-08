import { stripe, CREDIT_PACKAGES, CreditPackageId } from '@/lib/stripe';
import { supabaseAdmin, TABLES } from '@/lib/supabase';
import { Payment, ApiResponse } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { UserService } from './user.service';

export class PaymentService {
  /**
   * Create a payment intent for credit purchase
   */
  static async createPaymentIntent(
    userId: string,
    packageId: CreditPackageId
  ): Promise<ApiResponse<{ clientSecret: string; paymentIntentId: string }>> {
    try {
      const creditPackage = CREDIT_PACKAGES[packageId];
      if (!creditPackage) {
        return { success: false, error: 'Invalid credit package' };
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: creditPackage.price,
        currency: 'usd',
        metadata: {
          userId,
          packageId,
          credits: creditPackage.credits.toString(),
        },
        description: `${creditPackage.name} - ${creditPackage.description}`,
      });

      // Record payment in database
      const paymentRecord = {
        id: generateId(),
        user_id: userId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: creditPackage.price,
        currency: 'usd',
        credits_purchased: creditPackage.credits,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: dbError } = await supabaseAdmin
        .from(TABLES.PAYMENTS)
        .insert(paymentRecord);

      if (dbError) {
        console.error('Error recording payment:', dbError);
        return { success: false, error: 'Failed to record payment' };
      }

      return {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret!,
          paymentIntentId: paymentIntent.id
        }
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return { success: false, error: 'Failed to create payment intent' };
    }
  }

  /**
   * Handle successful payment (called by webhook)
   */
  static async handleSuccessfulPayment(paymentIntentId: string): Promise<ApiResponse<void>> {
    try {
      // Get payment record
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from(TABLES.PAYMENTS)
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (paymentError || !payment) {
        console.error('Payment not found:', paymentError);
        return { success: false, error: 'Payment not found' };
      }

      // Update payment status
      const { error: updateError } = await supabaseAdmin
        .from(TABLES.PAYMENTS)
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
        return { success: false, error: 'Failed to update payment status' };
      }

      // Add credits to user account
      const creditsResult = await UserService.updateUserCredits(
        payment.user_id,
        payment.credits_purchased
      );

      if (!creditsResult.success) {
        console.error('Error adding credits to user:', creditsResult.error);
        return { success: false, error: 'Failed to add credits to user account' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling successful payment:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Handle failed payment (called by webhook)
   */
  static async handleFailedPayment(paymentIntentId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.PAYMENTS)
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (error) {
        console.error('Error updating payment status:', error);
        return { success: false, error: 'Failed to update payment status' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling failed payment:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's payment history
   */
  static async getUserPaymentHistory(userId: string): Promise<ApiResponse<Payment[]>> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PAYMENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting payment history:', error);
        return { success: false, error: 'Failed to get payment history' };
      }

      const payments = data.map(this.mapDatabasePaymentToPayment);

      return {
        success: true,
        data: payments
      };
    } catch (error) {
      console.error('Error in getUserPaymentHistory:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(paymentId: string): Promise<ApiResponse<Payment>> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PAYMENTS)
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) {
        console.error('Error getting payment:', error);
        return { success: false, error: 'Payment not found' };
      }

      return {
        success: true,
        data: this.mapDatabasePaymentToPayment(data)
      };
    } catch (error) {
      console.error('Error in getPaymentById:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Map database payment to Payment interface
   */
  private static mapDatabasePaymentToPayment(dbPayment: any): Payment {
    return {
      id: dbPayment.id,
      userId: dbPayment.user_id,
      stripePaymentIntentId: dbPayment.stripe_payment_intent_id,
      amount: dbPayment.amount,
      currency: dbPayment.currency,
      creditsPurchased: dbPayment.credits_purchased,
      status: dbPayment.status,
      createdAt: dbPayment.created_at,
      updatedAt: dbPayment.updated_at
    };
  }
}
