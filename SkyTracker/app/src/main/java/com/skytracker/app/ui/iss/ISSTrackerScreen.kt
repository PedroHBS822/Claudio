package com.skytracker.app.ui.iss

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.skytracker.app.ui.theme.CardBackground
import com.skytracker.app.ui.theme.SpaceBlack

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ISSTrackerScreen(viewModel: ISSTrackerViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val locationPermission = rememberPermissionState(android.Manifest.permission.ACCESS_FINE_LOCATION)

    LaunchedEffect(locationPermission.status.isGranted) {
        if (locationPermission.status.isGranted) {
            viewModel.onLocationGranted()
        }
    }

    if (!locationPermission.status.isGranted) {
        ISSPermissionScreen { locationPermission.launchPermissionRequest() }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        ISSHeader(uiState)

        // Map
        ISSMapSection(uiState)

        // Info cards
        ISSInfoSection(uiState)

        Spacer(Modifier.height(16.dp))
    }
}

@Composable
private fun ISSHeader(uiState: ISSUiState) {
    Surface(color = CardBackground, modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "Rastreador ISS",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.weight(1f)
                )
                if (uiState.isOverhead) {
                    Surface(
                        color = Color(0xFF1B5E20),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = Color(0xFF66BB6A),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(Modifier.width(4.dp))
                            Text(
                                "Visível",
                                fontSize = 12.sp,
                                color = Color(0xFF66BB6A),
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
            Text(
                text = "Atualizado a cada 5 segundos  •  ${uiState.lastUpdateTime}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (uiState.isLoading) {
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
            }
            uiState.errorMessage?.let { err ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Warning, null, tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(err, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
private fun ISSMapSection(uiState: ISSUiState) {
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(
            uiState.issPosition ?: LatLng(0.0, 0.0), 2f
        )
    }

    // Follow ISS
    LaunchedEffect(uiState.issPosition) {
        uiState.issPosition?.let { pos ->
            cameraPositionState.animate(
                CameraUpdateFactory.newLatLng(pos),
                durationMs = 1000
            )
        }
    }

    GoogleMap(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp),
        cameraPositionState = cameraPositionState,
        properties = MapProperties(mapType = MapType.HYBRID),
        uiSettings = MapUiSettings(zoomControlsEnabled = true)
    ) {
        // ISS marker
        uiState.issPosition?.let { pos ->
            Marker(
                state = MarkerState(position = pos),
                title = "ISS",
                snippet = "Lat: ${"%.2f".format(uiState.issLatitude)}° " +
                        "Lon: ${"%.2f".format(uiState.issLongitude)}°"
            )
        }

        // User location
        if (uiState.userLatitude != 0.0 || uiState.userLongitude != 0.0) {
            Marker(
                state = MarkerState(LatLng(uiState.userLatitude, uiState.userLongitude)),
                title = "Você",
                snippet = "Sua localização"
            )
        }

        // Ground track (simplified polyline)
        if (uiState.groundTrack.size >= 2) {
            Polyline(
                points = uiState.groundTrack,
                color = Color(0xFF00E676),
                width = 4f
            )
        }
    }
}

@Composable
private fun ISSInfoSection(uiState: ISSUiState) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "Informações da ISS",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ISSInfoCard(
                label = "Latitude",
                value = "${"%.2f".format(uiState.issLatitude)}°",
                modifier = Modifier.weight(1f)
            )
            ISSInfoCard(
                label = "Longitude",
                value = "${"%.2f".format(uiState.issLongitude)}°",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ISSInfoCard(
                label = "Altitude",
                value = "${uiState.issAltitudeKm.toInt()} km",
                modifier = Modifier.weight(1f)
            )
            ISSInfoCard(
                label = "Velocidade",
                value = "${"%,.0f".format(uiState.issVelocityKmh)} km/h",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(8.dp))

        uiState.distanceFromUserKm?.let { dist ->
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (uiState.isOverhead) Color(0xFF0D3320) else CardBackground
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (uiState.isOverhead) Icons.Default.CheckCircle else Icons.Default.Info,
                        contentDescription = null,
                        tint = if (uiState.isOverhead) Color(0xFF66BB6A) else MaterialTheme.colorScheme.primary
                    )
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (uiState.isOverhead) "ISS pode estar visível!" else "ISS está longe",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = if (uiState.isOverhead) Color(0xFF66BB6A) else MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Distância ao ponto sub-orbital: ${"%,.0f".format(dist)} km",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        if (uiState.isOverhead) {
                            Text(
                                text = "Procure um objeto brilhante se movendo rapidamente pelo céu!",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFF66BB6A)
                            )
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        // ISS facts card
        ISSFactsCard()
    }
}

@Composable
private fun ISSInfoCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun ISSFactsCard() {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                "Sobre a ISS",
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(8.dp))
            val facts = listOf(
                "Orbita a Terra a ~408 km de altitude",
                "Completa uma volta em ~92 minutos",
                "Viaja a ~27.600 km/h",
                "Visível a olho nu como um ponto muito brilhante",
                "Dimensões: 109m × 73m (maior do que um campo de futebol)"
            )
            facts.forEach { fact ->
                Row(
                    modifier = Modifier.padding(vertical = 2.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Text("•", color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(end = 8.dp))
                    Text(fact, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}

@Composable
private fun ISSPermissionScreen(onRequest: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("🛸", fontSize = 64.sp, textAlign = TextAlign.Center)
        Spacer(Modifier.height(24.dp))
        Text(
            text = "Permissão de Localização",
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(12.dp))
        Text(
            text = "Para calcular a distância até a ISS e verificar se ela está visível no seu céu, precisamos da sua localização.",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(32.dp))
        Button(onClick = onRequest) { Text("Conceder Permissão") }
    }
}
