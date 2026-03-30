# ClosetMind - Component Definitions

## Overview
This document defines all components in the ClosetMind application, organized by layer (Frontend, Backend, Infrastructure, Shared).

---

## Frontend Components

### 1. Authentication Feature

#### 1.1 LoginPage
- **Type**: Page Component
- **Purpose**: User login interface
- **Responsibilities**:
  - Render login form with email and password fields
  - Handle form validation and submission
  - Manage authentication state during login
  - Display error messages for failed authentication
  - Redirect to dashboard on successful login

#### 1.2 SignupPage
- **Type**: Page Component
- **Purpose**: User registration interface
- **Responsibilities**:
  - Render signup form with email, password, and name fields
  - Handle form validation (email format, password strength)
  - Submit registration to Cognito
  - Display validation errors and success messages
  - Redirect to onboarding/dashboard after successful signup

#### 1.3 OnboardingModal
- **Type**: UI Component
- **Purpose**: First-time user welcome and tips
- **Responsibilities**:
  - Display welcome message with app overview
  - Show key feature highlights
  - Provide dismiss action
  - Track onboarding completion status

#### 1.4 useAuth Hook
- **Type**: Custom Hook
- **Purpose**: Authentication state and operations
- **Responsibilities**:
  - Manage user session state
  - Provide login, signup, logout functions
  - Handle token refresh
  - Expose current user information
  - Manage authentication loading states

### 2. Wardrobe Feature

#### 2.1 WardrobePage
- **Type**: Page Component
- **Purpose**: Main wardrobe management interface
- **Responsibilities**:
  - Display list of all wardrobe items
  - Provide add, edit, delete actions
  - Handle item filtering and search
  - Manage wardrobe loading and error states

#### 2.2 WardrobeItemCard
- **Type**: UI Component
- **Purpose**: Display individual wardrobe item
- **Responsibilities**:
  - Render item details (name, type, category, color, etc.)
  - Display item image if available
  - Show usage statistics (lastWorn, timesWorn)
  - Provide edit and delete actions

#### 2.3 AddItemModal
- **Type**: UI Component
- **Purpose**: Form for adding new wardrobe items
- **Responsibilities**:
  - Render form with all item attributes
  - Handle multi-select for occasion tags and weather suitability
  - Validate form inputs
  - Submit new item to backend
  - Handle optional image upload

#### 2.4 EditItemModal
- **Type**: UI Component
- **Purpose**: Form for editing existing wardrobe items
- **Responsibilities**:
  - Pre-fill form with current item values
  - Handle attribute updates
  - Submit changes to backend
  - Handle image upload/removal

#### 2.5 useWardrobe Hook
- **Type**: Custom Hook
- **Purpose**: Wardrobe data and operations
- **Responsibilities**:
  - Fetch and cache wardrobe items using React Query
  - Provide add, update, delete item functions
  - Manage optimistic updates
  - Handle wardrobe-related API calls

### 3. Calendar Feature

#### 3.1 CalendarPage
- **Type**: Page Component
- **Purpose**: Monthly calendar view for outfit logging
- **Responsibilities**:
  - Render monthly calendar grid
  - Display outfit indicators on logged dates
  - Handle date selection
  - Navigate between months
  - Manage calendar loading states

#### 3.2 CalendarGrid
- **Type**: UI Component
- **Purpose**: Calendar month grid display
- **Responsibilities**:
  - Render calendar days for current month
  - Highlight dates with logged outfits
  - Handle date click events
  - Display current date indicator

#### 3.3 OutfitLogModal
- **Type**: UI Component
- **Purpose**: Interface for logging outfits
- **Responsibilities**:
  - Display wardrobe items for selection
  - Allow multi-item selection
  - Submit outfit log to backend
  - Handle outfit creation and updates

#### 3.4 OutfitDetailModal
- **Type**: UI Component
- **Purpose**: Display logged outfit details
- **Responsibilities**:
  - Show all items in logged outfit
  - Display outfit date
  - Provide edit and delete actions
  - Show item images if available

#### 3.5 useCalendar Hook
- **Type**: Custom Hook
- **Purpose**: Calendar and outfit data operations
- **Responsibilities**:
  - Fetch outfits for date range using React Query
  - Provide log, update, delete outfit functions
  - Manage calendar navigation state
  - Handle outfit-related API calls

### 4. Events Feature

#### 4.1 EventsPage
- **Type**: Page Component
- **Purpose**: Event management interface
- **Responsibilities**:
  - Display list of upcoming events
  - Provide add, edit, delete event actions
  - Show event details (title, date, type)
  - Manage events loading states

