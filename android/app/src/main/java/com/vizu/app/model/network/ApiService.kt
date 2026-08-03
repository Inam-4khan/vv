package com.vizu.app.model.network

import com.vizu.app.model.data.HomeFeedData
import com.vizu.app.model.data.VizuPost
import retrofit2.http.*

data class LoginRequest(
    val username: String,
    val secretKey: String
)

data class LoginResponse(
    val token: String,
    val userId: String,
    val username: String,
    val persona: String
)

data class ZapRequest(
    val postId: String
)

data class ZapResponse(
    val postId: String,
    val isZapped: Boolean,
    val totalZaps: Int
)

data class UserProfileDto(
    val id: String,
    val username: String,
    val displayName: String,
    val bio: String?,
    val ghostMode: Boolean
)

/**
 * Retrofit2 API interface defining endpoints for Vizu backend services.
 */
interface ApiService {

    @POST("v1/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @GET("v1/feed/home")
    suspend fun getHomeFeed(
        @Query("forceRefresh") forceRefresh: Boolean = false
    ): HomeFeedData

    @POST("v1/feed/posts/{postId}/zap")
    suspend fun toggleZap(
        @Path("postId") postId: String
    ): ZapResponse

    @GET("v1/users/me")
    suspend fun getCurrentUserProfile(): UserProfileDto

    @PATCH("v1/users/me")
    suspend fun updateProfile(
        @Body profileUpdate: UserProfileDto
    ): UserProfileDto
}
