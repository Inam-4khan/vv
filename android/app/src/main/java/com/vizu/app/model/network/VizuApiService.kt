package com.vizu.app.model.network

import com.vizu.app.model.data.HomeFeedData
import com.vizu.app.model.data.MediaType
import com.vizu.app.model.data.StoryHighlight
import com.vizu.app.model.data.VizuPost
import kotlinx.coroutines.delay

/**
 * Service interface for Vizu backend API communications.
 */
interface VizuApiService {
    suspend fun fetchHomeFeed(): HomeFeedData
    suspend fun toggleZapPost(postId: String): Boolean
}

/**
 * Mock implementation of VizuApiService simulating network delay and realistic fake payload.
 */
class FakeVizuApiService : VizuApiService {

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

    override suspend fun fetchHomeFeed(): HomeFeedData {
        // Simulate network latency
        delay(600)
        return HomeFeedData(
            userPersonaName = "Alex Rivers",
            userAvatarUrl = null,
            stories = mockStories,
            posts = mockPosts.toList()
        )
    }

    override suspend fun toggleZapPost(postId: String): Boolean {
        delay(200)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index != -1) {
            val item = mockPosts[index]
            val nextZapped = !item.isZapped
            val nextCount = if (nextZapped) item.zapCount + 1 else (item.zapCount - 1).coerceAtLeast(0)
            mockPosts[index] = item.copy(isZapped = nextZapped, zapCount = nextCount)
            return nextZapped
        }
        return false
    }
}
