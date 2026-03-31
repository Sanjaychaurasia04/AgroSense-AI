// src/pages/Weather/Weather.jsx
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';
import { getRealWeather, getWeatherByCoords } from '../../api/api';

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  const fetchWeather = async (searchLocation = location) => {
    if (!searchLocation.trim()) {
      setError("Please enter a city or PIN code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getRealWeather(searchLocation);
      setWeather(data);
    } catch (err) {
      setError(err.message || "Failed to fetch weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const detectUserLocation = () => {
    setDetectingLocation(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setDetectingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const cityName = await getWeatherByCoords(latitude, longitude);
          setLocation(cityName);
          await fetchWeather(cityName);
        } catch (err) {
          setError("Could not detect your location. Please enter manually.");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setError("Location permission denied. Please enter city manually.");
        setDetectingLocation(false);
      }
    );
  };

  const getFarmingAlert = () => {
    if (!weather) return null;
    const { temp, humidity, condition } = weather;
    const conditionLower = condition.toLowerCase();

    if (temp > 38) return {
      type: "danger", icon: "🔥", title: "Extreme Heat Warning",
      message: "Temperature above 38°C! Irrigate immediately, provide shade, postpone transplanting, monitor for wilting.",
      actions: ["Irrigate immediately", "Apply mulch", "Provide shade"]
    };
    if (temp > 35) return {
      type: "warning", icon: "☀️", title: "Heat Stress Alert",
      message: "High temperature: Irrigate in morning/evening. Sensitive crops need shade. Check soil moisture daily.",
      actions: ["Evening irrigation", "Shade netting", "Monitor moisture"]
    };
    if (temp <= 10) return {
      type: "warning", icon: "❄️", title: "Cold Wave Alert",
      message: "Low temperature risk: Cover nursery beds with plastic. Use mulch to protect roots. Harvest sensitive vegetables.",
      actions: ["Cover crops", "Apply mulch", "Harvest ripe produce"]
    };
    if (temp < 15) return {
      type: "info", icon: "🌡️", title: "Cool Weather Advisory",
      message: "Moderate temperatures: Good for cool-season crops. Protect tender seedlings if temperature drops further.",
      actions: ["Protect seedlings", "Delay heat-loving crops"]
    };
    if (temp > 20 && temp < 30 && humidity > 75) return {
      type: "warning", icon: "🍄", title: "Fungal Disease Risk",
      message: `High humidity (${humidity}%) — ideal for fungal diseases. Apply preventive fungicide on tomatoes, potatoes, grapes.`,
      actions: ["Apply fungicide", "Improve airflow", "Monitor closely"]
    };
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      const heavy = conditionLower.includes('heavy') || conditionLower.includes('thunderstorm');
      return {
        type: heavy ? "danger" : "info",
        icon: heavy ? "⚠️" : "☔",
        title: heavy ? "Heavy Rain Warning" : "Rain Expected",
        message: heavy
          ? "Heavy rain: Check drainage, harvest mature crops immediately, secure polytunnels."
          : "Light rain expected: Good for planting. Hold off on pesticide spraying.",
        actions: heavy
          ? ["Check drainage", "Harvest now", "Secure structures"]
          : ["Postpone spraying", "Monitor waterlogging"]
      };
    }
    return {
      type: "good", icon: "🌱", title: "Optimal Farming Conditions",
      message: "Weather is favorable for all farming activities — sowing, irrigation, fertilizer, and spraying.",
      actions: ["Sowing", "Irrigation", "Fertilizer application", "Spraying"]
    };
  };

  const alert = getFarmingAlert();

  const alertColorMap = {
    danger:  { bg: `${theme.alert}22`, border: theme.alert  },
    warning: { bg: `${theme.wheat}22`, border: theme.wheat  },
    info:    { bg: `${theme.rain}22`,  border: theme.rain   },
    good:    { bg: `${theme.leaf}22`,  border: theme.sprout },
  };
  const alertColors = alertColorMap[alert?.type] ?? alertColorMap.good;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28 }}>
          Weather Alerts
        </h2>
        {weather && (
          <div style={{ background: `${theme.leaf}22`, padding: '4px 12px', borderRadius: 20, fontSize: 12, color: theme.sprout }}>
            Last updated: Just now
          </div>
        )}
      </div>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Real-time weather with farming-specific action advice for your crops
      </p>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          placeholder="Enter city (e.g., Mumbai) or PIN code (e.g., 110001)"
          disabled={loading || detectingLocation}
          style={{
            flex: 1, minWidth: 250,
            background: "rgba(255,248,238,0.06)",
            border: `1px solid ${error ? theme.alert : theme.earth}`,
            borderRadius: 12, padding: "12px 16px",
            color: theme.cream, fontFamily: "inherit", fontSize: 14, outline: "none",
            opacity: loading || detectingLocation ? 0.5 : 1
          }}
        />
        <Btn onClick={() => fetchWeather()} loading={loading} icon="cloud" disabled={detectingLocation}>
          {loading ? "Fetching..." : "Get Weather"}
        </Btn>
        <Btn onClick={detectUserLocation} icon="send" variant="secondary" loading={detectingLocation} disabled={loading}>
          {detectingLocation ? "Detecting..." : "Use My Location"}
        </Btn>
      </div>

      {/* Error */}
      {error && (
        <Card style={{ background: `${theme.alert}22`, border: `1px solid ${theme.alert}`, marginBottom: 20, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <p style={{ color: theme.alert, margin: 0 }}>{error}</p>
          </div>
        </Card>
      )}

      {/* Weather Data */}
      {weather && (
        <div>
          {/* Current + Alert */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 20 }}>
            <Card style={{ background: `linear-gradient(135deg, ${theme.sky}66, ${theme.rain}33)`, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                <div>
                  <p style={{ color: theme.mist, fontSize: 14, marginBottom: 4 }}>{weather.city}</p>
                  <p style={{ color: theme.mist, fontSize: 12, opacity: 0.7, textTransform: 'capitalize' }}>{weather.condition}</p>
                </div>
                <Icon name={weather.condition.toLowerCase().includes('rain') ? 'rain' : 'sun'} size={32} color={theme.wheat} />
              </div>
              <div style={{ fontSize: 64, fontWeight: 700, color: theme.cream, lineHeight: 1, marginBottom: 16 }}>
                {weather.temp}°C
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div>
                  <Icon name="thermometer" size={14} color={theme.mist} />
                  <span style={{ color: theme.mist, fontSize: 13, marginLeft: 6 }}>Feels {weather.feels}°</span>
                </div>
                <div>
                  <Icon name="rain" size={14} color={theme.mist} />
                  <span style={{ color: theme.mist, fontSize: 13, marginLeft: 6 }}>{weather.humidity}% Humidity</span>
                </div>
                <div>
                  <Icon name="wind" size={14} color={theme.mist} />
                  <span style={{ color: theme.mist, fontSize: 13, marginLeft: 6 }}>{weather.wind} km/h</span>
                </div>
              </div>
            </Card>

            <Card style={{ padding: 24 }}>
              <p style={{ color: theme.wheat, fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: 1 }}>
                {alert.icon} TODAY'S FARMING ALERT
              </p>
              <div style={{
                background: alertColors.bg, borderRadius: 12, padding: 20,
                borderLeft: `4px solid ${alertColors.border}`, marginBottom: 16
              }}>
                <p style={{ color: theme.cream, fontWeight: 600, marginBottom: 8, fontSize: 16 }}>{alert.title}</p>
                <p style={{ color: theme.cream, lineHeight: 1.7, opacity: 0.9, fontSize: 14 }}>{alert.message}</p>
              </div>
              {alert.actions && (
                <div>
                  <p style={{ color: theme.mist, fontSize: 12, marginBottom: 8 }}>RECOMMENDED ACTIONS:</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {alert.actions.map((action, idx) => (
                      <span key={idx} style={{
                        background: `${theme.earth}66`, padding: '4px 12px',
                        borderRadius: 20, fontSize: 12, color: theme.cream
                      }}>
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Forecast */}
          <p style={{ color: theme.wheat, fontWeight: 600, marginBottom: 16, fontSize: 16 }}>4-Day Forecast</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {weather.forecast.map((f, i) => (
              <Card key={i} style={{ textAlign: "center", padding: 16 }}>
                <p style={{ color: theme.mist, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{f.day}</p>
                <Icon name={f.icon} size={32} color={f.icon === "sun" ? theme.wheat : f.icon === "rain" ? theme.rain : theme.mist} />
                <p style={{ color: theme.cream, fontSize: 28, fontWeight: 700, margin: "12px 0 4px" }}>{f.temp}°</p>
                <p style={{ color: theme.rain, fontSize: 13, marginBottom: 12 }}>🌧️ {f.rain}% rain</p>
                <p style={{ color: theme.mist, fontSize: 12, lineHeight: 1.5, background: `${theme.earth}33`, padding: 8, borderRadius: 8 }}>
                  {f.advice}
                </p>
              </Card>
            ))}
          </div>

          {/* Quick Tips */}
          <Card style={{ marginTop: 24, padding: 20, background: `${theme.earth}33` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <p style={{ color: theme.wheat, fontWeight: 600 }}>Quick Tips Based on Weather</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {weather.temp > 30 && (
                <div style={{ fontSize: 13, color: theme.cream, opacity: 0.9 }}>
                  • Irrigate in early morning or evening to reduce evaporation
                </div>
              )}
              {weather.humidity > 70 && (
                <div style={{ fontSize: 13, color: theme.cream, opacity: 0.9 }}>
                  • Check for powdery mildew on cucurbits and grapes
                </div>
              )}
              {weather.forecast?.some(f => f.rain > 60) && (
                <div style={{ fontSize: 13, color: theme.cream, opacity: 0.9 }}>
                  • Harvest mature vegetables before heavy rain
                </div>
              )}
              {weather.temp < 20 && (
                <div style={{ fontSize: 13, color: theme.cream, opacity: 0.9 }}>
                  • Good time for planting leafy vegetables
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!weather && !error && !loading && (
        <Card style={{
          textAlign: 'center', padding: 48,
          background: `${theme.earth}22`, border: `2px dashed ${theme.earth}`
        }}>
          <Icon name="cloud" size={48} color={theme.mist} />
          <p style={{ color: theme.mist, fontSize: 16, marginTop: 16 }}>
            Enter a city name or PIN code to get weather updates
          </p>
          <p style={{ color: theme.mist, fontSize: 13, opacity: 0.7, marginTop: 8 }}>
            Example: Mumbai, Delhi, 110001, 400001
          </p>
        </Card>
      )}
    </div>
  );
};

export default Weather;