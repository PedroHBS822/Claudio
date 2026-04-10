package com.skytracker.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.skytracker.app.ui.iss.ISSTrackerScreen
import com.skytracker.app.ui.skymap.SkyMapScreen
import com.skytracker.app.ui.weather.WeatherScreen

sealed class Screen(val route: String, val label: String, val icon: ImageVector) {
    object SkyMap  : Screen("sky_map",  "Mapa do Céu", Icons.Default.Star)
    object ISS     : Screen("iss",      "ISS",         Icons.Default.Public)
    object Weather : Screen("weather",  "Clima",       Icons.Default.Cloud)
}

private val bottomNavItems = listOf(Screen.SkyMap, Screen.ISS, Screen.Weather)

@Composable
fun SkyTrackerNavHost() {
    val navController = rememberNavController()
    val navBackStack by navController.currentBackStackEntryAsState()
    val currentDest = navBackStack?.destination

    Scaffold(
        bottomBar = {
            NavigationBar {
                bottomNavItems.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.label) },
                        label = { Text(screen.label) },
                        selected = currentDest?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.SkyMap.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.SkyMap.route)  { SkyMapScreen() }
            composable(Screen.ISS.route)     { ISSTrackerScreen() }
            composable(Screen.Weather.route) { WeatherScreen() }
        }
    }
}
