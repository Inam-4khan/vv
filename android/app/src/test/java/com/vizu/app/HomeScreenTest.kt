package com.vizu.app

import com.vizu.app.ui.screens.HomeMockData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class HomeScreenTest {

    @Test
    fun `HomeMockData contains expected greeting name and stats`() {
        assertEquals("Alex", HomeMockData.userName)
        assertEquals("AR Creator & Spatial Streamer", HomeMockData.personaBadge)
        assertEquals(3, HomeMockData.statsList.size)
        
        val zapsStat = HomeMockData.statsList[0]
        assertEquals("Zaps Received", zapsStat.label)
        assertEquals("1,420", zapsStat.number)
    }

    @Test
    fun `HomeMockData recentActivities list is populated with 5 items`() {
        val activities = HomeMockData.recentActivities
        assertEquals(5, activities.size)
        assertTrue(activities.any { it.title.contains("Zap") })
        assertTrue(activities.any { it.title.contains("Whisper") })
    }
}
