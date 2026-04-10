package com.skytracker.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.skytracker.app.ui.navigation.SkyTrackerNavHost
import com.skytracker.app.ui.theme.SkyTrackerTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SkyTrackerTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    SkyTrackerNavHost()
                }
            }
        }
    }
}
