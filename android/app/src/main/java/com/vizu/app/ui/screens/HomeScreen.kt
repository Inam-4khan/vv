package com.vizu.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vizu.app.ui.theme.*
import com.vizu.app.viewmodel.HomeViewModel
import com.vizu.app.viewmodel.HomeUiState

/**
 * Data class representing a Stat Card item.
 */
data class StatCardData(
    val id: String,
    val icon: ImageVector,
    val number: String,
    val label: String,
    val tint: Color
)

/**
 * Data class representing a Recent Activity item.
 */
data class ActivityItemData(
    val id: String,
    val icon: ImageVector,
    val title: String,
    val subtitle: String,
    val timestamp: String,
    val iconBgColor: Color,
    val iconTint: Color
)

/**
 * Default Mock Data for Vizu Home Screen.
 */
object HomeMockData {
    val userName: String = "Alex"
    val personaBadge: String = "AR Creator & Spatial Streamer"

    val statsList = listOf(
        StatCardData(
            id = "stat_1",
            icon = Icons.Default.Bolt,
            number = "1,420",
            label = "Zaps Received",
            tint = VizuTealPrimary
        ),
        StatCardData(
            id = "stat_2",
            icon = Icons.Default.TrendingUp,
            number = "88",
            label = "Active Whispers",
            tint = VizuTealLight
        ),
        StatCardData(
            id = "stat_3",
            icon = Icons.Default.Group,
            number = "24.5k",
            label = "Grid Views",
            tint = VizuAmberAccent
        )
    )

    val recentActivities = listOf(
        ActivityItemData(
            id = "act_1",
            icon = Icons.Default.Bolt,
            title = "New Zap from @kai_vista",
            subtitle = "Liked your Spatial Vista node at Central Park",
            timestamp = "2m ago",
            iconBgColor = VizuTealPrimary.copy(alpha = 0.15f),
            iconTint = VizuTealPrimary
        ),
        ActivityItemData(
            id = "act_2",
            icon = Icons.Default.VolumeUp,
            title = "Hush Whisper Decrypted",
            subtitle = "12 nearby listeners unlocked your audio log",
            timestamp = "18m ago",
            iconBgColor = VizuTealLight.copy(alpha = 0.15f),
            iconTint = VizuTealLight
        ),
        ActivityItemData(
            id = "act_3",
            icon = Icons.Default.Place,
            title = "Proximity Grid Connection",
            subtitle = "New spatial anchor synchronized in Sector 4",
            timestamp = "1h ago",
            iconBgColor = VizuAmberAccent.copy(alpha = 0.15f),
            iconTint = VizuAmberAccent
        ),
        ActivityItemData(
            id = "act_4",
            icon = Icons.Default.PersonAdd,
            title = "New Follower",
            subtitle = "@aria_spatial joined your Vizu network",
            timestamp = "3h ago",
            iconBgColor = VizuTealPrimary.copy(alpha = 0.15f),
            iconTint = VizuTealPrimary
        ),
        ActivityItemData(
            id = "act_5",
            icon = Icons.Default.Shield,
            title = "Ghost Mode Auto-Shield",
            subtitle = "Encrypted proximity beacon refreshed successfully",
            timestamp = "5h ago",
            iconBgColor = VizuRoseAccent.copy(alpha = 0.15f),
            iconTint = VizuRoseAccent
        )
    )
}

/**
 * Polished Vizu HomeScreen Composable with Material3.
 */
@Composable
fun HomeScreen(
    userName: String = HomeMockData.userName,
    personaBadge: String = HomeMockData.personaBadge,
    stats: List<StatCardData> = HomeMockData.statsList,
    activities: List<ActivityItemData> = HomeMockData.recentActivities,
    onFabClick: () -> Unit = {}
) {
    VizuTheme {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = MaterialTheme.colorScheme.background,
            floatingActionButton = {
                FloatingActionButton(
                    onClick = onFabClick,
                    containerColor = VizuTealPrimary,
                    contentColor = Color(0xFF062B34),
                    shape = RoundedCornerShape(16.dp),
                    elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Create Action",
                        modifier = Modifier.size(24.dp)
                    )
                }
            }
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                // 1) Top Greeting Section
                item {
                    GreetingHeader(
                        userName = userName,
                        personaBadge = personaBadge
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                }

                // 2) Stats Horizontal Row Section
                item {
                    StatsRowSection(stats = stats)
                    Spacer(modifier = Modifier.height(24.dp))
                }

                // 3) Section Title: Recent Activity
                item {
                    Text(
                        text = "Recent activity",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        ),
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }

                // 4) Activity Items List
                items(activities, key = { it.id }) { activity ->
                    ActivityItemCard(activity = activity)
                }
            }
        }
    }
}

/**
 * 1) Top section with greeting ("Good morning, [Name]") and profile avatar
 */
@Composable
private fun GreetingHeader(
    userName: String,
    personaBadge: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = "Good morning, $userName",
                style = MaterialTheme.typography.headlineSmall.copy(
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-0.5).sp
                ),
                color = VizuTealLight
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = personaBadge,
                style = MaterialTheme.typography.bodyMedium,
                color = VizuTextSecondary
            )
        }

        // Profile Avatar with Status Indicator
        Box(contentAlignment = Alignment.BottomEnd) {
            Surface(
                modifier = Modifier.size(52.dp),
                shape = CircleShape,
                color = VizuTealPrimary.copy(alpha = 0.2f),
                border = androidx.compose.foundation.BorderStroke(2.dp, VizuTealPrimary)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = userName.take(1).uppercase(),
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Black
                        ),
                        color = VizuTealLight
                    )
                }
            }

            // Online status dot
            Box(
                modifier = Modifier
                    .size(14.dp)
                    .background(VizuTealPrimary, CircleShape)
                    .border(2.dp, VizuDarkBg, CircleShape)
            )
        }
    }
}

/**
 * 2) Horizontal scrollable row of stats cards (3 cards with icon, number, label)
 */
@Composable
private fun StatsRowSection(stats: List<StatCardData>) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(stats, key = { it.id }) { stat ->
            ElevatedCard(
                modifier = Modifier.width(150.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.elevatedCardColors(
                    containerColor = VizuCardBg,
                    contentColor = VizuTextPrimary
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(stat.tint.copy(alpha = 0.15f), RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = stat.icon,
                            contentDescription = stat.label,
                            tint = stat.tint,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Text(
                        text = stat.number,
                        style = MaterialTheme.typography.headlineSmall.copy(
                            fontWeight = FontWeight.Bold
                        ),
                        color = VizuTextPrimary
                    )

                    Text(
                        text = stat.label,
                        style = MaterialTheme.typography.labelSmall,
                        color = VizuTextMuted
                    )
                }
            }
        }
    }
}

/**
 * 3) Activity item card inside LazyColumn
 */
@Composable
private fun ActivityItemCard(activity: ActivityItemData) {
    ElevatedCard(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = VizuCardBg,
            contentColor = VizuTextPrimary
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .background(activity.iconBgColor, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = activity.icon,
                    contentDescription = activity.title,
                    tint = activity.iconTint,
                    modifier = Modifier.size(22.dp)
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = activity.title,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp
                        ),
                        color = VizuTextPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    Text(
                        text = activity.timestamp,
                        style = MaterialTheme.typography.labelSmall,
                        color = VizuTextMuted
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = activity.subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = VizuTextSecondary,
                    lineHeight = 16.sp
                )
            }
        }
    }
}
