# 🚌 CityTransit - Real-Time Public Transport Tracking

A comprehensive React application for tracking public transportation vehicles in real-time, designed specifically for small cities. Features include vehicle tracking, route visualization, speech-to-text search, and role-based authentication.

## ✨ Features

### 🔍 **Smart Search & Filtering**
- **Route Planning**: Search from location A to B with smart matching
- **Vehicle Number Search**: Find specific buses, metros, or trams
- **Route Name Search**: Search by route names
- **Voice Search**: Speech-to-text in 20+ languages (English, Telugu, Hindi, etc.)
- **Advanced Filters**: Filter by vehicle type, status, occupancy level

### 🚍 **Real-Time Vehicle Tracking**
- Live vehicle locations and status updates
- Speed monitoring and occupancy levels
- Estimated arrival times at stops
- Route visualization with next stops
- Real-time updates every 10 seconds

### 👤 **Authentication System**
- Role-based access control (Passenger/Operator/Admin)
- Persistent sessions with "Remember Me"
- Demo accounts for testing
- Session timeout warnings
- Comprehensive logout system

### 📱 **Mobile-First Design**
- Responsive design optimized for all devices
- Touch-friendly interface
- Progressive Web App capabilities
- Offline-ready with service workers

### 🎤 **Voice Search Integration**
- Web Speech API integration
- Multi-language support (20+ languages)
- Start/stop voice controls
- Visual feedback for voice input
- Smart text processing and matching

## 🚀 Quick Start

### Demo Accounts
- **Passenger**: `user@demo.com` / `password123`
- **Operator**: `operator@demo.com` / `password123`

### Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open** `http://localhost:3000` in your browser

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application component
├── styles/
│   └── globals.css           # Tailwind V4 global styles
├── types/
│   ├── auth.ts              # Authentication types
│   └── transport.ts         # Transport/vehicle types
├── hooks/
│   └── useAuth.ts           # Authentication hook
├── data/
│   └── mockData.ts          # Mock data for vehicles
├── components/
│   ├── AuthPage.tsx         # Authentication page
│   ├── LoginForm.tsx        # Login form
│   ├── SignUpForm.tsx       # Registration form
│   ├── UserProfile.tsx      # User profile management
│   ├── UserMenu.tsx         # User menu component
│   ├── LogoutConfirmation.tsx # Logout confirmation
│   ├── SessionTimeout.tsx   # Session management
│   ├── VehicleCard.tsx      # Vehicle display card
│   ├── VehicleTracker.tsx   # Real-time tracking
│   ├── SearchAndFilter.tsx  # Search functionality
│   ├── StatsOverview.tsx    # Statistics dashboard
│   ├── VoiceSearchDemo.tsx  # Voice search interface
│   ├── SpeechToText.tsx     # Speech recognition
│   ├── EnhancedVoiceSearch.tsx # Advanced voice features
│   └── ui/                  # Reusable UI components
└── package.json             # Project dependencies
```

## 🛠️ Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Shadcn/ui** component library
- **Web Speech API** for voice recognition
- **Lucide React** for icons
- **Sonner** for notifications
- **React Hook Form** with Zod validation
- **Local Storage** for data persistence

## 🔐 Authentication Features

### Login System
- Email/password authentication
- "Remember Me" functionality
- Form validation with error handling
- Loading states and feedback

### User Roles
- **Passenger**: Standard user access
- **Operator**: Enhanced vehicle management tools
- **Admin**: Full system administration

### Session Management
- Auto-logout after 30 minutes of inactivity
- 5-minute warning before timeout
- Persistent sessions across browser refreshes

## 🚌 Vehicle Management

### Vehicle Information
- Real-time location tracking
- Speed and occupancy monitoring
- Estimated arrival times
- Route information and next stops
- Vehicle capacity and type

### Search Capabilities
- **Smart Route Planning**: Find vehicles connecting two locations
- **Vehicle Number Search**: Direct bus/metro/tram lookup
- **Route Search**: Find all vehicles on specific routes
- **Voice Search**: Hands-free searching in multiple languages

## 🎯 Core Features

### Real-Time Updates
- Vehicle positions update every 10 seconds
- Live speed and occupancy data
- Dynamic arrival time calculations
- Status change notifications

### Statistics Dashboard
- Total active vehicles
- Average speed monitoring
- Route distribution
- Occupancy level overview

### Mobile Experience
- Touch-optimized interface
- Responsive design for all screen sizes
- Fast loading and smooth animations
- Offline capability preparation

## 🔄 Data Flow

1. **Authentication**: User logs in with demo credentials
2. **Data Loading**: Mock vehicle data loads from local storage
3. **Real-Time Updates**: Simulated live updates every 10 seconds
4. **Search Processing**: Smart filtering based on user input
5. **Voice Recognition**: Web Speech API processes voice commands
6. **State Management**: React hooks manage application state

## 🎨 Design System

### Color Scheme
- **Primary**: Dark blue (#030213)
- **Secondary**: Light gray variants
- **Accent**: Green for success, red for errors
- **Background**: White/dark theme support

### Typography
- Clean, readable fonts
- Consistent sizing hierarchy
- Accessible color contrast
- Mobile-optimized text sizes

## 🌐 Internationalization

### Voice Search Languages
- English (US, UK, AU)
- Telugu (India)
- Hindi (India)
- Spanish (ES, MX)
- French (FR, CA)
- German (DE)
- Italian (IT)
- Portuguese (BR, PT)
- Russian (RU)
- Japanese (JP)
- Korean (KR)
- Chinese (Mandarin)
- Arabic (SA)
- Dutch (NL)
- Swedish (SE)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks

### Environment Setup
1. Node.js 18+ required
2. Modern browser with Web Speech API support
3. HTTPS for voice features (or localhost)

## 📱 Browser Support

- **Chrome 60+** (Full features)
- **Firefox 55+** (Limited voice support)
- **Safari 14+** (iOS voice support varies)
- **Edge 79+** (Full Chromium features)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
- No external APIs required
- All data is mock/local
- Voice features use browser APIs

## 🤝 Contributing

This is a demo application showcasing modern React development practices. Feel free to:

1. Fork the repository
2. Add new features
3. Improve existing functionality
4. Submit pull requests

## 📄 License

MIT License - Feel free to use this code for learning and development.

## 🎯 Next Steps

### Potential Enhancements
- Real backend API integration
- GPS tracking implementation
- Push notifications
- PWA installation prompts
- Dark mode toggle
- Multi-language UI
- Advanced analytics
- Route optimization
- Payment integration

---

**Built with ❤️ for modern public transportation systems**