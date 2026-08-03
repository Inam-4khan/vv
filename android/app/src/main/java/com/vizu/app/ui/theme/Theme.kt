package com.vizu.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val VizuDarkColorScheme = darkColorScheme(
    primary = VizuTealPrimary,
    onPrimary = Color(0xFF062B34),
    primaryContainer = Color(0xFF0E434F),
    onPrimaryContainer = VizuTealLight,
    secondary = VizuRoseAccent,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF4A1525),
    onSecondaryContainer = Color(0xFFFFD1DC),
    tertiary = VizuAmberAccent,
    onTertiary = Color(0xFF062B34),
    background = VizuDarkBg,
    onBackground = VizuTextPrimary,
    surface = VizuCardBg,
    onSurface = VizuTextPrimary,
    surfaceVariant = VizuCardBorder,
    onSurfaceVariant = VizuTextSecondary,
    outline = VizuCardBorder,
    outlineVariant = Color(0xFF142D35)
)

/**
 * Custom Material3 VizuTheme for Android Jetpack Compose app.
 * Configured with dark navy background (#062B34), teal primary (#2EC4B6), and modern card surfaces.
 */
@Composable
fun VizuTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = VizuDarkColorScheme,
        content = content
    )
}

