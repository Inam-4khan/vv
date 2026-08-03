package com.vizu.app

import com.vizu.app.ui.theme.*
import androidx.compose.ui.graphics.Color
import org.junit.Assert.assertEquals
import org.junit.Test

class ComposeThemeTest {

    @Test
    fun `Vizu dark navy theme colors are properly configured`() {
        assertEquals(Color(0xFF062B34), VizuDarkBg)
        assertEquals(Color(0xFF0F2229), VizuCardBg)
        assertEquals(Color(0xFF1E3A42), VizuCardBorder)
        assertEquals(Color(0xFF2EC4B6), VizuTealPrimary)
        assertEquals(Color(0xFF80FFEC), VizuTealLight)
        assertEquals(Color(0xFFF43F5E), VizuRoseAccent)
        assertEquals(Color(0xFFFFB703), VizuAmberAccent)
    }
}
