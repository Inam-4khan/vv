package com.vizu.app.model.data

/**
 * Domain model representing a Vizu feed post/stream item.
 */
data class VizuPost(
    val id: String,
    val authorName: String,
    val authorUsername: String,
    val authorAvatarUrl: String?,
    val isGhostMode: Boolean,
    val timestamp: String,
    val contentText: String,
    val mediaType: MediaType = MediaType.TEXT,
    val mediaUrl: String? = null,
    val locationTag: String? = null,
    val zapCount: Int = 0,
    val whisperCount: Int = 0,
    val isZapped: Boolean = false
)

enum class MediaType {
    TEXT, IMAGE, AR_VISTA, HUSH_AUDIO
}

/**
 * Domain model representing story highlight preview items.
 */
data class StoryHighlight(
    val id: String,
    val authorName: String,
    val avatarUrl: String?,
    val hasUnseen: Boolean,
    val isGhost: Boolean = false
)

/**
 * Wrapper object holding top stories and feed posts for the home view.
 */
data class HomeFeedData(
    val userPersonaName: String,
    val userAvatarUrl: String?,
    val stories: List<StoryHighlight>,
    val posts: List<VizuPost>
)
