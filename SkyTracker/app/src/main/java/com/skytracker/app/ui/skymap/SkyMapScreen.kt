package com.skytracker.app.ui.skymap

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.skytracker.app.data.model.CelestialBodyUI
import com.skytracker.app.data.model.CelestialType
import com.skytracker.app.ui.theme.CardBackground
import com.skytracker.app.ui.theme.SpaceBlack
import kotlin.math.min

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun SkyMapScreen(viewModel: SkyMapViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val locationPermission = rememberPermissionState(android.Manifest.permission.ACCESS_FINE_LOCATION)

    LaunchedEffect(locationPermission.status.isGranted) {
        if (locationPermission.status.isGranted) {
            viewModel.onLocationGranted()
        }
    }

    if (!locationPermission.status.isGranted) {
        PermissionRequestScreen { locationPermission.launchPermissionRequest() }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        SkyMapHeader(uiState)

        // Sky Canvas
        SkyDomeCanvas(
            bodies = uiState.celestialBodies,
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .padding(16.dp)
        )

        // Info cards for visible objects
        VisibleBodiesSection(bodies = uiState.celestialBodies)

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
private fun SkyMapHeader(uiState: SkyMapUiState) {
    Surface(
        color = CardBackground,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Mapa do Céu",
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.primary
            )
            if (uiState.lastUpdateTime.isNotEmpty()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(Modifier.width(4.dp))
                    Text(
                        text = "Lat: ${"%.4f".format(uiState.latitude)}° " +
                                "Lon: ${"%.4f".format(uiState.longitude)}°",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.weight(1f))
                    Icon(
                        Icons.Default.Refresh,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(Modifier.width(2.dp))
                    Text(
                        text = uiState.lastUpdateTime,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            if (uiState.isLoading) {
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
            }
            uiState.errorMessage?.let { err ->
                Text(text = err, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
            }
        }
    }
}

@Composable
fun SkyDomeCanvas(
    bodies: List<CelestialBodyUI>,
    modifier: Modifier = Modifier
) {
    BoxWithConstraints(modifier = modifier) {
        val widthPx  = constraints.maxWidth.toFloat()
        val heightPx = constraints.maxHeight.toFloat()
        val cx = widthPx  / 2f
        val cy = heightPx / 2f
        val radius = min(cx, cy) - 4f

        // ── All graphical drawing on the Canvas ───────────────────────────────
        Canvas(modifier = Modifier.fillMaxSize()) {

            // Background – space gradient
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFF0A1245), Color(0xFF020818)),
                    center = Offset(cx, cy),
                    radius = radius
                ),
                radius = radius,
                center = Offset(cx, cy)
            )

            // Altitude circles (30° and 60°)
            listOf(30.0, 60.0).forEach { alt ->
                val r = (radius * (90.0 - alt) / 90.0).toFloat()
                drawCircle(
                    color = Color(0x33FFFFFF),
                    radius = r,
                    center = Offset(cx, cy),
                    style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1f)
                )
            }

            // Horizon ring
            drawCircle(
                color = Color(0x66AAAAAA),
                radius = radius,
                center = Offset(cx, cy),
                style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2f)
            )

            // Cardinal direction lines
            listOf(0.0, 90.0, 180.0, 270.0).forEach { az ->
                val azRad = Math.toRadians(az)
                val ex = cx + (radius * Math.sin(azRad)).toFloat()
                val ey = cy - (radius * Math.cos(azRad)).toFloat()
                drawLine(
                    color = Color(0x33FFFFFF),
                    start = Offset(cx, cy),
                    end   = Offset(ex, ey),
                    strokeWidth = 1f
                )
            }

            // Stars (background dots)
            drawStarfield(cx, cy, radius)

            // Celestial bodies
            bodies.forEach { body ->
                if (body.altitude > -5.0) {
                    val (dx, dy) = com.skytracker.app.util.AstronomyUtils.horizontalToCanvas(
                        body.altitude, body.azimuth, radius
                    )
                    drawCelestialBody(body, cx + dx, cy + dy)
                }
            }
        }

        // ── Cardinal labels as Compose Text (avoids nativeCanvas) ────────────
        val labelOffset = radius + 28f
        listOf("N" to 0.0, "L" to 90.0, "S" to 180.0, "O" to 270.0).forEach { (label, az) ->
            val azRad = Math.toRadians(az)
            val lx = (cx + labelOffset * Math.sin(azRad)).toFloat()
            val ly = (cy - labelOffset * Math.cos(azRad)).toFloat()
            Text(
                text = label,
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.offset {
                    IntOffset(
                        (lx - 8.dp.toPx()).toInt(),
                        (ly - 8.dp.toPx()).toInt()
                    )
                }
            )
        }
    }
}

