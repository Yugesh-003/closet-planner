# ClosetMind - Service Layer Design

## Overview
This document defines the service layer architecture, service responsibilities, and orchestration patterns for ClosetMind.

---

## Service Architecture Pattern

### Service-Based Lambda Organization
- **Pattern**: Hybrid service-based with shared utilities
- **Approach**: One Lambda function per service domain with shared utility modules
- **Benefits**:
  - Clear service boundaries
  - Reduced cold start overhead compared to function-per-endpoint
  - Easier code sharing and maintenance
  - Better cost optimization

### Service Communication
- **Frontend ↔ Backend**: REST API via API Gateway
- **Backend ↔ DynamoDB**: Direct SDK calls via repository pattern
- **Backend ↔ External Services**: HTTP clients (Weather API, Cognito, SNS)
- **Scheduled Tasks**: EventBridge triggers Lambda

---

## Service Definitions

### 1. Authentication Service

#### Service Boundary
- **Domain**: User authentication and authorization
- **Lambda Function**: AuthHandler
- **API Endpoints**:
  - `POST /auth/signup`
  - `POST /auth/login`

#### Responsibilities
- User registration via Cognito
- User login and token generation
- User record creation in DynamoDB
- Token validation (via middleware)

#### Dependencies
- **AWS Services**: Cognito User Pool, DynamoDB (Users table)
- **Internal**: None
- **External**: None

#### Service Interface
```typescript
interface AuthServiceInterface {
  signup(email: string, password: string, name: string): Promise<SignupResult>;
  login(email: string, password: string): Promise<LoginResult>;
  validateToken(token: string): Promise<TokenValidationResult>;
}
```

#### Orchestration Flow

**Signup Flow**:
1. Receive signup request (email, password, name)
2. Validate input (email format, password strength)
3. Call Cognito SignUp API
4. Create user record in DynamoDB Users table
5. Return success response with user data

**Login Flow**:
1. Receive login request (email, password)
2. Validate input
3. Call Cognito InitiateAuth API
4. Retrieve user record from DynamoDB
5. Return success response with tokens and user data

---

### 2. Wardrobe Service

#### Service Boundary
- **Domain**: Wardrobe item management
- **Lambda Function**: WardrobeHandler
- **API Endpoints**:
  - `POST /wardrobe/items` - Add item
  - `GET /wardrobe/items` - Get all items
  - `PUT /wardrobe/items/{itemId}` - Update item
  - `DELETE /wardrobe/items/{itemId}` - Delete item

#### Responsibilities
- CRUD operations for wardrobe items
- Usage tracking (lastWorn, timesWorn)
- Image upload coordination (S3)
- Item validation

#### Dependencies
- **AWS Services**: DynamoDB (Wardrobe table), S3 (optional, for images)
- **Internal**: AuthMiddleware (for user context)
- **External**: None

#### Service Interface
```typescript
interface WardrobeServiceInterface {
  addItem(userId: string, item: CreateWardrobeItemInput): Promise<WardrobeItem>;
  getItems(userId: string): Promise<WardrobeItem[]>;
  updateItem(userId: string, itemId: string, updates: UpdateWardrobeItemInput): Promise<WardrobeItem>;
  deleteItem(userId: string, itemId: string): Promise<void>;
  updateUsageTracking(userId: string, itemIds: string[]): Promise<void>;
}
```

#### Orchestration Flow

**Add Item Flow**:
1. Receive add item request with item attributes
2. Validate input (required fields, data types)
3. Generate unique itemId
4. If image provided, upload to S3 and get URL
5. Create item record in DynamoDB Wardrobe table
6. Return created item

**Update Usage Tracking Flow** (called by Outfit Service):
1. Receive list of itemIds and date
2. For each itemId:
   - Update lastWorn to current date
   - Increment timesWorn counter
3. Batch update DynamoDB records

---

### 3. Outfit Service

