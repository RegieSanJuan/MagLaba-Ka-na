# 🧺 MagLaba ka na!

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)

> **Never guess when to do laundry again!** 🌤️ Get AI-powered weather recommendations for the perfect laundry day.

## ✨ What is MagLaba ka na?

**MagLaba ka na!** is a smart Filipino weather app that tells you the **perfect time to do your laundry** based on real-time weather conditions. No more soggy clothes or wasted time!

![Demo Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=MagLaba+ka+na!+Demo)

### 🎯 Key Features

- 🌍 **Smart Location Detection** - Automatic GPS location or manual city input
- 🌤️ **Real-time Weather Analysis** - Powered by Open-Meteo API
- ⏰ **Perfect Time Windows** - Find the ideal 2-6 hour drying windows
- 📊 **Detailed Weather Cards** - Temperature, humidity, wind speed for each hour
- 🎨 **Beautiful UI** - Modern design with smooth animations
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🇵🇭 **Filipino-friendly** - Localized recommendations in Tagalog

## 🚀 Live Demo

[![Open in Browser](https://img.shields.io/badge/🌐%20Live%20Demo-Click%20Here-blue?style=for-the-badge)](https://your-demo-link.vercel.app)

## 🛠️ Tech Stack

### Frontend Framework

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Geist Font](https://vercel.com/font)** - Modern typography

### APIs Used

- **[Open-Meteo API](https://open-meteo.com/)** - Free weather forecast API
  - Hourly weather data (temperature, humidity, wind speed)
  - Weather codes for conditions
  - 7-day forecast with timezone support
- **[BigDataCloud Reverse Geocoding API](https://www.bigdatacloud.com/)** - Location services
  - Convert GPS coordinates to city names
  - Free tier with good accuracy

### Additional Libraries

- **[React Hook Form](https://react-hook-form.com/)** - Form validation
- **[Zod](https://zod.dev/)** - Schema validation
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/RegieSanJuan/MagLaba-Ka-na.git
cd MagLaba-Ka-na

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open your browser
# Visit http://localhost:3000
```

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🌟 How It Works

### 1. **Location Detection** 🗺️

- Automatically detects your GPS location
- Or manually enter your city name
- Uses BigDataCloud API for accurate geocoding

### 2. **Weather Analysis** 🌤️

- Fetches hourly weather data from Open-Meteo
- Analyzes conditions from 5 AM to 5 PM
- Considers temperature, humidity, wind speed, and precipitation

### 3. **Smart Recommendations** 🧠

- **Ideal Conditions**: 20-30°C, <70% humidity, >5 km/h wind
- **Perfect Windows**: Finds 2+ hour continuous ideal periods
- **Rain Detection**: Warns against laundry during rainy weather
- **Filipino Responses**: Fun, localized recommendations

### 4. **Visual Dashboard** 📊

- Hour-by-hour weather cards
- Temperature and condition icons
- Ideal time window highlights
- Responsive grid layout

## 📱 Features in Detail

### 🎯 Intelligent Weather Scoring

```typescript
const isIdealTime = (temp: number, humidity: number, wind: number) => {
  return (
    temp >= 20 &&
    temp <= 30 && // Perfect drying temperature
    humidity < 70 && // Low humidity for faster drying
    wind > 5
  ); // Good airflow
};
```

### 🌧️ Rain Detection

- Detects various precipitation types
- Weather codes 51-67 (rain), 80-86 (showers), 95-99 (thunderstorms)
- Automatically warns users to avoid laundry

### ⏰ Time Window Optimization

- Finds consecutive ideal hours
- Recommends longest available windows
- Provides specific start and end times

## 🔗 API Documentation

### Open-Meteo Weather API

```
GET https://api.open-meteo.com/v1/forecast
Parameters:
- latitude: User's latitude
- longitude: User's longitude
- hourly: temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m
- timezone: auto
- forecast_days: 1
```

### BigDataCloud Geocoding API

```
GET https://api.bigdatacloud.net/data/reverse-geocode-client
Parameters:
- latitude: GPS latitude
- longitude: GPS longitude
- localityLanguage: en
```

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add JSDoc comments for functions
- Test on mobile devices
- Maintain accessibility standards

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Open-Meteo](https://open-meteo.com/)** - Providing free, reliable weather data
- **[BigDataCloud](https://www.bigdatacloud.com/)** - Accurate geocoding services
- **[Vercel](https://vercel.com/)** - Amazing deployment platform
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **Filipino community** - Inspiration for localized weather wisdom

## 🌈 Future Features

- [ ] 📅 **7-day forecast** - Plan your laundry week
- [ ] 🔔 **Push notifications** - Get alerted for perfect laundry weather
- [ ] 🌍 **Multi-language support** - More Filipino dialects
- [ ] 📊 **Weather history** - Track past laundry decisions
- [ ] 🤖 **AI learning** - Personalized recommendations
- [ ] 🌙 **Night mode** - Dark theme support

## 📞 Support

Having issues? We're here to help!

- 🐛 [Report a Bug](https://github.com/RegieSanJuan/MagLaba-Ka-na/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/RegieSanJuan/MagLaba-Ka-na/issues/new?template=feature_request.md)
- 💬 [Join Discussions](https://github.com/RegieSanJuan/MagLaba-Ka-na/discussions)

---

<div align="center">

**Made with ❤️ by [RegieSanJuan](https://github.com/RegieSanJuan)**

[![GitHub stars](https://img.shields.io/github/stars/RegieSanJuan/MagLaba-Ka-na?style=social)](https://github.com/RegieSanJuan/MagLaba-Ka-na)
[![GitHub forks](https://img.shields.io/github/forks/RegieSanJuan/MagLaba-Ka-na?style=social)](https://github.com/RegieSanJuan/MagLaba-Ka-na/fork)

</div>
