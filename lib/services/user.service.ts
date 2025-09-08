import { supabaseAdmin, TABLES } from '@/lib/supabase';
import { User, ApiResponse } from '@/lib/types';
import { generateId } from '@/lib/utils';

export class UserService {
  /**
   * Get or create a user by Farcaster ID
   */
  static async getOrCreateUser(farcasterId: string, userAddress?: string): Promise<ApiResponse<User>> {
    try {
      // First, try to find existing user
      const { data: existingUser, error: findError } = await supabaseAdmin
        .from(TABLES.USERS)
        .select('*')
        .eq('farcaster_id', farcasterId)
        .single();

      if (existingUser && !findError) {
        // Update user address if provided and different
        if (userAddress && existingUser.user_address !== userAddress) {
          const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from(TABLES.USERS)
            .update({ 
              user_address: userAddress,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating user address:', updateError);
            return { success: false, error: 'Failed to update user address' };
          }

          return { 
            success: true, 
            data: this.mapDatabaseUserToUser(updatedUser)
          };
        }

        return { 
          success: true, 
          data: this.mapDatabaseUserToUser(existingUser)
        };
      }

      // Create new user
      const newUser = {
        id: generateId(),
        farcaster_id: farcasterId,
        user_address: userAddress || null,
        paid_credits: 3, // Give 3 free credits to new users
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdUser, error: createError } = await supabaseAdmin
        .from(TABLES.USERS)
        .insert(newUser)
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return { success: false, error: 'Failed to create user' };
      }

      return { 
        success: true, 
        data: this.mapDatabaseUserToUser(createdUser)
      };
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error getting user by ID:', error);
        return { success: false, error: 'User not found' };
      }

      return { 
        success: true, 
        data: this.mapDatabaseUserToUser(data)
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Update user credits
   */
  static async updateUserCredits(userId: string, creditsToAdd: number): Promise<ApiResponse<User>> {
    try {
      // First get the current user
      const userResult = await this.getUserById(userId);
      if (!userResult.success || !userResult.data) {
        return { success: false, error: 'User not found' };
      }

      const newCredits = userResult.data.paidCredits + creditsToAdd;

      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .update({ 
          paid_credits: newCredits,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user credits:', error);
        return { success: false, error: 'Failed to update credits' };
      }

      return { 
        success: true, 
        data: this.mapDatabaseUserToUser(data)
      };
    } catch (error) {
      console.error('Error in updateUserCredits:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Deduct credits from user
   */
  static async deductCredits(userId: string, creditsToDeduct: number = 1): Promise<ApiResponse<User>> {
    try {
      // First check if user has enough credits
      const userResult = await this.getUserById(userId);
      if (!userResult.success || !userResult.data) {
        return { success: false, error: 'User not found' };
      }

      if (userResult.data.paidCredits < creditsToDeduct) {
        return { success: false, error: 'Insufficient credits' };
      }

      const newCredits = userResult.data.paidCredits - creditsToDeduct;

      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .update({ 
          paid_credits: newCredits,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error deducting user credits:', error);
        return { success: false, error: 'Failed to deduct credits' };
      }

      return { 
        success: true, 
        data: this.mapDatabaseUserToUser(data)
      };
    } catch (error) {
      console.error('Error in deductCredits:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Map database user to User interface
   */
  private static mapDatabaseUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      farcasterId: dbUser.farcaster_id,
      userAddress: dbUser.user_address,
      paidCredits: dbUser.paid_credits,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at
    };
  }
}