#### Service Boundary
- **Domain**: Outfit logging and calendar management
- **Lambda Function**: OutfitHandler
- **API Endpoints**:
  - `POST /outfits` - Log outfit
  - `GET /outfits` - Get outfits (with date range)
  - `PUT /outfits/{date}` - Update outfit
  - `DELETE /outfits/{date}` - Delete outfit

#### Responsibilities
- Log outfits for specific dates
- Retrieve outfits for calendar display
- Update and delete logged outfits
- Trigger usage tracking updates in Wardrobe Service

#### Dependencies
- **AWS Services**: DynamoDB (Outfits table)
- **Internal**: AuthMiddleware, WardrobeService (for usage tracking)
- **External**: None

#### Service Interface
```typescript
interface OutfitServiceInterface {
  logOutfit(userId: string, date: string, itemIds: string[], eventType?: string): Promise<Outfit>;
  getOutfits(userId: string, startDate?: string, endDate?: string): Promise<Outfit[]>;
  updateOutfit(userId: string, date: string, itemIds: string[]): Promise<Outfit>;
  deleteOutfit(userId: string, date: string): Promise<void>;
}
```

#### Orchestration Flow

**Log Outfit Flow**:
1. Receive log outfit request (date, itemIds, optional eventType)
2. Validate input (date format, itemIds exist)
3. Create outfit record in DynamoDB Outfits table
4. Call WardrobeService.updateUsageTracking(userId, itemIds)
5. Return created outfit

**Get Outfits Flow**:
1. Receive get outfits request with optional date range
2. Query DynamoDB Outfits table by userId and date range
3. Return outfit records

---

### 4. Events Service

#### Service Boundary
- **Domain**: Event planning and management
- **Lambda Function**: EventsHandler
- **API Endpoints**:
  - `POST /events` - Create event
  - `GET /events` - Get all events
  - `PUT /events/{eventId}` - Update event
  - `DELETE /events/{eventId}` - Delete event

#### Responsibilities
- CRUD operations for events
- Event scheduling and reminder coordination
- Event-to-outfit association

#### Dependencies
- **AWS Services**: DynamoDB (Events table), EventBridge (for reminder scheduling)
- **Internal**: AuthMiddleware
- **External**: None

#### Service Interface
```typescript
interface EventsServiceInterface {
  createEvent(userId: string, event: CreateEventInput): Promise<Event>;
  getEvents(userId: string): Promise<Event[]>;
  updateEvent(userId: string, eventId: string, updates: UpdateEventInput): Promise<Event>;
  deleteEvent(userId: string, eventId: string): Promise<void>;
  getEventsTomorrow(): Promise<Event[]>;
}
```

#### Orchestration Flow

**Create Event Flow**:
1. Receive create event request (title, date, type)
2. Validate input
3. Generate unique eventId
4. Create event record in DynamoDB Events table
5. EventBridge rule will automatically trigger reminders (no explicit scheduling needed)
6. Return created event

**Get Events Tomorrow Flow** (used by Reminder Service):
1. Calculate tomorrow's date
2. Query DynamoDB Events table for events on that date
3. Return matching events

---

### 5. Suggestions Service

#### Service Boundary
- **Domain**: Outfit suggestion generation
- **Lambda Function**: SuggestionsHandler
- **API Endpoints**:
  - `GET /suggestions?date={date}&eventId={eventId}` - Get suggestions

#### Responsibilities
- Generate outfit suggestions based on weather and events
- Filter wardrobe items by criteria
- Rank and return top suggestions

#### Dependencies
- **AWS Services**: DynamoDB (Wardrobe, Outfits, Events tables)
- **Internal**: AuthMiddleware, WardrobeService, OutfitService, EventsService, SuggestionEngine (shared module)
- **External**: OpenWeatherMap API

#### Service Interface
```typescript
interface SuggestionsServiceInterface {
  getSuggestions(userId: string, params: SuggestionParams): Promise<OutfitSuggestion[]>;
}

interface SuggestionParams {
  date?: string;
  eventId?: string;
}
```

#### Orchestration Flow

