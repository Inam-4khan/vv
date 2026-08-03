package com.vizu.app

import com.vizu.app.navigation.Screen
import com.vizu.app.ui.screens.bottomNavItems
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class NavigationTest {

    @Test
    fun `Screen sealed class holds valid routes`() {
        assertEquals("home", Screen.Home.route)
        assertEquals("explore", Screen.Explore.route)
        assertEquals("profile", Screen.Profile.route)
        assertEquals("settings", Screen.Settings.route)
        assertEquals("login", Screen.Login.route)
    }

    @Test
    fun `Bottom navigation items list contains 3 primary tabs`() {
        assertEquals(3, bottomNavItems.size)
        val routes = bottomNavItems.map { it.route }
        assertTrue(routes.contains("home"))
        assertTrue(routes.contains("explore"))
        assertTrue(routes.contains("profile"))
    }
}
