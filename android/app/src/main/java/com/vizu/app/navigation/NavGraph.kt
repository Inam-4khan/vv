package com.vizu.app.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.vizu.app.ui.screens.*
import com.vizu.app.viewmodel.HomeViewModel

/**
 * Route destinations for Vizu Android App.
 */
sealed class Screen(val route: String, val title: String) {
    data object Home : Screen("home", "Home")
    data object Explore : Screen("explore", "Explore")
    data object Profile : Screen("profile", "Profile")
    data object Settings : Screen("settings", "Settings")
    data object Login : Screen("login", "Login")
}

/**
 * Navigation Graph with smooth transition animations between screens.
 */
@Composable
fun VizuNavGraph(
    navController: NavHostController,
    modifier: Modifier = Modifier,
    startDestination: String = Screen.Home.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier,
        enterTransition = {
            fadeIn(animationSpec = tween(300)) + slideInHorizontally(
                animationSpec = tween(300),
                initialOffsetX = { 300 }
            )
        },
        exitTransition = {
            fadeOut(animationSpec = tween(300)) + slideOutHorizontally(
                animationSpec = tween(300),
                targetOffsetX = { -300 }
            )
        },
        popEnterTransition = {
            fadeIn(animationSpec = tween(300)) + slideInHorizontally(
                animationSpec = tween(300),
                initialOffsetX = { -300 }
            )
        },
        popExitTransition = {
            fadeOut(animationSpec = tween(300)) + slideOutHorizontally(
                animationSpec = tween(300),
                targetOffsetX = { 300 }
            )
        }
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                onFabClick = {
                    navController.navigate(Screen.Explore.route)
                }
            )
        }

        composable(Screen.Explore.route) {
            ExploreScreen(
                onNodeClick = { nodeTitle ->
                    // Navigation or action handler
                }
            )
        }

        composable(Screen.Profile.route) {
            ProfileScreen(
                onOpenSettings = {
                    navController.navigate(Screen.Settings.route)
                },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }
    }
}
