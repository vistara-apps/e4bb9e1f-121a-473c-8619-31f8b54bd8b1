import { supabaseAdmin, TABLES } from '@/lib/supabase';
import { LookupHistory, SearchResult, ApiResponse, PaginatedResponse } from '@/lib/types';
import { generateId } from '@/lib/utils';

export class LookupService {
  /**
   * Record a lookup in history
   */
  static async recordLookup(
    userId: string, 
    query: string, 
    result: SearchResult, 
    rightId?: string
  ): Promise<ApiResponse<LookupHistory>> {
    try {
      const lookupRecord = {
        id: generateId(),
        user_id: userId,
        right_id: rightId || null,
        query,
        result: result as any, // JSON field
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabaseAdmin
        .from(TABLES.LOOKUP_HISTORY)
        .insert(lookupRecord)
        .select()
        .single();

      if (error) {
        console.error('Error recording lookup:', error);
        return { success: false, error: 'Failed to record lookup' };
      }

      return { 
        success: true, 
        data: this.mapDatabaseLookupToLookupHistory(data)
      };
    } catch (error) {
      console.error('Error in recordLookup:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's lookup history with pagination
   */
  static async getUserLookupHistory(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<LookupHistory>> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count, error: countError } = await supabaseAdmin
        .from(TABLES.LOOKUP_HISTORY)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        console.error('Error getting lookup count:', countError);
        return { success: false, error: 'Failed to get lookup history' };
      }

      // Get paginated data
      const { data, error } = await supabaseAdmin
        .from(TABLES.LOOKUP_HISTORY)
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error getting lookup history:', error);
        return { success: false, error: 'Failed to get lookup history' };
      }

      const lookupHistory = data.map(this.mapDatabaseLookupToLookupHistory);
      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: lookupHistory,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error in getUserLookupHistory:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get recent lookups across all users (for analytics)
   */
  static async getRecentLookups(limit: number = 50): Promise<ApiResponse<LookupHistory[]>> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.LOOKUP_HISTORY)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting recent lookups:', error);
        return { success: false, error: 'Failed to get recent lookups' };
      }

      const lookupHistory = data.map(this.mapDatabaseLookupToLookupHistory);

      return {
        success: true,
        data: lookupHistory
      };
    } catch (error) {
      console.error('Error in getRecentLookups:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get popular search queries
   */
  static async getPopularQueries(limit: number = 10): Promise<ApiResponse<{ query: string; count: number }[]>> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.LOOKUP_HISTORY)
        .select('query')
        .order('timestamp', { ascending: false })
        .limit(1000); // Get recent 1000 queries

      if (error) {
        console.error('Error getting popular queries:', error);
        return { success: false, error: 'Failed to get popular queries' };
      }

      // Count query frequency
      const queryCount: { [key: string]: number } = {};
      data.forEach(item => {
        const query = item.query.toLowerCase().trim();
        queryCount[query] = (queryCount[query] || 0) + 1;
      });

      // Sort by frequency and take top results
      const popularQueries = Object.entries(queryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([query, count]) => ({ query, count }));

      return {
        success: true,
        data: popularQueries
      };
    } catch (error) {
      console.error('Error in getPopularQueries:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Delete lookup history for a user
   */
  static async deleteLookupHistory(userId: string, lookupId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.LOOKUP_HISTORY)
        .delete()
        .eq('id', lookupId)
        .eq('user_id', userId); // Ensure user can only delete their own history

      if (error) {
        console.error('Error deleting lookup history:', error);
        return { success: false, error: 'Failed to delete lookup history' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteLookupHistory:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Map database lookup to LookupHistory interface
   */
  private static mapDatabaseLookupToLookupHistory(dbLookup: any): LookupHistory {
    return {
      id: dbLookup.id,
      userId: dbLookup.user_id,
      rightId: dbLookup.right_id,
      query: dbLookup.query,
      result: dbLookup.result,
      timestamp: dbLookup.timestamp
    };
  }
}
