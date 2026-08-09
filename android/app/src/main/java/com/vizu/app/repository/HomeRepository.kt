package com.vizu.app.repository

import com.vizu.app.model.data.HomeFeedData
import com.vizu.app.model.network.ApiClient
import com.vizu.app.model.network.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repository providing clean data access for the Vizu Home screen.
 * Handles data fetching, caching, error recovery, and mutation logic.
 */
class HomeRepository(
    private val apiService: ApiService = ApiClient.apiService
) {
    private var cachedData: HomeFeedData? = null

    /**
     * Fetches current home feed data from network or cache with forceRefresh capability.
     */
    suspend fun getHomeFeed(forceRefresh: Boolean = false): Result<HomeFeedData> = withContext(Dispatchers.IO) {
        runCatching {
            if (!forceRefresh && cachedData != null) {
                cachedData!!
            } else {
                val freshData = apiService.getHomeFeed(forceRefresh)
                cachedData = freshData
                freshData
            }
        }
    }

    /**
     * Toggles zap reaction on a specific post.
     */
    suspend fun toggleZap(postId: String): Result<HomeFeedData> = withContext(Dispatchers.IO) {
        runCatching {
            apiService.toggleZap(postId)
            val updatedFeed = apiService.getHomeFeed(forceRefresh = true)
            cachedData = updatedFeed
            updatedFeed
        }
    }
}
