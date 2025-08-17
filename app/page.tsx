"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Sun, Cloud, CloudRain, Loader2, Clock, Thermometer } from "lucide-react"

interface WeatherData {
  temperature: number[]
  weatherCode: number[]
  time: string[]
  humidity: number[]
  windSpeed: number[]
}

interface LocationData {
  lat: number
  lng: number
  city: string
}

interface IdealWindow {
  startHour: number
  endHour: number
  avgTemp: number
  avgHumidity: number
  avgWind: number
}

export default function MagLabaApp() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [recommendation, setRecommendation] = useState("")
  const [idealWindows, setIdealWindows] = useState<IdealWindow[]>([])

  const getCurrentLocation = () => {
    setLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const cityResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const cityData = await cityResponse.json()

          setLocation({
            lat: latitude,
            lng: longitude,
            city: cityData.city || cityData.locality || "Your Location",
          })

          await fetchWeather(latitude, longitude)
        } catch (err) {
          setError("Failed to get location details")
          setLoading(false)
        }
      },
      (error) => {
        setError("Unable to retrieve your location. Please enter manually.")
        setLoading(false)
      },
    )
  }

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto&forecast_days=1`,
      )

      if (!response.ok) throw new Error("Weather data unavailable")

      const data = await response.json()

      const currentDate = new Date().toISOString().split("T")[0]
      const relevantHours = data.hourly.time
        .map((time: string, index: number) => ({
          time,
          temperature: data.hourly.temperature_2m[index],
          weatherCode: data.hourly.weather_code[index],
          humidity: data.hourly.relative_humidity_2m[index],
          windSpeed: data.hourly.wind_speed_10m[index],
          hour: new Date(time).getHours(),
        }))
        .filter((item: any) => item.time.startsWith(currentDate) && item.hour >= 5 && item.hour <= 17)

      setWeather({
        temperature: relevantHours.map((item: any) => item.temperature),
        weatherCode: relevantHours.map((item: any) => item.weatherCode),
        time: relevantHours.map((item: any) => item.time),
        humidity: relevantHours.map((item: any) => item.humidity),
        windSpeed: relevantHours.map((item: any) => item.windSpeed),
      })

      generateRecommendation(relevantHours)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch weather data")
      setLoading(false)
    }
  }

  const generateRecommendation = (hourlyData: any[]) => {
    const hasRain = hourlyData.some(
      (item) =>
        (item.weatherCode >= 51 && item.weatherCode <= 67) ||
        (item.weatherCode >= 80 && item.weatherCode <= 86) ||
        (item.weatherCode >= 95 && item.weatherCode <= 99),
    )

    if (hasRain) {
      setRecommendation("Wag mag laba! May ulan ngayong araw. 🌧️")
      setIdealWindows([])
      return
    }

    const idealHours = hourlyData.filter((item) => {
      const tempC = item.temperature
      const isIdealTemp = tempC >= 20 && tempC <= 30
      const isLowHumidity = item.humidity < 70
      const hasGoodWind = item.windSpeed > 5
      const isClearWeather = item.weatherCode >= 0 && item.weatherCode <= 3

      return isIdealTemp && isLowHumidity && hasGoodWind && isClearWeather
    })

    const windows: IdealWindow[] = []
    let currentWindow: any[] = []

    idealHours.forEach((hour, index) => {
      if (currentWindow.length === 0) {
        currentWindow = [hour]
      } else {
        const lastHour = currentWindow[currentWindow.length - 1]
        const hourDiff = hour.hour - lastHour.hour

        if (hourDiff <= 1) {
          currentWindow.push(hour)
        } else {
          if (currentWindow.length >= 2) {
            windows.push({
              startHour: currentWindow[0].hour,
              endHour: currentWindow[currentWindow.length - 1].hour,
              avgTemp: Math.round(currentWindow.reduce((sum, h) => sum + h.temperature, 0) / currentWindow.length),
              avgHumidity: Math.round(currentWindow.reduce((sum, h) => sum + h.humidity, 0) / currentWindow.length),
              avgWind: Math.round(currentWindow.reduce((sum, h) => sum + h.windSpeed, 0) / currentWindow.length),
            })
          }
          currentWindow = [hour]
        }
      }
    })

    if (currentWindow.length >= 2) {
      windows.push({
        startHour: currentWindow[0].hour,
        endHour: currentWindow[currentWindow.length - 1].hour,
        avgTemp: Math.round(currentWindow.reduce((sum, h) => sum + h.temperature, 0) / currentWindow.length),
        avgHumidity: Math.round(currentWindow.reduce((sum, h) => sum + h.humidity, 0) / currentWindow.length),
        avgWind: Math.round(currentWindow.reduce((sum, h) => sum + h.windSpeed, 0) / currentWindow.length),
      })
    }

    setIdealWindows(windows)

    if (windows.length > 0) {
      const bestWindow = windows.reduce((best, current) =>
        current.endHour - current.startHour > best.endHour - best.startHour ? current : best,
      )

      const startTime =
        bestWindow.startHour === 12
          ? "12:00 PM"
          : bestWindow.startHour > 12
            ? `${bestWindow.startHour - 12}:00 PM`
            : `${bestWindow.startHour}:00 AM`
      const endTime =
        bestWindow.endHour === 12
          ? "12:00 PM"
          : bestWindow.endHour > 12
            ? `${bestWindow.endHour - 12}:00 PM`
            : `${bestWindow.endHour}:00 AM`

      setRecommendation(`Mag laba ka na! Perfect na ang panahon from ${startTime} to ${endTime}! ☀️`)
    } else {
      const hasClearWeather = hourlyData.some((item) => item.weatherCode >= 0 && item.weatherCode <= 3)

      if (hasClearWeather) {
        setRecommendation("Pwede mag laba, pero hindi ideal ang conditions. Bantayan mo ang damit! ⛅")
      } else {
        setRecommendation("Hindi maganda ang panahon ngayon. Better wait na lang. 🌫️")
      }
    }
  }

  const getWeatherIcon = (code: number) => {
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 86) || (code >= 95 && code <= 99)) {
      return <CloudRain className="h-6 w-6 text-blue-500" />
    } else if (code >= 0 && code <= 3) {
      return <Sun className="h-6 w-6 text-yellow-500" />
    } else {
      return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  const handleManualLocation = async () => {
    // Implementation for handleManualLocation
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-900">MagLaba ka na!</h1>
          <p className="text-blue-700">Weather-based laundry recommendations</p>
        </div>

        <Card className={`${location ? "bg-blue-50 border-blue-200" : ""}`}>
          <CardHeader className={location ? "pb-2" : ""}>
            <CardTitle className={`flex items-center gap-2 text-blue-800 ${location ? "text-base" : ""}`}>
              <MapPin className={`h-5 w-5 text-blue-600 ${location ? "h-4 w-4" : ""}`} />
              Your Location
            </CardTitle>
            {!location && (
              <CardDescription className="text-blue-600">We need your location to check the weather</CardDescription>
            )}
          </CardHeader>
          <CardContent className={`space-y-4 ${location ? "pt-0" : ""}`}>
            {!location ? (
              <div className="space-y-4">
                <Button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    "Use My Current Location"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-blue-600">Or enter manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-blue-800">
                    Enter your city or location
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="e.g., Manila, Cebu, Davao"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleManualLocation()}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <Button onClick={handleManualLocation} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">{location.city}</p>
                  <p className="text-xs text-blue-600">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLocation(null)
                    setWeather(null)
                    setRecommendation("")
                    setManualLocation("")
                    setIdealWindows([])
                  }}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Change
                </Button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </CardContent>
        </Card>

        {weather && recommendation && (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900">Today's Laundry Forecast</CardTitle>
              <CardDescription className="text-blue-700">5 AM - 5 PM weather conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg border border-blue-200">
                <p className="text-2xl font-bold text-blue-900 mb-2">{recommendation}</p>
              </div>

              {idealWindows.length > 0 && (
                <Card className="bg-blue-50 border-blue-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                      <Clock className="h-5 w-5" />
                      Ideal Laundry Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {idealWindows.map((window, index) => {
                      const startTime =
                        window.startHour === 12
                          ? "12:00 PM"
                          : window.startHour > 12
                            ? `${window.startHour - 12}:00 PM`
                            : `${window.startHour}:00 AM`
                      const endTime =
                        window.endHour === 12
                          ? "12:00 PM"
                          : window.endHour > 12
                            ? `${window.endHour - 12}:00 PM`
                            : `${window.endHour}:00 AM`

                      return (
                        <div key={index} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-blue-800">
                              {startTime} - {endTime}
                            </span>
                            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              Perfect conditions!
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-700">{window.avgTemp}°C</span>
                            </div>
                            <div className="text-center">
                              <span className="text-blue-600">💧 {window.avgHumidity}%</span>
                            </div>
                            <div className="text-right">
                              <span className="text-blue-600">💨 {window.avgWind} km/h</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="text-xs text-blue-800 bg-blue-100 p-3 rounded border border-blue-200">
                      💡 Ideal conditions: 20-30°C, low humidity (&lt;70%), good airflow (&gt;5 km/h). Clothes typically
                      dry in 2-6 hours under these conditions.
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weather.time.slice(0, 8).map((time, index) => {
                  const hour = new Date(time).getHours()
                  const temp = Math.round(weather.temperature[index])
                  const code = weather.weatherCode[index]
                  const humidity = Math.round(weather.humidity[index])
                  const windSpeed = Math.round(weather.windSpeed[index])

                  return (
                    <div
                      key={time}
                      className="text-center p-3 bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm font-medium text-blue-800">{hour}:00</p>
                      <div className="flex justify-center my-2">{getWeatherIcon(code)}</div>
                      <p className="text-lg font-bold text-blue-900">{temp}°C</p>
                      <div className="text-xs text-blue-600 space-y-1">
                        <div>💧 {humidity}%</div>
                        <div>💨 {windSpeed} km/h</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
