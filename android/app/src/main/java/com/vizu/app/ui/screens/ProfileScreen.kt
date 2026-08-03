package com.vizu.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vizu.app.ui.theme.*

@Composable
fun ProfileScreen(
    onOpenSettings: () -> Unit = {},
    onLogout: () -> Unit = {}
) {
    var isGhostMode by remember { mutableStateOf(false) }

    VizuTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Top Bar Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IconButton(
                        onClick = onOpenSettings,
                        modifier = Modifier.background(VizuCardBg, CircleShape)
                    ) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings", tint = VizuTextPrimary)
                    }
                    IconButton(
                        onClick = onLogout,
                        modifier = Modifier.background(VizuRoseAccent.copy(alpha = 0.2f), CircleShape)
                    ) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = VizuRoseAccent)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Avatar
                Box(contentAlignment = Alignment.BottomEnd) {
                    Surface(
                        modifier = Modifier.size(88.dp),
                        shape = CircleShape,
                        color = VizuTealPrimary.copy(alpha = 0.2f),
                        border = androidx.compose.foundation.BorderStroke(3.dp, VizuTealPrimary)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "A",
                                style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Black),
                                color = VizuTealLight
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Name & Persona
                Text(
                    text = "Alex Rivers",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                    color = VizuTextPrimary
                )
                Text(
                    text = "@alex_persona • NYC Grid",
                    style = MaterialTheme.typography.bodySmall,
                    color = VizuTextSecondary
                )

                Spacer(modifier = Modifier.height(8.dp))

                Surface(
                    color = VizuTealPrimary.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "AR Creator & Proximity Streamer",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = VizuTealLight,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Stats Grid Card
                ElevatedCard(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.elevatedCardColors(containerColor = VizuCardBg),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("1,420", fontWeight = FontWeight.Black, fontSize = 18.sp, color = VizuTextPrimary)
                            Text("Zaps", fontSize = 11.sp, color = VizuTextMuted)
                        }
                        Divider(modifier = Modifier.height(30.dp).width(1.dp), color = VizuCardBorder)
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("384", fontWeight = FontWeight.Black, fontSize = 18.sp, color = VizuTextPrimary)
                            Text("Connections", fontSize = 11.sp, color = VizuTextMuted)
                        }
                        Divider(modifier = Modifier.height(30.dp).width(1.dp), color = VizuCardBorder)
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("18", fontWeight = FontWeight.Black, fontSize = 18.sp, color = VizuTextPrimary)
                            Text("AR Anchors", fontSize = 11.sp, color = VizuTextMuted)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Ghost Mode Toggle Card
                ElevatedCard(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.elevatedCardColors(containerColor = VizuCardBg),
                    modifier = Modifier.fillMaxWidth()
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
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .background(VizuRoseAccent.copy(alpha = 0.2f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Shield, contentDescription = "Ghost Mode", tint = VizuRoseAccent)
                            }
                            Column {
                                Text("Ghost Mode Encrypted", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = VizuTextPrimary)
                                Text("Hide proximity identity from nearby scanners", fontSize = 11.sp, color = VizuTextMuted)
                            }
                        }
                        Switch(
                            checked = isGhostMode,
                            onCheckedChange = { isGhostMode = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = VizuRoseAccent,
                                checkedTrackColor = VizuRoseAccent.copy(alpha = 0.3f)
                            )
                        )
                    }
                }
            }
        }
    }
}
