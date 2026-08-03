package com.vizu.app.ui.screens

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.vizu.app.navigation.Screen
import com.vizu.app.navigation.VizuNavGraph
import com.vizu.app.ui.theme.VizuCardBg
import com.vizu.app.ui.theme.VizuCardBorder
import com.vizu.app.ui.theme.VizuDarkBg
import com.vizu.app.ui.theme.VizuTealPrimary
import com.vizu.app.ui.theme.VizuTextMuted
import com.vizu.app.ui.theme.VizuTheme

/**
 * Bottom Navigation Bar tab model.
 */
data class BottomNavItem(
    val route: String,
    val title: String,
    val icon: ImageVector
)

val bottomNavItems = listOf(
    BottomNavItem(Screen.Home.route, "Home", Icons.Default.Home),
    BottomNavItem(Screen.Explore.route, "Explore", Icons.Default.Search),
    BottomNavItem(Screen.Profile.route, "Profile", Icons.Default.Person)
)

/**
 * MainScreen Composable containing scaffold with bottom navigation bar and NavGraph.
 */
@Composable
fun MainScreen(
    navController: NavHostController = rememberNavController()
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Hide bottom bar on login screen
    val shouldShowBottomBar = currentRoute in bottomNavItems.map { it.route }

    VizuTheme {
        Scaffold(
            bottomBar = {
                if (shouldShowBottomBar) {
                    BottomNavigationBar(
                        navController = navController,
                        currentRoute = currentRoute
                    )
                }
            },
            containerColor = VizuDarkBg
        ) { paddingValues ->
            VizuNavGraph(
                navController = navController,
                modifier = Modifier.padding(paddingValues)
            )
        }
    }
}

/**
 * Material3 Bottom Navigation Bar with 3 tabs: Home, Explore, Profile.
 */
@Composable
fun BottomNavigationBar(
    navController: NavHostController,
    currentRoute: String?
) {
    NavigationBar(
        containerColor = VizuCardBg,
        contentColor = VizuTealPrimary,
        tonalElevation = 8.dp
    ) {
        bottomNavItems.forEach { item ->
            val isSelected = currentRoute == item.route
            NavigationBarItem(
                selected = isSelected,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title
                    )
                },
                label = {
                    Text(
                        text = item.title,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Color(0xFF062B34),
                    selectedTextColor = VizuTealPrimary,
                    indicatorColor = VizuTealPrimary,
                    unselectedIconColor = VizuTextMuted,
                    unselectedTextColor = VizuTextMuted
                )
            )
        }
    }
}
