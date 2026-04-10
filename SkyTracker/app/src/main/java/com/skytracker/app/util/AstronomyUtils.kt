package com.skytracker.app.util

import com.skytracker.app.data.model.Planet
import java.util.Date
import kotlin.math.*

data class EquatorialCoord(
    val ra: Double,   // Right Ascension in hours (0-24)
    val dec: Double   // Declination in degrees (-90 to +90)
)

data class HorizontalCoord(
    val alt: Double,  // Altitude in degrees (-90 to +90)
    val az: Double    // Azimuth in degrees clockwise from North (0-360)
)

data class OrbitalElements(
    val a: Double,     // semi-major axis (AU)
    val e: Double,     // eccentricity
    val i: Double,     // inclination (degrees)
    val omega: Double, // longitude of ascending node Ω (degrees)
    val w: Double,     // argument of perihelion ω (degrees)
    val M: Double      // mean anomaly (degrees)
)

object AstronomyUtils {

    // ─── Julian Date ─────────────────────────────────────────────────────────

    fun julianDate(date: Date): Double {
        // Milliseconds since Unix epoch (1970-01-01 00:00:00 UTC)
        // J2000.0 epoch = 2000-01-01 12:00:00 TT ≈ 2000-01-01 11:58:56 UTC
        return date.time / 86400000.0 + 2440587.5
    }

    // ─── Sidereal Time ───────────────────────────────────────────────────────

    /**
     * Greenwich Mean Sidereal Time in hours.
     */
    private fun greenwichSiderealTime(jd: Double): Double {
        val T = (jd - 2451545.0) / 36525.0
        // IAU formula
        var gmst = 280.46061837 +
                360.98564736629 * (jd - 2451545.0) +
                0.000387933 * T * T -
                T * T * T / 38710000.0
        gmst = gmst.mod(360.0)
        return gmst / 15.0
    }

    /**
     * Local Apparent Sidereal Time in hours.
     * @param longitude Observer's longitude in degrees (East positive)
     */
    fun localSiderealTime(jd: Double, longitude: Double): Double {
        val gmst = greenwichSiderealTime(jd)
        var lst = gmst + longitude / 15.0
        lst = lst.mod(24.0)
        if (lst < 0) lst += 24.0
        return lst
    }

    // ─── Sun Position ────────────────────────────────────────────────────────

    /**
     * Sun's geocentric equatorial coordinates.
     * Based on the USNO simplified algorithm – accuracy ~1 arcminute.
     */
    fun sunPosition(jd: Double): EquatorialCoord {
        val d = jd - 2451545.0                              // days from J2000.0
        val g = (357.529 + 0.98560028 * d).toRadians()     // mean anomaly
        val q = (280.459 + 0.98564736 * d).mod(360.0)      // mean longitude

        // Ecliptic longitude (degrees)
        val L = (q + 1.915 * sin(g) + 0.020 * sin(2.0 * g)).mod(360.0)
        val e = 23.439 - 0.00000036 * d                     // obliquity of ecliptic

        val Lrad = L.toRadians()
        val erad = e.toRadians()

        val ra = atan2(cos(erad) * sin(Lrad), cos(Lrad)).toDegrees().mod(360.0) / 15.0
        val dec = asin(sin(erad) * sin(Lrad)).toDegrees()

        return EquatorialCoord(ra, dec)
    }

    // ─── Moon Position ───────────────────────────────────────────────────────

    /**
     * Moon's geocentric equatorial coordinates.
     * Simplified algorithm (Jean Meeus, Ch. 47 condensed) – accuracy ~1°.
     */
    fun moonPosition(jd: Double): EquatorialCoord {
        val d = jd - 2451545.0

        // Fundamental arguments (degrees)
        val L  = (218.3165 + 13.1763966 * d).mod(360.0)   // mean longitude
        val M  = (134.9629 + 13.0649929 * d).mod(360.0)   // mean anomaly (Moon)
        val Ms = (357.5291 + 0.9856003  * d).mod(360.0)   // mean anomaly (Sun)
        val F  = (93.2720  + 13.2299290 * d).mod(360.0)   // argument of latitude
        val D  = (297.8502 + 12.1907179 * d).mod(360.0)   // mean elongation

        val Mrad  = M.toRadians()
        val Msrad = Ms.toRadians()
        val Frad  = F.toRadians()
        val Drad  = D.toRadians()

        // Ecliptic longitude correction (degrees) – main periodic terms
        val dLon = 6.2886 * sin(Mrad) +
                1.2740 * sin(2.0 * Drad - Mrad) +
                0.6583 * sin(2.0 * Drad) +
                0.2136 * sin(2.0 * Mrad) -
                0.1850 * sin(Drad) -
                0.1144 * sin(2.0 * Frad) +
                0.0588 * sin(2.0 * Drad - 2.0 * Mrad) +
                0.0572 * sin(2.0 * Drad - Msrad - Mrad) +
                0.0533 * sin(2.0 * Drad + Mrad) +
                0.0458 * sin(2.0 * Drad - Msrad) -
                0.0409 * sin(Msrad) -
                0.0347 * sin(Drad + Mrad) -
                0.0219 * sin(Msrad - Mrad)

        // Ecliptic latitude correction (degrees) – main periodic terms
        val dLat = 5.1282 * sin(Frad) +
                0.2806 * sin(Mrad + Frad) +
                0.2777 * sin(Mrad - Frad) +
                0.1732 * sin(2.0 * Drad - Frad) +
                0.0554 * sin(2.0 * Drad + Frad - Mrad) +
                0.0463 * sin(2.0 * Drad - Frad - Mrad) +
                0.0326 * sin(2.0 * Drad + Frad) -
                0.0172 * sin(Msrad - Frad)

        val lon = (L + dLon).mod(360.0)
        val lat = dLat

        // Convert ecliptic (lon, lat) → equatorial (RA, Dec)
        val e = 23.439 - 0.00000036 * d   // obliquity
        val lonRad = lon.toRadians()
        val latRad = lat.toRadians()
        val erad   = e.toRadians()

        val ra = atan2(
            sin(lonRad) * cos(erad) - tan(latRad) * sin(erad),
            cos(lonRad)
        ).toDegrees().mod(360.0) / 15.0

        val dec = asin(
            sin(latRad) * cos(erad) + cos(latRad) * sin(erad) * sin(lonRad)
        ).toDegrees()

        return EquatorialCoord(ra, dec)
    }

