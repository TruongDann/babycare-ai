# BabyCare AI - Smart Home Monitoring App

React Native mobile application for monitoring babies and elderly people using AI-powered camera detection.

## Features (MVP)

- **Authentication**: Login, Register, Biometric support
- **Camera Management**: Add, view, and control multiple cameras
- **Live Streaming**: Real-time video from IP cameras
- **AI Detection**: Fall detection, crying detection, inactivity alerts
- **Push Notifications**: Real-time alerts for dangerous situations
- **Event History**: View and manage detected events

## Tech Stack

- **Frontend**: React Native + Expo SDK 54
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **UI**: Custom component library with design system
- **Backend**: Node.js + Express (coming soon)
- **Database**: PostgreSQL (coming soon)
- **AI**: TensorFlow Lite (coming soon)

## Project Structure

```
babycare-ai/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Dashboard
│   │   ├── cameras.tsx
│   │   ├── events.tsx
│   │   └── profile.tsx
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   └── ui/           # UI components (Button, Card, Input, Badge)
│   ├── stores/           # Zustand stores
│   │   ├── authStore.ts
│   │   └── cameraStore.ts
│   ├── theme/            # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── types/            # TypeScript types
│   └── services/         # API services (coming soon)
└── assets/               # Images, fonts, icons

```

## Setup & Installation

### Prerequisites

- Node.js 20.15+
- npm or yarn
- Expo Go app (for testing on physical device)

### Installation Steps

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Scan QR code with Expo Go app (iOS/Android)

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run on web browser

## Development Status

### Completed

- [x] Project setup with Expo + TypeScript
- [x] Design system (colors, typography, spacing)
- [x] UI component library (Button, Card, Input, Badge)
- [x] Authentication flow (Login, Register)
- [x] State management (Zustand stores)
- [x] Navigation (Expo Router with tabs)
- [x] Dashboard screen
- [x] Profile screen

### In Progress

- [ ] Camera management screens
- [ ] Live video streaming
- [ ] AI detection integration
- [ ] Push notifications
- [ ] Event history

### Planned

- [ ] Backend API
- [ ] Database setup
- [ ] TensorFlow Lite integration
- [ ] WebSocket for real-time
- [ ] Recording & playback

## Design System

### Colors

- **Primary**: Baby Blue (#2196F3) - Calming, trustworthy
- **Secondary**: Soft Green (#4CAF50) - Safe, healthy
- **Alerts**: Critical (Red), High (Orange), Medium (Amber), Low (Blue)

### Typography

- Font sizes: 12px to 36px
- Weights: Regular, Medium, Semibold, Bold
- Accessibility-friendly line heights

### Components

- Button (4 variants, 3 sizes)
- Card (3 variants)
- Input (with label and error handling)
- Badge (5 variants, 2 sizes)

## API Integration (Coming Soon)

```typescript
// Example API service
import axios from "axios";

const api = axios.create({
  baseURL: "http://your-backend-url/api/v1",
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Environment Variables

Create a `.env` file:

```
API_URL=http://localhost:3000/api/v1
WS_URL=ws://localhost:3000
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Deployment

### Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Submit to Stores

```bash
eas submit --platform ios
eas submit --platform android
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

Private project - All rights reserved

## Contact

For questions or support, contact the development team.

---

**Current Version**: 1.0.0 (MVP Development)
**Last Updated**: December 3, 2025
