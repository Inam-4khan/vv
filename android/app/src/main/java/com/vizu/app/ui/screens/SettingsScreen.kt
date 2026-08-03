package com.vizu.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vizu.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBackClick: () -> Unit = {},
    onLogout: () -> Unit = {}
) {
    var notificationsEnabled by remember { mutableStateOf(true) }
    var hushAutoDecrypt by remember { mutableStateOf(true) }
    var darkThemeActive by remember { mutableStateOf(true) }

    VizuTheme {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("Settings", fontWeight = FontWeight.Bold) },
                    navigationIcon = {
                        IconButton(onClick = onBackClick) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = VizuTextPrimary)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = VizuDarkBg,
                        titleContentColor = VizuTextPrimary
                    )
                )
            },
            containerColor = VizuDarkBg
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    Text(
                        text = "PREFERENCES",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = VizuTealLight,
                        letterSpacing = 1.sp
                    )
                }

                item {
                    ElevatedCard(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.elevatedCardColors(containerColor = VizuCardBg)
                    ) {
                        Column {
                            SettingToggleItem(
                                icon = Icons.Default.Notifications,
                                title = "Spatial Grid Notifications",
                                subtitle = "Alerts for nearby Zaps & Whispers",
                                checked = notificationsEnabled,
                                onCheckedChange = { notificationsEnabled = it }
                            )
                            Divider(color = VizuCardBorder)
                            SettingToggleItem(
                                icon = Icons.Default.VolumeUp,
                                title = "Auto-Decrypt Hush Whispers",
                                subtitle = "Decrypt bluetooth whisper streams automatically",
                                checked = hushAutoDecrypt,
                                onCheckedChange = { hushAutoDecrypt = it }
                            )
                            Divider(color = VizuCardBorder)
                            SettingToggleItem(
                                icon = Icons.Default.Palette,
                                title = "Dark Spatial Theme",
                                subtitle = "Eye-safe dark canvas mode",
                                checked = darkThemeActive,
                                onCheckedChange = { darkThemeActive = it }
                            )
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onLogout,
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = VizuRoseAccent.copy(alpha = 0.2f)),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Logout Persona Session", color = VizuRoseAccent, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun SettingToggleItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(VizuTealPrimary.copy(alpha = 0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = title, tint = VizuTealPrimary, modifier = Modifier.size(18.dp))
            }
            Column {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = VizuTextPrimary)
                Text(subtitle, fontSize = 11.sp, color = VizuTextMuted)
            }
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = VizuTealPrimary,
                checkedTrackColor = VizuTealPrimary.copy(alpha = 0.3f)
            )
        )
    }
}