#### 4.2 EventCard
- **Type**: UI Component
- **Purpose**: Display individual event
- **Responsibilities**:
  - Render event details
  - Show days until event
  - Provide edit and delete actions
  - Link to outfit suggestions for event

#### 4.3 AddEventModal
- **Type**: UI Component
- **Purpose**: Form for creating events
- **Responsibilities**:
  - Render form with event fields (title, date, type)
  - Validate inputs
  - Submit new event to backend

#### 4.4 EditEventModal
- **Type**: UI Component
- **Purpose**: Form for editing events
- **Responsibilities**:
  - Pre-fill form with current event values
  - Handle event updates
  - Submit changes to backend

#### 4.5 useEvents Hook
- **Type**: Custom Hook
- **Purpose**: Events data and operations
- **Responsibilities**:
  - Fetch and cache events using React Query
  - Provide add, update, delete event functions
  - Manage optimistic updates
  - Handle event-related API calls

### 5. Suggestions Feature

#### 5.1 SuggestionsPage
- **Type**: Page Component
- **Purpose**: Outfit suggestions interface
- **Responsibilities**:
  - Display suggestion request form
  - Show generated outfit suggestions
  - Allow date/event selection
  - Provide action to log suggested outfit

#### 5.2 SuggestionCard
- **Type**: UI Component
- **Purpose**: Display individual outfit suggestion
- **Responsibilities**:
  - Render suggested outfit items
  - Show suggestion reasoning (weather match, occasion match)
  - Provide "Select This Outfit" action
  - Display item images if available

#### 5.3 SuggestionFilters
- **Type**: UI Component
- **Purpose**: Filters for suggestion requests
- **Responsibilities**:
  - Date picker for target date
  - Event selector dropdown
  - Submit suggestion request

#### 5.4 useSuggestions Hook
- **Type**: Custom Hook
- **Purpose**: Suggestions data and operations
- **Responsibilities**:
  - Request outfit suggestions from backend
  - Manage suggestion loading states
  - Handle suggestion-related API calls

### 6. Dashboard Feature

#### 6.1 DashboardPage
- **Type**: Page Component
- **Purpose**: Main dashboard with analytics
- **Responsibilities**:
  - Display outfit usage analytics
  - Show upcoming events
  - Provide quick actions (add item, log outfit, create event)
  - Render analytics charts/statistics

#### 6.2 AnalyticsWidget
- **Type**: UI Component
- **Purpose**: Display outfit usage statistics
- **Responsibilities**:
  - Show most worn items
  - Show least worn items
  - Display outfit frequency per month
  - Render usage charts

#### 6.3 UpcomingEventsWidget
- **Type**: UI Component
- **Purpose**: Display upcoming events on dashboard
- **Responsibilities**:
  - Show next 3-5 upcoming events
  - Provide quick link to events page
  - Display event countdown

#### 6.4 useAnalytics Hook
- **Type**: Custom Hook
- **Purpose**: Analytics data operations
- **Responsibilities**:
  - Fetch analytics data using React Query
  - Calculate usage statistics
  - Handle analytics-related API calls

### 7. Settings Feature

#### 7.1 SettingsPage
- **Type**: Page Component
- **Purpose**: User preferences and settings
- **Responsibilities**:
  - Display notification preferences
  - Allow enable/disable notifications
  - Show user profile information
  - Provide logout action

#### 7.2 NotificationSettings
- **Type**: UI Component
- **Purpose**: Notification preference controls
- **Responsibilities**:
  - Display notification toggle
  - Submit preference changes to backend
  - Show current notification status

#### 7.3 useSettings Hook
- **Type**: Custom Hook
- **Purpose**: Settings data and operations
- **Responsibilities**:
  - Fetch user preferences
  - Update notification settings
  - Handle settings-related API calls

### 8. Shared Frontend Components

#### 8.1 Layout
- **Type**: Layout Component
- **Purpose**: Main application layout wrapper
- **Responsibilities**:
  - Render navigation header
  - Provide page content area
  - Handle responsive layout

#### 8.2 Navigation
- **Type**: UI Component
- **Purpose**: Main navigation menu
- **Responsibilities**:
  - Render navigation links (Dashboard, Wardrobe, Calendar, Events, Suggestions, Settings)
  - Highlight active route
  - Provide logout action
  - Responsive mobile menu

#### 8.3 LoadingSpinner
- **Type**: UI Component
- **Purpose**: Loading state indicator
- **Responsibilities**:
  - Display loading animation
  - Provide consistent loading UX

#### 8.4 ErrorBoundary
- **Type**: Error Handling Component
- **Purpose**: Catch and display React errors
- **Responsibilities**:
  - Catch component errors
  - Display error message
  - Provide error recovery actions

