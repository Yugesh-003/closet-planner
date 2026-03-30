# ClosetMind - Component Dependencies

## Overview
This document maps dependencies and communication patterns between all components in the ClosetMind application.

---

## Dependency Matrix

### Frontend Component Dependencies

| Component | Depends On | Communication Pattern |
|-----------|------------|----------------------|
| LoginPage | useAuth | Hook call |
| SignupPage | useAuth | Hook call |
| OnboardingModal | - | Standalone |
| useAuth | API Gateway (/auth/*) | HTTP REST |
| WardrobePage | useWardrobe | Hook call |
| WardrobeItemCard | - | Props |
| AddItemModal | useWardrobe | Hook call |
| EditItemModal | useWardrobe | Hook call |
| useWardrobe | API Gateway (/wardrobe/*) | HTTP REST |
| CalendarPage | useCalendar, useWardrobe | Hook calls |
| CalendarGrid | - | Props |
| OutfitLogModal | useCalendar, useWardrobe | Hook calls |
| OutfitDetailModal | useCalendar | Hook call |
| useCalendar | API Gateway (/outfits) | HTTP REST |
| EventsPage | useEvents | Hook call |
| EventCard | - | Props |
| AddEventModal | useEvents | Hook call |
| EditEventModal | useEvents | Hook call |
| useEvents | API Gateway (/events) | HTTP REST |
| SuggestionsPage | useSuggestions, useEvents, useWardrobe | Hook calls |
| SuggestionCard | - | Props |
| SuggestionFilters | useEvents | Hook call |
| useSuggestions | API Gateway (/suggestions) | HTTP REST |
| DashboardPage | useAnalytics, useEvents | Hook calls |
| AnalyticsWidget | - | Props |
| UpcomingEventsWidget | - | Props |
| useAnalytics | API Gateway (/analytics) | HTTP REST |
| SettingsPage | useSettings, useAuth | Hook calls |
| NotificationSettings | useSettings | Hook call |
| useSettings | API Gateway (/user/preferences) | HTTP REST |
| Layout | Navigation | Component composition |
| Navigation | useAuth | Hook call |

### Backend Component Dependencies

| Component | Depends On | Communication Pattern |
|-----------|------------|----------------------|
| AuthHandler | AuthService, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| AuthService | Cognito SDK, DynamoDB SDK | AWS SDK calls |
| WardrobeHandler | WardrobeService, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| WardrobeService | WardrobeRepository, S3 SDK | Direct method calls, AWS SDK |
| WardrobeRepository | DynamoDB SDK | AWS SDK calls |
| OutfitHandler | OutfitService, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| OutfitService | OutfitRepository, WardrobeService | Direct method calls |
| OutfitRepository | DynamoDB SDK | AWS SDK calls |
| EventsHandler | EventsService, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| EventsService | EventsRepository | Direct method calls |
| EventsRepository | DynamoDB SDK | AWS SDK calls |
| SuggestionsHandler | SuggestionEngine, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| SuggestionEngine | WardrobeService, OutfitService, EventsService, WeatherService | Direct method calls |
| WeatherService | OpenWeatherMap API (HTTP) | HTTP client |
| NotificationHandler | NotificationService, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| ReminderHandler | EventsService, NotificationService | Direct method calls |
| NotificationService | DynamoDB SDK, SNS SDK | AWS SDK calls |
| AnalyticsHandler | AnalyticsService, AuthMiddleware, ResponseFormatter, ErrorHandler | Direct method calls |
| AnalyticsService | WardrobeService, OutfitService | Direct method calls |

### Infrastructure Dependencies

| Component | Depends On | Purpose |
|-----------|------------|---------|
| API Gateway | All Lambda Handlers | Route HTTP requests |
| All Lambda Handlers | DynamoDB | Data persistence |
| AuthService | Cognito | User authentication |
| WardrobeService | S3 (optional) | Image storage |
| NotificationService | SNS | SMS delivery |
| ReminderHandler | EventBridge | Scheduled triggers |
| WeatherService | OpenWeatherMap API | Weather data |
| Frontend | Amplify Hosting | Static hosting |

---

## Dependency Graphs

### Frontend Dependency Flow

```
User
  ↓
Pages (LoginPage, WardrobePage, CalendarPage, etc.)
  ↓
Custom Hooks (useAuth, useWardrobe, useCalendar, etc.)
  ↓
API Gateway
  ↓
Backend Services
```

### Backend Service Dependencies

```
API Gateway
  ↓
Lambda Handlers (AuthHandler, WardrobeHandler, etc.)
  ├→ AuthMiddleware (validates token)
  ├→ Validator (validates input)
  ↓
Service Layer (AuthService, WardrobeService, etc.)
  ├→ Repository Layer (WardrobeRepository, OutfitRepository, etc.)
  │   ↓
  │   DynamoDB
  ├→ AWS Services (Cognito, S3, SNS)
  └→ External APIs (OpenWeatherMap)
  ↓
ResponseFormatter / ErrorHandler
  ↓
API Gateway Response
```

### Cross-Service Dependencies

```
OutfitService
  └→ WardrobeService.updateUsageTracking()

SuggestionEngine
  ├→ WardrobeService.getItems()
  ├→ OutfitService.getOutfits()
  ├→ EventsService.getEvent()
  └→ WeatherService.getForecast()

AnalyticsService
  ├→ WardrobeService.getItems()
  └→ OutfitService.getOutfits()

ReminderHandler
  ├→ EventsService.getEventsTomorrow()
  └→ NotificationService.sendSMS()
```

---

## Communication Patterns

### 1. Frontend to Backend (HTTP REST)

**Pattern**: Request/Response via API Gateway

**Example**: Add Wardrobe Item
```
Frontend (AddItemModal)
  → useWardrobe.addItem(item)
    → POST /wardrobe/items
      → API Gateway
        → WardrobeHandler
          → WardrobeService.addItem()
            → WardrobeRepository.create()
              → DynamoDB
            ← Created item
          ← Service response
        ← Handler response
      ← API Gateway response
    ← Hook updates React Query cache
  ← UI updates
```

### 2. Service to Repository (Direct Method Call)

**Pattern**: Synchronous method invocation

**Example**: Get Wardrobe Items
```
WardrobeService.getItems(userId)
  → WardrobeRepository.findByUserId(userId)
    → DynamoDB.query({ userId })
    ← Item records
  ← Mapped to domain objects
```

### 3. Service to AWS SDK (Direct SDK Call)

**Pattern**: AWS SDK method invocation

**Example**: Send SMS Notification
```
NotificationService.sendSMS(phoneNumber, message)
  → SNS.publish({
      PhoneNumber: phoneNumber,
      Message: message
    })
  ← Delivery status
```

### 4. Cross-Service Communication (Direct Method Call)

**Pattern**: Service imports and calls another service

**Example**: Log Outfit with Usage Tracking
```
OutfitService.logOutfit(userId, date, itemIds)
  → OutfitRepository.create(outfit)
  → WardrobeService.updateUsageTracking(userId, itemIds)
    → WardrobeRepository.batchUpdateUsage(userId, itemIds, date)
  ← Success
```

### 5. Scheduled Trigger (EventBridge to Lambda)

**Pattern**: Asynchronous event-driven invocation

**Example**: Daily Reminder Processing
```
EventBridge (Daily at 9 AM)
  → ReminderHandler.handler(event)
    → EventsService.getEventsTomorrow()
    → For each event:
        → NotificationService.sendSMS()
```

### 6. External API Integration (HTTP Client)

**Pattern**: HTTP request to external service

**Example**: Fetch Weather Data
```
WeatherService.getForecast(location, date)
  → HTTP GET https://api.openweathermap.org/data/2.5/forecast
  ← Weather data JSON
  → Parse and normalize
  ← WeatherData object
```

---

## Dependency Rules and Constraints

### Layered Architecture Rules

1. **Frontend Layer**:
   - Pages depend on Hooks
   - Hooks depend on API Gateway
   - UI Components depend only on Props (no direct API calls)

2. **Backend Layer**:
   - Handlers depend on Services and Middleware
   - Services depend on Repositories and other Services
   - Repositories depend only on DynamoDB SDK
   - No circular dependencies between services

3. **Infrastructure Layer**:
   - All backend components can depend on AWS services
   - Frontend depends on Amplify Hosting
   - No infrastructure components depend on application code

### Dependency Constraints

1. **No Circular Dependencies**:
   - Services must not create circular references
   - Example: WardrobeService → OutfitService is NOT allowed (would create cycle)
   - Solution: OutfitService → WardrobeService (one-way dependency)

2. **Shared Module Access**:
   - SuggestionEngine can be imported by any service
   - WeatherService can be imported by any service
   - Shared utilities (ErrorHandler, ResponseFormatter, Validator) available to all

3. **Authentication Requirement**:
   - All API endpoints (except /auth/*) require AuthMiddleware
   - AuthMiddleware extracts userId from JWT token
   - Services receive userId as parameter (no global state)

4. **Data Access Pattern**:
   - Services MUST use Repositories for DynamoDB access
   - Direct DynamoDB SDK calls only in Repository layer
   - Ensures consistent data access patterns

---

## Critical Dependencies

### Must-Have Dependencies (Blocking)

1. **Cognito** → AuthService
   - Without Cognito, no user authentication
   - Blocking: All user operations

2. **DynamoDB** → All Repositories
   - Without DynamoDB, no data persistence
   - Blocking: All data operations

3. **API Gateway** → All Handlers
   - Without API Gateway, no HTTP endpoints
   - Blocking: All frontend-backend communication

### Optional Dependencies (Graceful Degradation)

1. **OpenWeatherMap API** → WeatherService
   - If unavailable: Skip weather filtering in suggestions
   - Fallback: Generate suggestions based on occasion only

2. **S3** → WardrobeService
   - If unavailable: Skip image upload, store items without images
   - Fallback: Text-only wardrobe items

3. **SNS** → NotificationService
   - If unavailable: Log error, don't block user operations
   - Fallback: User can still use app, just no SMS reminders

4. **EventBridge** → ReminderHandler
   - If unavailable: Reminders don't trigger
   - Fallback: User can still create events and use app

---

## Dependency Injection Strategy

### Frontend (React)
- **Hooks as Dependency Injection**: Custom hooks encapsulate API calls
- **React Query**: Manages server state and caching
- **Context API**: Manages UI state (auth, theme, etc.)

### Backend (Lambda)
- **Constructor Injection**: Services receive dependencies in constructor
- **Module Imports**: Shared utilities imported as needed
- **Environment Variables**: Configuration injected via environment

**Example**:
```typescript
class WardrobeService {
  constructor(
    private repository: WardrobeRepository,
    private s3Client: S3Client
  ) {}
  
  async addItem(userId: string, item: CreateWardrobeItemInput): Promise<WardrobeItem> {
    // Use injected dependencies
    const imageUrl = await this.s3Client.upload(item.image);
    return this.repository.create({ ...item, imageUrl });
  }
}
```

---

## Testing Strategy Based on Dependencies

### Unit Testing
- **Mock Dependencies**: Mock repositories, AWS SDKs, external APIs
- **Test Services in Isolation**: Inject mocked dependencies
- **Test Hooks in Isolation**: Mock API calls with MSW (Mock Service Worker)

### Integration Testing
- **Test Service + Repository**: Use local DynamoDB or test database
- **Test Handler + Service**: Mock AWS services, test business logic
- **Test Frontend + Backend**: Use test API Gateway or mock server

### End-to-End Testing
- **Test Full Flow**: Real frontend, real backend, test AWS resources
- **Test Critical Paths**: Login → Add Item → Log Outfit → Get Suggestions

---

## Dependency Management

### Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x",
    "react-query": "^3.x",
    "axios": "^1.x",
    "tailwindcss": "^3.x"
  }
}
```

### Backend Dependencies (package.json per Lambda)
```json
{
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.x",
    "@aws-sdk/client-cognito-identity-provider": "^3.x",
    "@aws-sdk/client-s3": "^3.x",
    "@aws-sdk/client-sns": "^3.x",
    "axios": "^1.x"
  }
}
```

### Infrastructure Dependencies (SAM template)
- Cognito User Pool
- DynamoDB Tables (Users, Wardrobe, Outfits, Events)
- S3 Bucket (for images)
- SNS Topic (for SMS)
- EventBridge Rule (for reminders)
- API Gateway REST API
- Lambda Functions (8 functions)
- IAM Roles and Policies

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for Review