**Get Suggestions Flow**:
1. Receive suggestion request with optional date and eventId
2. Extract userId from auth context
3. Fetch user's wardrobe items from WardrobeService
4. Fetch recent outfits (last 5 days) from OutfitService
5. If eventId provided, fetch event details from EventsService
6. Fetch weather data from WeatherService (current or forecast)
7. Pass data to SuggestionEngine.generateSuggestions()
8. SuggestionEngine performs:
   - Filter items by weather suitability
   - Filter items by occasion/event type
   - Exclude recently worn items
   - Generate outfit combinations
   - Rank suggestions
9. Return top 2-3 suggestions

---

### 6. Notification Service

#### Service Boundary
- **Domain**: Notification preferences and reminder delivery
- **Lambda Functions**: NotificationHandler, ReminderHandler
- **API Endpoints**:
  - `PUT /user/preferences` - Update notification preferences
  - `GET /user/preferences` - Get notification preferences
- **Scheduled**: ReminderHandler (triggered daily by EventBridge)

#### Responsibilities
- Manage user notification preferences
- Send SMS reminders for upcoming events
- Format reminder messages

#### Dependencies
- **AWS Services**: DynamoDB (Users table), SNS (for SMS), EventBridge (for scheduling)
- **Internal**: AuthMiddleware, EventsService
- **External**: None

#### Service Interface
```typescript
interface NotificationServiceInterface {
  updatePreferences(userId: string, notificationsEnabled: boolean): Promise<void>;
  getPreferences(userId: string): Promise<UserPreferences>;
  sendSMS(phoneNumber: string, message: string): Promise<void>;
}
```

#### Orchestration Flow

**Update Preferences Flow**:
1. Receive update preferences request (notificationsEnabled)
2. Validate input
3. Update user record in DynamoDB Users table
4. Return success response

**Reminder Processing Flow** (scheduled daily):
1. EventBridge triggers ReminderHandler Lambda
2. Call EventsService.getEventsTomorrow()
3. For each event:
   - Fetch user record from DynamoDB
   - Check if notificationsEnabled = true
   - If enabled, format reminder message
   - Send SMS via SNS
4. Log reminder delivery status

---

### 7. Analytics Service

#### Service Boundary
- **Domain**: Outfit usage analytics and insights
- **Lambda Function**: AnalyticsHandler
- **API Endpoints**:
  - `GET /analytics` - Get analytics data

#### Responsibilities
- Calculate most worn items
- Calculate least worn items
- Calculate outfit frequency statistics
- Aggregate usage data

#### Dependencies
- **AWS Services**: DynamoDB (Wardrobe, Outfits tables)
- **Internal**: AuthMiddleware, WardrobeService, OutfitService
- **External**: None

#### Service Interface
```typescript
interface AnalyticsServiceInterface {
  getAnalytics(userId: string): Promise<AnalyticsData>;
}

interface AnalyticsData {
  mostWornItems: WardrobeItem[];
  leastWornItems: WardrobeItem[];
  outfitFrequency: Record<string, number>;
}
```

#### Orchestration Flow

**Get Analytics Flow**:
1. Receive analytics request
2. Extract userId from auth context
3. Fetch all wardrobe items from WardrobeService
4. Fetch all outfits from OutfitService
5. Calculate analytics:
   - Sort items by timesWorn (descending) for most worn
   - Sort items by timesWorn (ascending) for least worn
   - Group outfits by month and count for frequency
6. Return analytics data

---

## Shared Service Modules

### SuggestionEngine (Shared Module)

#### Purpose
Reusable outfit suggestion logic that can be called by multiple services

#### Location
Shared utility module imported by SuggestionsHandler

#### Responsibilities
- Implement suggestion algorithm
- Filter and rank outfit combinations
- Generate reasoning for suggestions

#### Why Shared Module?
- Complex business logic that may be reused
- Easier to test independently
- Can be called from multiple contexts (API, scheduled tasks, etc.)

---

### WeatherService (Shared Module)

#### Purpose
Weather data integration and caching

#### Location
Shared utility module imported by SuggestionEngine