private fun DrawScope.drawStarfield(cx: Float, cy: Float, radius: Float) {
    val stars = listOf(
        Triple(0.3f, 0.1f, 1.5f), Triple(-0.4f, 0.2f, 1f),  Triple(0.6f, -0.3f, 2f),
        Triple(-0.2f, -0.5f, 1.5f), Triple(0.5f, 0.5f, 1f), Triple(-0.6f, -0.1f, 2f),
        Triple(0.1f, 0.7f, 1f), Triple(-0.7f, 0.3f, 1.5f),  Triple(0.4f, -0.6f, 1f),
        Triple(-0.3f, 0.6f, 2f), Triple(0.7f, 0.1f, 1f),    Triple(-0.5f, -0.4f, 1.5f),
        Triple(0.2f, -0.7f, 1f), Triple(-0.1f, 0.8f, 2f),   Triple(0.8f, -0.1f, 1f),
        Triple(-0.8f, 0.2f, 1.5f), Triple(0.15f, 0.6f, 1f), Triple(0.65f, -0.5f, 1.5f),
        Triple(-0.55f, 0.5f, 1f), Triple(0.35f, 0.75f, 2f),
        Triple(0.55f, 0.35f, 1f), Triple(-0.35f, -0.7f, 1.5f), Triple(0.75f, 0.25f, 2f),
        Triple(-0.25f, 0.45f, 1f), Triple(0.45f, -0.45f, 1.5f)
    )
    stars.forEach { (rx, ry, sz) ->
        val x = cx + rx * radius
        val y = cy + ry * radius
        if ((rx * rx + ry * ry) < 1f) {
            drawCircle(color = Color(0xCCFFFFFF), radius = sz, center = Offset(x, y))
        }
    }
}

private fun DrawScope.drawCelestialBody(body: CelestialBodyUI, x: Float, y: Float) {
    val baseR = when (body.type) {
        CelestialType.SUN    -> 18f
        CelestialType.MOON   -> 14f
        CelestialType.PLANET -> 7f * body.size
        CelestialType.ISS    -> 8f
    }

    val alpha = if (body.altitude < 0) 0.3f else 1f
    val col = body.color.copy(alpha = alpha)

    // Glow for Sun and Moon
    if (body.type == CelestialType.SUN || body.type == CelestialType.MOON) {
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(col.copy(alpha = 0.4f), Color.Transparent),
                center = Offset(x, y),
                radius = baseR * 2.5f
            ),
            radius = baseR * 2.5f,
            center = Offset(x, y)
        )
    }

    drawCircle(color = col, radius = baseR, center = Offset(x, y))

    // ISS: draw an "X" marker
    if (body.type == CelestialType.ISS) {
        drawLine(col, Offset(x - 6f, y - 6f), Offset(x + 6f, y + 6f), strokeWidth = 2f)
        drawLine(col, Offset(x + 6f, y - 6f), Offset(x - 6f, y + 6f), strokeWidth = 2f)
    }
}

@Composable
private fun VisibleBodiesSection(bodies: List<CelestialBodyUI>) {
    val visible = bodies.filter { it.isVisible }.sortedByDescending { it.altitude }

    if (visible.isEmpty()) return

    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text(
            text = "Corpos visíveis agora",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        visible.forEach { body ->
            CelestialBodyCard(body)
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
private fun CelestialBodyCard(body: CelestialBodyUI) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = body.color,
                shape = RoundedCornerShape(50),
                modifier = Modifier.size(12.dp)
            ) {}
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = body.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = compassDirection(body.azimuth),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${"%.1f".format(body.altitude)}°",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "altitude",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

private fun compassDirection(az: Double): String {
    val dirs = listOf("N", "NNE", "NE", "ENE", "L", "ESE", "SE", "SSE",
        "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO")
    val idx = ((az + 11.25) / 22.5).toInt() % 16
    return "Az: ${"%.1f".format(az)}° (${dirs[idx]})"
}

@Composable
private fun PermissionRequestScreen(onRequest: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("🔭", fontSize = 64.sp, textAlign = TextAlign.Center)
        Spacer(Modifier.height(24.dp))
        Text(
            text = "Permissão de Localização",
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(12.dp))
        Text(
            text = "O SkyTracker precisa da sua localização para calcular a posição dos astros e da ISS no seu céu.",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(32.dp))
        Button(onClick = onRequest) {
            Text("Conceder Permissão")
        }
    }
}
