package com.vizu.app.model.network

import com.vizu.app.model.data.HomeFeedData
import com.vizu.app.model.data.MediaType
import com.vizu.app.model.data.StoryHighlight
import com.vizu.app.model.data.VizuPost
import kotlinx.coroutines.delay

/**
 * Mock implementation of ApiService simulating network delay and realistic fake payload for debug builds.
 */
class FakeVizuApiService : ApiService {

    private val mockStories = listOf(
        StoryHighlight("st_1", "Kai_Vista", null, hasUnseen = true, isGhost = false),
        StoryHighlight("st_2", "Ghost_Z", null, hasUnseen = true, isGhost = true),
        StoryHighlight("st_3", "Aria_AR", null, hasUnseen = false, isGhost = false),
        StoryHighlight("st_4", "Luna_Hush", null, hasUnseen = true, isGhost = true)
    )

    private val mockPosts = mutableListOf(
        VizuPost(
            id = "post_101",
            authorName = "Kai Vance",
            authorUsername = "kai_vista",
            authorAvatarUrl = null,
            isGhostMode = false,
            timestamp = "12m ago",
            contentText = "Deployed new spatial AR anchors around Central Vista Park! Connect your Vizu glass to experience live glowing nodes. ✨",
            mediaType = MediaType.AR_VISTA,
            locationTag = "Central Vista Park (37m away)",
            zapCount = 42,
            whisperCount = 8,
            isZapped = false
        ),
        VizuPost(
            id = "post_102",
            authorName = "Anonymous Echo",
            authorUsername = "ghost_persona_77",
            authorAvatarUrl = null,
            isGhostMode = true,
            timestamp = "34m ago",
            contentText = "Encrypted hush whisper dropped in Sector 4. Decrypt via proximity Bluetooth verification.",
            mediaType = MediaType.HUSH_AUDIO,
            locationTag = "Proximity Grid 4",
            zapCount = 129,
            whisperCount = 24,
            isZapped = true
        ),
        VizuPost(
            id = "post_103",
            authorName = "Aria Chen",
            authorUsername = "aria_spatial",
            authorAvatarUrl = null,
            isGhostMode = false,
            timestamp = "2h ago",
            contentText = "Setting up tonight's synchronized spatial audio vibe session. Drop your persona badge to get auto-invited!",
            mediaType = MediaType.TEXT,
            locationTag = "Vizu Studio Room 12",
            zapCount = 88,
            whisperCount = 15,
            isZapped = false
        )
    )

    override suspend fun login(request: LoginRequest): LoginResponse {
        delay(300)
        return LoginResponse(
            token = "fake_jwt_token_12345",
            userId = "usr_alex",
            username = request.username,
            persona = "Alex Rivers"
        )
    }

    override suspend fun getHomeFeed(forceRefresh: Boolean): HomeFeedData {
        delay(600)
        return HomeFeedData(
            userPersonaName = "Alex Rivers",
            userAvatarUrl = null,
            stories = mockStories,
            posts = mockPosts.toList()
        )
    }

    override suspend fun toggleZap(postId: String): ZapResponse {
        delay(200)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index != -1) {
            val item = mockPosts[index]
            val nextZapped = !item.isZapped
            val nextCount = if (nextZapped) item.zapCount + 1 else (item.zapCount - 1).coerceAtLeast(0)
            mockPosts[index] = item.copy(isZapped = nextZapped, zapCount = nextCount)
            return ZapResponse(postId = postId, isZapped = nextZapped, totalZaps = nextCount)
        }
        return ZapResponse(postId = postId, isZapped = false, totalZaps = 0)
    }

    override suspend fun getCurrentUserProfile(): UserProfileDto {
        delay(300)
        return UserProfileDto(
            id = "usr_alex",
            username = "alex_rivers",
            displayName = "Alex Rivers",
            bio = "Exploring spatial AR & hush whisper networks.",
            ghostMode = false
        )
    }

    override suspend fun updateProfile(profileUpdate: UserProfileDto): UserProfileDto {
        delay(300)
        return profileUpdate
    }
}