    // ─── Planet Positions ────────────────────────────────────────────────────

    /**
     * Approximate heliocentric ecliptic position of a planet using Keplerian
     * orbital elements from the Astronomical Almanac (Tables 6).
     * Accuracy: ~1-2° for inner planets, ~0.5° for outer planets.
     */
    fun planetPosition(planet: Planet, jd: Double): EquatorialCoord {
        val T = (jd - 2451545.0) / 36525.0

        val el  = getOrbitalElements(planet, T)
        val elE = earthOrbitalElements(T)

        // Solve Kepler's equation for each body
        val Ep = solveKepler(el.M, el.e)
        val Ee = solveKepler(elE.M, elE.e)

        // Heliocentric ecliptic XYZ
        val (Xp, Yp, Zp) = eclipticXYZ(el, Ep)
        val (Xe, Ye, Ze) = eclipticXYZ(elE, Ee)

        // Geocentric ecliptic vector
        val dx = Xp - Xe
        val dy = Yp - Ye
        val dz = Zp - Ze

        val lon = atan2(dy, dx).toDegrees().mod(360.0)
        val lat = atan2(dz, sqrt(dx * dx + dy * dy)).toDegrees()

        // Convert ecliptic → equatorial
        val e = 23.439 - 0.0130042 * T
        val lonRad = lon.toRadians()
        val latRad = lat.toRadians()
        val erad = e.toRadians()

        val ra = atan2(
            sin(lonRad) * cos(erad) - tan(latRad) * sin(erad),
            cos(lonRad)
        ).toDegrees().mod(360.0) / 15.0

        val dec = asin(
            (sin(latRad) * cos(erad) + cos(latRad) * sin(erad) * sin(lonRad)).coerceIn(-1.0, 1.0)
        ).toDegrees()

        return EquatorialCoord(ra, dec)
    }

    // Orbital elements from Astronomical Almanac (J2000.0 epoch + rates per Julian century T)
    private fun getOrbitalElements(planet: Planet, T: Double): OrbitalElements {
        return when (planet) {
            Planet.MERCURY -> OrbitalElements(
                a = 0.38709927,
                e = 0.20563593 + 0.00001906 * T,
                i = 7.00497902 - 0.00594749 * T,
                omega = (48.33076593 - 0.12534081 * T).mod(360.0),
                w = ((77.45779628 + 0.16047689 * T) - (48.33076593 - 0.12534081 * T)).mod(360.0),
                M = (252.25032350 + 149472.67411175 * T - (77.45779628 + 0.16047689 * T)).mod(360.0)
            )
            Planet.VENUS -> OrbitalElements(
                a = 0.72333566,
                e = 0.00677672 - 0.00004107 * T,
                i = 3.39467605 - 0.00078890 * T,
                omega = (76.67984255 - 0.27769418 * T).mod(360.0),
                w = ((131.60246718 + 0.00268329 * T) - (76.67984255 - 0.27769418 * T)).mod(360.0),
                M = (181.97909950 + 58517.81538729 * T - (131.60246718 + 0.00268329 * T)).mod(360.0)
            )
            Planet.MARS -> OrbitalElements(
                a = 1.52371034,
                e = 0.09339410 + 0.00007882 * T,
                i = 1.84969142 - 0.00813131 * T,
                omega = (49.55953891 - 0.29257343 * T).mod(360.0),
                w = ((-23.94362959 + 0.44441088 * T) - (49.55953891 - 0.29257343 * T)).mod(360.0),
                M = ((-4.55343205 + 19140.30268499 * T) - (-23.94362959 + 0.44441088 * T)).mod(360.0)
            )
            Planet.JUPITER -> OrbitalElements(
                a = 5.20288700,
                e = 0.04838624 - 0.00013253 * T,
                i = 1.30439695 - 0.00183714 * T,
                omega = (100.47390909 + 0.20469106 * T).mod(360.0),
                w = ((14.72847983 + 0.21252668 * T) - (100.47390909 + 0.20469106 * T)).mod(360.0),
                M = ((34.39644051 + 3034.74612775 * T) - (14.72847983 + 0.21252668 * T)).mod(360.0)
            )
            Planet.SATURN -> OrbitalElements(
                a = 9.53667594,
                e = 0.05386179 - 0.00050991 * T,
                i = 2.48599187 + 0.00193609 * T,
                omega = (113.66242448 - 0.28867794 * T).mod(360.0),
                w = ((92.59887831 - 0.41897216 * T) - (113.66242448 - 0.28867794 * T)).mod(360.0),
                M = ((49.95424423 + 1222.49362201 * T) - (92.59887831 - 0.41897216 * T)).mod(360.0)
            )
        }
    }