#### 8.5 Toast/Notification
- **Type**: UI Component
- **Purpose**: Display temporary notifications
- **Responsibilities**:
  - Show success/error messages
  - Auto-dismiss after timeout
  - Support different notification types

---

## Backend Components

### 1. Authentication Service

#### 1.1 AuthHandler
- **Type**: Lambda Handler
- **Purpose**: Handle authentication requests
- **Responsibilities**:
  - Process signup requests (delegate to Cognito)
  - Process login requests (delegate to Cognito)
  - Validate authentication tokens
  - Return user session information

#### 1.2 AuthService
- **Type**: Service Module
- **Purpose**: Authentication business logic
- **Responsibilities**:
  - Interact with Cognito User Pool
  - Create user records in DynamoDB
  - Validate user credentials
  - Generate and validate tokens

### 2. Wardrobe Service

#### 2.1 WardrobeHandler
- **Type**: Lambda Handler
- **Purpose**: Handle wardrobe API requests
- **Responsibilities**:
  - Route requests to appropriate service methods
  - Validate request payloads
  - Return formatted responses
  - Handle errors and exceptions

#### 2.2 WardrobeService
- **Type**: Service Module
- **Purpose**: Wardrobe business logic
- **Responsibilities**:
  - Add new wardrobe items
  - Retrieve user's wardrobe items
  - Update existing items
  - Delete items
  - Update usage tracking (lastWorn, timesWorn)

#### 2.3 WardrobeRepository
- **Type**: Data Access Module
- **Purpose**: Wardrobe data persistence
- **Responsibilities**:
  - CRUD operations on Wardrobe DynamoDB table
  - Query items by userId
  - Update item attributes
  - Handle DynamoDB-specific operations

### 3. Calendar/Outfit Service

#### 3.1 OutfitHandler
- **Type**: Lambda Handler
- **Purpose**: Handle outfit logging API requests
- **Responsibilities**:
  - Route requests to appropriate service methods
  - Validate request payloads
  - Return formatted responses
  - Handle errors and exceptions

#### 3.2 OutfitService
- **Type**: Service Module
- **Purpose**: Outfit logging business logic
- **Responsibilities**:
  - Log outfits for specific dates
  - Retrieve outfits for date range
  - Update logged outfits
  - Delete outfits
  - Trigger usage tracking updates in wardrobe

#### 3.3 OutfitRepository
- **Type**: Data Access Module
- **Purpose**: Outfit data persistence
- **Responsibilities**:
  - CRUD operations on Outfits DynamoDB table
  - Query outfits by userId and date range
  - Handle DynamoDB-specific operations

### 4. Events Service

#### 4.1 EventsHandler
- **Type**: Lambda Handler
- **Purpose**: Handle events API requests
- **Responsibilities**:
  - Route requests to appropriate service methods
  - Validate request payloads
  - Return formatted responses
  - Handle errors and exceptions

#### 4.2 EventsService
- **Type**: Service Module
- **Purpose**: Events business logic
- **Responsibilities**:
  - Create new events
  - Retrieve user's events
  - Update existing events
  - Delete events
  - Schedule reminders via EventBridge

#### 4.3 EventsRepository
- **Type**: Data Access Module
- **Purpose**: Events data persistence
- **Responsibilities**:
  - CRUD operations on Events DynamoDB table
  - Query events by userId
  - Handle DynamoDB-specific operations

### 5. Suggestions Service

#### 5.1 SuggestionsHandler
- **Type**: Lambda Handler
- **Purpose**: Handle suggestion API requests
- **Responsibilities**:
  - Route requests to suggestion engine
  - Validate request payloads
  - Return formatted suggestions
  - Handle errors and exceptions

#### 5.2 SuggestionEngine
- **Type**: Service Module (Shared)
- **Purpose**: Generate outfit suggestions
- **Responsibilities**:
  - Fetch weather data from Weather API
  - Filter wardrobe items by weather suitability
  - Filter items by occasion/event type
  - Exclude recently worn items (last 3-5 days)
  - Generate outfit combinations (top+bottom, complete outfits)
  - Rank suggestions by criteria
  - Return top 2-3 suggestions

#### 5.3 WeatherService
- **Type**: Service Module
- **Purpose**: Weather data integration
- **Responsibilities**:
  - Call OpenWeatherMap API
  - Parse weather data
  - Map weather conditions to suitability tags
  - Cache weather data to reduce API calls

### 6. Notifications Service

#### 6.1 NotificationHandler
- **Type**: Lambda Handler
- **Purpose**: Handle notification preference updates
- **Responsibilities**:
  - Update user notification preferences
  - Return current preferences
  - Handle errors and exceptions

