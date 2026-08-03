package com.vizu.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SpatialAudio
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vizu.app.ui.theme.*

data class SpatialNode(
    val id: String,
    val name: String,
    val category: String,
    val distance: String,
    val zapsCount: Int,
    val isGhostProtected: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExploreScreen(
    onNodeClick: (String) -> Unit = {}
) {
    var searchQuery by remember { mutableStateOf("") }
    val categories = listOf("All Grid", "AR Vistas", "Hush Whispers", "Proximity Nodes")
    var selectedCategory by remember { mutableStateOf("All Grid") }

    val nodes = listOf(
        SpatialNode("n1", "Central Vista AR Anchor", "AR Vistas", "37m away", 142, false),
        SpatialNode("n2", "Encrypted Hush Audio #409", "Hush Whispers", "110m away", 89, true),
        SpatialNode("n3", "Vizu Studio Proximity Hub", "Proximity Nodes", "240m away", 310, false),
        SpatialNode("n4", "Cyber Light Wave Station", "AR Vistas", "450m away", 95, false)
    )

    VizuTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header Title
                Text(
                    text = "Explore Spatial Grid",
                    style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Black),
                    color = VizuTealLight
                )
                Text(
                    text = "Discover nearby AR anchors & decrypted whispers",
                    style = MaterialTheme.typography.bodySmall,
                    color = VizuTextSecondary
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Search Bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search nodes, creators, or sectors...", color = VizuTextMuted, fontSize = 13.sp) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = VizuTealPrimary) },
                    trailingIcon = { Icon(Icons.Default.FilterList, contentDescription = "Filter", tint = VizuTextSecondary) },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = VizuCardBg,
                        unfocusedContainerColor = VizuCardBg,
                        focusedBorderColor = VizuTealPrimary,
                        unfocusedBorderColor = VizuCardBorder,
                        focusedTextColor = VizuTextPrimary,
                        unfocusedTextColor = VizuTextPrimary
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Category Filter Pills
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(categories) { cat ->
                        FilterChip(
                            selected = selectedCategory == cat,
                            onClick = { selectedCategory = cat },
                            label = { Text(cat, fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = VizuTealPrimary,
                                selectedLabelColor = Color(0xFF062B34),
                                containerColor = VizuCardBg,
                                labelColor = VizuTextSecondary
                            ),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Nodes List
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(nodes.filter {
                        selectedCategory == "All Grid" || it.category == selectedCategory
                    }) { node ->
                        ElevatedCard(
                            onClick = { onNodeClick(node.name) },
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.elevatedCardColors(containerColor = VizuCardBg),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(14.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(44.dp)
                                        .background(
                                            if (node.isGhostProtected) VizuRoseAccent.copy(alpha = 0.15f) else VizuTealPrimary.copy(alpha = 0.15f),
                                            RoundedCornerShape(12.dp)
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = if (node.isGhostProtected) Icons.Default.SpatialAudio else Icons.Default.Place,
                                        contentDescription = node.category,
                                        tint = if (node.isGhostProtected) VizuRoseAccent else VizuTealPrimary
                                    )
                                }

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = node.name,
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = VizuTextPrimary
                                    )
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = node.category, fontSize = 11.sp, color = VizuTealLight)
                                        Text(text = "•", fontSize = 11.sp, color = VizuTextMuted)
                                        Text(text = node.distance, fontSize = 11.sp, color = VizuTextSecondary)
                                    }
                                }

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.Bolt,
                                        contentDescription = "Zaps",
                                        tint = VizuAmberAccent,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "${node.zapsCount}",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = VizuTextPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
