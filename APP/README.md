# yoNro Application

## User Flow

1. **Registration Form** (First-time users)
   - User fills in Name, Email, Age, and Phone (optional)
   - Data is stored in localStorage
   - User proceeds to onboarding flow

2. **Onboarding Flow**
   - Welcome screen with yoNro branding
   - Goal selection (Stress, Sleep, Focus, Anxiety, Energy)
   - Current state assessment
   - Desired state selection
   - Synchronization transition

3. **Main Application**
   - Shows main dashboard with 5 tabs:
     - Home: Live status with Neuro Score
     - Neuro AI: Chat with AI therapist
     - Controls: Environment adjustments
     - Insights: Data analytics and weekly overview
     - Profile: User information and settings

## Files

- `APP/index.html` - Main app HTML structure
- `APP/app.js` - Application logic and state management
- `APP/styles.css` - Complete styling with theme system

## Features

- User registration form before app access
- Profile page displays user information from registration
- Edit profile functionality
- Dynamic theme system based on mood states
- Real-time bio-signal simulation
- AI chat with contextual responses
- Environment control sliders
- Mobile-first design with phone frame presentation
- Smooth transitions and animations

## User Data

User registration data is stored in localStorage as:
```javascript
{
  name: "User Name",
  email: "user@example.com",
  age: "25",
  phone: "+1 (555) 000-0000",
  registeredDate: "2026-04-07T..."
}
```

Access it in the app with:
```javascript
const userData = JSON.parse(localStorage.getItem('yonro_user'));
```

## How It Works

1. On first launch, the app shows a splash screen
2. If no user data exists in localStorage, the registration form appears
3. After registration, user proceeds through the onboarding flow
4. User data is displayed on the Profile tab
5. Users can edit their profile information anytime
6. Signing out clears all localStorage data and returns to registration