#### 6.2 ReminderHandler
- **Type**: Lambda Handler (Scheduled)
- **Purpose**: Send event reminders
- **Responsibilities**:
  - Triggered by EventBridge daily
  - Query events for tomorrow
  - Check user notification preferences
  - Send SMS via SNS for enabled users

#### 6.3 NotificationService
- **Type**: Service Module
- **Purpose**: Notification business logic
- **Responsibilities**:
  - Update user notification preferences in DynamoDB
  - Send SMS notifications via SNS
  - Format notification messages
  - Handle notification failures

### 7. Analytics Service

#### 7.1 AnalyticsHandler
- **Type**: Lambda Handler
- **Purpose**: Handle analytics API requests
- **Responsibilities**:
  - Route requests to analytics service
  - Return formatted analytics data
  - Handle errors and exceptions

#### 7.2 AnalyticsService
- **Type**: Service Module
- **Purpose**: Analytics calculation logic
- **Responsibilities**:
  - Calculate most worn items
  - Calculate least worn items
  - Calculate outfit frequency per month
  - Aggregate usage statistics

### 8. Shared Backend Components

#### 8.1 AuthMiddleware
- **Type**: Middleware Module
- **Purpose**: Request authentication validation
- **Responsibilities**:
  - Extract JWT token from request headers
  - Validate token with Cognito
  - Extract userId from token
  - Attach user context to request
  - Return 401 for invalid tokens

#### 8.2 ErrorHandler
- **Type**: Utility Module
- **Purpose**: Centralized error handling
- **Responsibilities**:
  - Format error responses
  - Log errors
  - Map exceptions to HTTP status codes
  - Provide consistent error structure

#### 8.3 ResponseFormatter
- **Type**: Utility Module
- **Purpose**: Standardize API responses
- **Responsibilities**:
  - Format success responses
  - Add CORS headers
  - Standardize response structure

#### 8.4 Validator
- **Type**: Utility Module
- **Purpose**: Input validation
- **Responsibilities**:
  - Validate request payloads
  - Check required fields
  - Validate data types and formats
  - Return validation errors

---

## Infrastructure Components

### 1. Amazon Cognito
- **Type**: AWS Service
- **Purpose**: User authentication and authorization
- **Responsibilities**:
  - User pool management
  - User signup and login
  - Token generation and validation
  - Password management

### 2. Amazon DynamoDB
- **Type**: AWS Service
- **Purpose**: NoSQL database for application data
- **Tables**:
  - Users table (userId PK)
  - Wardrobe table (userId PK, itemId SK)
  - Outfits table (userId PK, date SK)
  - Events table (userId PK, eventId SK)

### 3. Amazon S3
- **Type**: AWS Service
- **Purpose**: Object storage for wardrobe item images
- **Responsibilities**:
  - Store uploaded images
  - Serve images via presigned URLs
  - Lifecycle policies for cost optimization

### 4. Amazon SNS
- **Type**: AWS Service
- **Purpose**: SMS notification delivery
- **Responsibilities**:
  - Send SMS messages
  - Handle delivery status
  - Manage SNS topics

### 5. Amazon EventBridge
- **Type**: AWS Service
- **Purpose**: Scheduled event triggering
- **Responsibilities**:
  - Schedule daily reminder checks
  - Trigger ReminderHandler Lambda
  - Manage event rules

### 6. Amazon API Gateway
- **Type**: AWS Service
- **Purpose**: REST API endpoint management
- **Responsibilities**:
  - Route HTTP requests to Lambda functions
  - Handle CORS
  - Request/response transformation
  - API throttling and rate limiting

### 7. AWS Lambda
- **Type**: AWS Service
- **Purpose**: Serverless compute for backend logic
- **Functions**:
  - AuthHandler
  - WardrobeHandler
  - OutfitHandler
  - EventsHandler
  - SuggestionsHandler
  - NotificationHandler
  - ReminderHandler
  - AnalyticsHandler

### 8. AWS Amplify Hosting
- **Type**: AWS Service
- **Purpose**: Frontend hosting and deployment
- **Responsibilities**:
  - Host React application
  - Serve static assets
  - Handle CI/CD for frontend

---

## Component Summary

### Frontend Components: 40+
- 7 Page Components
- 20+ UI Components
- 8 Custom Hooks
- 5 Shared Components

### Backend Components: 25+
- 8 Lambda Handlers
- 10 Service Modules
- 4 Repository Modules
- 3 Shared Utilities

### Infrastructure Components: 8
- Cognito, DynamoDB, S3, SNS, EventBridge, API Gateway, Lambda, Amplify

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for Review