#### Responsibilities
- Call OpenWeatherMap API
- Parse and normalize weather data
- Cache weather data to reduce API calls
- Map weather conditions to suitability tags

#### Why Shared Module?
- External API integration logic
- Caching strategy centralized
- May be used by multiple services in future

---

## Service Communication Patterns

### Synchronous Communication
- **Frontend → Backend**: REST API calls via API Gateway
- **Service → Repository**: Direct method calls
- **Service → AWS SDK**: Direct SDK calls (DynamoDB, S3, SNS, Cognito)

### Asynchronous Communication
- **EventBridge → ReminderHandler**: Scheduled trigger (daily)
- **Future**: Could add event-driven patterns (e.g., outfit logged → trigger analytics update)

### Cross-Service Communication
- **Outfit Service → Wardrobe Service**: Direct method call for usage tracking
- **Suggestions Service → Multiple Services**: Direct method calls to fetch data
- **Analytics Service → Multiple Services**: Direct method calls to fetch data

**Note**: All cross-service calls are synchronous within the same Lambda execution context. Services are organized as modules within Lambda functions, not separate microservices.

---

## Service Layer Benefits

### Clear Separation of Concerns
- **Handlers**: HTTP request/response handling, routing
- **Services**: Business logic orchestration
- **Repositories**: Data persistence
- **Utilities**: Shared functionality

### Testability
- Services can be unit tested independently
- Mock repositories for service tests
- Mock services for handler tests

### Maintainability
- Changes to business logic isolated in services
- Data access changes isolated in repositories
- API changes isolated in handlers

### Scalability
- Each Lambda function scales independently
- Shared modules reduce code duplication
- Repository pattern allows easy database migration

---

## Service Orchestration Examples

### Example 1: Log Outfit with Usage Tracking

```
Frontend Request: POST /outfits
  ↓
API Gateway
  ↓
OutfitHandler.handleLogOutfit()
  ↓
OutfitService.logOutfit(userId, date, itemIds)
  ├→ OutfitRepository.create(outfit)
  └→ WardrobeService.updateUsageTracking(userId, itemIds)
      └→ WardrobeRepository.batchUpdateUsage(userId, itemIds, date)
  ↓
Response: Created outfit
```

### Example 2: Get Outfit Suggestions

```
Frontend Request: GET /suggestions?date=2026-04-01&eventId=evt123
  ↓
API Gateway
  ↓
SuggestionsHandler.handleGetSuggestions()
  ↓
SuggestionEngine.generateSuggestions(params)
  ├→ WardrobeService.getItems(userId)
  ├→ OutfitService.getOutfits(userId, last5Days)
  ├→ EventsService.getEvent(userId, eventId)
  ├→ WeatherService.getForecast(location, date)
  ├→ Filter by weather suitability
  ├→ Filter by occasion/event type
  ├→ Exclude recently worn items
  ├→ Generate combinations
  └→ Rank suggestions
  ↓
Response: Top 2-3 outfit suggestions
```

### Example 3: Daily Reminder Processing

```
EventBridge (Daily Trigger)
  ↓
ReminderHandler.handler()
  ↓
ReminderHandler.processReminders()
  ├→ EventsService.getEventsTomorrow()
  └→ For each event:
      ├→ Fetch user from DynamoDB
      ├→ Check notificationsEnabled
      └→ If enabled:
          ├→ NotificationService.formatReminderMessage(event)
          └→ NotificationService.sendSMS(phoneNumber, message)
              └→ SNS.publish()
```

---

## Error Handling Strategy

### Service-Level Error Handling
- Services throw typed exceptions (ValidationError, NotFoundError, ExternalServiceError)
- Handlers catch exceptions and map to HTTP status codes
- ErrorHandler utility provides consistent error responses

### Retry Strategy
- Transient DynamoDB errors: Automatic SDK retry
- External API failures (Weather): Graceful degradation (use cached data or skip weather filtering)
- SNS failures: Log error, don't block user operations

### Logging
- All services log to CloudWatch
- Include userId, operation, and relevant context
- Log errors with stack traces

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for Review