    // Earth's orbital elements (internal use only — not a visible planet)
    private fun earthOrbitalElements(T: Double) = OrbitalElements(
        a = 1.00000261,
        e = 0.01671123 - 0.00004392 * T,
        i = -0.00001531 - 0.01294668 * T,
        omega = 0.0,
        w = (102.93768193 + 0.32327364 * T).mod(360.0),
        M = (100.46457166 + 35999.37244981 * T - (102.93768193 + 0.32327364 * T)).mod(360.0)
    )

    // Heliocentric ecliptic XYZ from orbital elements + eccentric anomaly
    private fun eclipticXYZ(el: OrbitalElements, E: Double): Triple<Double, Double, Double> {
        val cosO = cos(el.omega.toRadians())
        val sinO = sin(el.omega.toRadians())
        val cosW = cos(el.w.toRadians())
        val sinW = sin(el.w.toRadians())
        val cosI = cos(el.i.toRadians())
        val sinI = sin(el.i.toRadians())

        val xOrb = el.a * (cos(E) - el.e)
        val yOrb = el.a * sqrt(1.0 - el.e * el.e) * sin(E)

        val X = (cosO * cosW - sinO * sinW * cosI) * xOrb +
                (-cosO * sinW - sinO * cosW * cosI) * yOrb
        val Y = (sinO * cosW + cosO * sinW * cosI) * xOrb +
                (-sinO * sinW + cosO * cosW * cosI) * yOrb
        val Z = (sinW * sinI) * xOrb + (cosW * sinI) * yOrb

        return Triple(X, Y, Z)
    }

    /**
     * Solve Kepler's equation E - e·sin(E) = M using Newton-Raphson.
     * @param M Mean anomaly in degrees
     */
    private fun solveKepler(M: Double, e: Double): Double {
        var E = M.toRadians()
        val Mrad = M.toRadians()
        repeat(50) {
            val dE = (Mrad - E + e * sin(E)) / (1.0 - e * cos(E))
            E += dE
            if (abs(dE) < 1e-10) return E
        }
        return E
    }

    // ─── Coordinate Transforms ───────────────────────────────────────────────

    /**
     * Convert equatorial coordinates to horizontal (Alt/Az).
     * @param ra  Right Ascension in hours
     * @param dec Declination in degrees
     * @param lst Local Sidereal Time in hours
     * @param lat Observer latitude in degrees
     */
    fun equatorialToHorizontal(
        ra: Double, dec: Double,
        lst: Double, lat: Double
    ): HorizontalCoord {
        val H = ((lst - ra) * 15.0).toRadians()   // Hour angle in radians
        val decRad = dec.toRadians()
        val latRad = lat.toRadians()

        val sinAlt = (sin(decRad) * sin(latRad) + cos(decRad) * cos(latRad) * cos(H))
            .coerceIn(-1.0, 1.0)
        val alt = asin(sinAlt).toDegrees()

        val cosAlt = cos(alt.toRadians())
        val cosAz = if (cosAlt < 1e-10) {
            0.0
        } else {
            ((sin(decRad) - sin(latRad) * sinAlt) / (cos(latRad) * cosAlt))
                .coerceIn(-1.0, 1.0)
        }
        var az = acos(cosAz).toDegrees()
        if (sin(H) > 0) az = 360.0 - az

        return HorizontalCoord(alt, az)
    }

    /**
     * Project a horizontal coordinate (alt, az) onto a circular sky canvas.
     * Centre = zenith, edge = horizon.
     * North is at the top; East to the right.
     *
     * @param radius  Pixel radius of the full sky circle
     * @return (offsetX, offsetY) from the circle centre
     */
    fun horizontalToCanvas(alt: Double, az: Double, radius: Float): Pair<Float, Float> {
        val r = (radius * ((90.0 - alt) / 90.0).coerceIn(0.0, 1.0)).toFloat()
        val azRad = az.toRadians()
        val x = (r * sin(azRad)).toFloat()
        val y = (-r * cos(azRad)).toFloat()   // negative → North at top
        return Pair(x, y)
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private fun Double.toRadians() = this * PI / 180.0
    private fun Double.toDegrees() = this * 180.0 / PI
    private fun Double.mod(m: Double): Double {
        val r = this % m
        return if (r < 0) r + m else r
    }
}
