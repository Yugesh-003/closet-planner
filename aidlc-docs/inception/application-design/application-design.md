# ClosetMind - Application Design

## Document Overview
This document consolidates the complete application design for ClosetMind, including component architecture, method signatures, service layer design, and dependency relationships.

**Related Documents**:
- `components.md` - Detailed component definitions
- `component-methods.md` - Method signatures for all components
- `services.md` - Service layer architecture and orchestration
- `component-dependency.md` - Dependency matrix and communication patterns

---

## Executive Summary

### Architecture Style
- **Frontend**: React SPA with feature-based hybrid organization
- **Backend**: Serverless microservices with service-based Lambda organization
- **Database**: NoSQL (DynamoDB) with repository pattern
- **API**: Hybrid REST (resource-based + action endpoints)
- **State Management**: React Query (server state) + Context API (UI state)
- **Authentication**: Hybrid (frontend session management + backend validation)

### Key Design Decisions

1. **Hybrid Frontend Organization**
   - Feature folders with type subfolders (e.g., `wardrobe/components/`, `wardrobe/hooks/`)
   - Promotes feature cohesion while maintaining type clarity
   - Easier to locate related code

2. **React Query + Context**
   - React Query for server state (caching, synchronization, optimistic updates)
   - Context API for UI state (theme, modals, notifications)
   - Reduces boilerplate, improves performance

3. **Service-Based Lambda with Shared Utilities**
   - One Lambda per service domain (auth, wardrobe, calendar, events, suggestions, notifications, analytics)
   - Shared utility modules (SuggestionEngine, WeatherService, ErrorHandler, etc.)
   - Balances cold start performance with code organization

4. **Hybrid REST API**
   - Resource-based endpoints for CRUD (`/wardrobe/items`, `/events`)
   - Action-based endpoints for complex operations (`/suggestions`, `/analytics`)
   - Pragmatic approach for different use cases

5. **Service Layer with Data Access Methods**
   - Services orchestrate business logic
   - Repositories handle data persistence
   - Clear separation of concerns, easier testing

6. **Separate Suggestion Engine Module**
   - Complex business logic isolated in shared module
   - Can be reused by multiple services
   - Easier to test and maintain

7. **Hybrid Authentication Flow**
   - Frontend manages Cognito session (login, token refresh)
   - Backend validates tokens via middleware
   - Secure and user-friendly

8. **Backend-Only Shared Code**
   - No shared business logic between frontend and backend
   - Frontend calls APIs for all operations
   - Simpler deployment, clearer boundaries

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           React Frontend (Amplify Hosting)                  │ │
│  │                                                             │ │
│  │  Pages: Login, Dashboard, Wardrobe, Calendar, Events,      │ │
│  │         Suggestions, Settings                               │ │
│  │                                                             │ │
│  │  State: React Query (server) + Context (UI)                │ │
│  │                                                             │ │
│  │  Hooks: useAuth, useWardrobe, useCalendar, useEvents,      │ │
│  │         useSuggestions, useAnalytics, useSettings           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AWS API GATEWAY                             │
│                                                                  │
│  Routes: /auth/*, /wardrobe/*, /outfits, /events,               │
│          /suggestions, /analytics, /user/preferences            │
│                                                                  │
│  CORS, Throttling, Request Validation                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Invoke
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AWS LAMBDA FUNCTIONS                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ AuthHandler  │  │WardrobeHandler│  │OutfitHandler │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │EventsHandler │  │Suggestions   │  │Notification  │          │
│  │              │  │Handler       │  │Handler       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │Analytics     │  │Reminder      │                            │
│  │Handler       │  │Handler       │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
│  Shared Modules: SuggestionEngine, WeatherService,              │
│                  ErrorHandler, ResponseFormatter, Validator     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SDK Calls
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AWS SERVICES                                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Cognito    │  │  DynamoDB    │  │      S3      │          │
│  │  User Pool   │  │              │  │  (Images)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │     SNS      │  │ EventBridge  │                            │
│  │    (SMS)     │  │  (Schedule)  │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           OpenWeatherMap API                              │  │
│  │           (Weather Data)                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Summary

### Frontend Components: 40+
- **7 Page Components**: LoginPage, SignupPage, WardrobePage, CalendarPage, EventsPage, SuggestionsPage, DashboardPage, SettingsPage
- **20+ UI Components**: Modals, Cards, Widgets, Forms
- **8 Custom Hooks**: useAuth, useWardrobe, useCalendar, useEvents, useSuggestions, useAnalytics, useSettings
- **5 Shared Components**: Layout, Navigation, LoadingSpinner, ErrorBoundary, Toast

### Backend Components: 25+
- **8 Lambda Handlers**: AuthHandler, WardrobeHandler, OutfitHandler, EventsHandler, SuggestionsHandler, NotificationHandler, ReminderHandler, AnalyticsHandler
- **10 Service Modules**: AuthService, WardrobeService, OutfitService, EventsService, SuggestionEngine, WeatherService, NotificationService, AnalyticsService
- **4 Repository Modules**: WardrobeRepository, OutfitRepository, EventsRepository
- **3 Shared Utilities**: AuthMiddleware, ErrorHandler, ResponseFormatter, Validator

### Infrastructure Components: 8
- Cognito, DynamoDB, S3, SNS, EventBridge, API Gateway, Lambda, Amplify Hosting

**See `components.md` for detailed component definitions**

---

## Service Layer Architecture

### Service Organization
- **Service-Based Lambda**: One Lambda per service domain
- **Shared Modules**: Reusable logic (SuggestionEngine, WeatherService)
- **Layered Architecture**: Handler → Service → Repository → Database

### Key Services

1. **Authentication Service**: User signup, login, token validation
2. **Wardrobe Service**: CRUD for wardrobe items, usage tracking
3. **Outfit Service**: Log outfits, retrieve for calendar, trigger usage updates
4. **Events Service**: CRUD for events, reminder coordination
5. **Suggestions Service**: Generate outfit suggestions using SuggestionEngine
6. **Notification Service**: Manage preferences, send SMS reminders
7. **Analytics Service**: Calculate usage statistics

### Service Orchestration Patterns

**Example: Log Outfit with Usage Tracking**
```
OutfitService.logOutfit()
  → OutfitRepository.create()
  → WardrobeService.updateUsageTracking()
    → WardrobeRepository.batchUpdateUsage()
```

**Example: Get Outfit Suggestions**
```
SuggestionEngine.generateSuggestions()
  → WardrobeService.getItems()
  → OutfitService.getOutfits()
  → EventsService.getEvent()
  → WeatherService.getForecast()
  → Filter, combine, rank
  → Return top 2-3 suggestions
```

**See `services.md` for detailed service layer design**

---

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Wardrobe Management
- `POST /wardrobe/items` - Add item
- `GET /wardrobe/items` - Get all items
- `PUT /wardrobe/items/{itemId}` - Update item
- `DELETE /wardrobe/items/{itemId}` - Delete item

### Outfit Logging
- `POST /outfits` - Log outfit
- `GET /outfits?startDate={date}&endDate={date}` - Get outfits
- `PUT /outfits/{date}` - Update outfit
- `DELETE /outfits/{date}` - Delete outfit

### Event Planning
- `POST /events` - Create event
- `GET /events` - Get all events
- `PUT /events/{eventId}` - Update event
- `DELETE /events/{eventId}` - Delete event

### Outfit Suggestions
- `GET /suggestions?date={date}&eventId={eventId}` - Get suggestions

### Analytics
- `GET /analytics` - Get usage analytics

### User Preferences
- `PUT /user/preferences` - Update notification preferences
- `GET /user/preferences` - Get notification preferences

---

## Data Models

### DynamoDB Tables

#### Users Table
```
PK: userId (String)
Attributes:
  - name (String)
  - email (String)
  - notificationsEnabled (Boolean)
  - createdAt (String, ISO timestamp)
```

#### Wardrobe Table
```
PK: userId (String)
SK: itemId (String)
Attributes:
  - name (String)
  - type (String)
  - category (String)
  - color (String)
  - fabric (String)
  - occasion (List<String>)
  - comfort (String)
  - weatherSuitability (List<String>)
  - lastWorn (String, ISO date)
  - timesWorn (Number)
  - imageUrl (String, optional)
  - createdAt (String, ISO timestamp)
```

#### Outfits Table
```
PK: userId (String)
SK: date (String, YYYY-MM-DD)
Attributes:
  - itemIds (List<String>)
  - eventType (String, optional)
  - createdAt (String, ISO timestamp)
```

#### Events Table
```
PK: userId (String)
SK: eventId (String)
Attributes:
  - title (String)
  - date (String, YYYY-MM-DD)
  - type (String)
  - createdAt (String, ISO timestamp)
```

---

## Component Dependencies

### Frontend Dependency Flow
```
Pages → Hooks → API Gateway → Backend Services
```

### Backend Dependency Flow
```
API Gateway → Handlers → Services → Repositories → DynamoDB
                       ↓
                  AWS Services (Cognito, S3, SNS)
                       ↓
                  External APIs (Weather)
```

### Cross-Service Dependencies
- OutfitService → WardrobeService (usage tracking)
- SuggestionEngine → WardrobeService, OutfitService, EventsService, WeatherService
- AnalyticsService → WardrobeService, OutfitService
- ReminderHandler → EventsService, NotificationService

**See `component-dependency.md` for detailed dependency matrix**

---

## Key Design Patterns

### Frontend Patterns
1. **Custom Hooks Pattern**: Encapsulate API calls and state management
2. **Compound Component Pattern**: Complex UI components (modals, cards)
3. **Render Props Pattern**: Flexible component composition
4. **Container/Presentational Pattern**: Separate logic from UI

### Backend Patterns
1. **Repository Pattern**: Abstract data access layer
2. **Service Layer Pattern**: Orchestrate business logic
3. **Middleware Pattern**: Cross-cutting concerns (auth, error handling)
4. **Strategy Pattern**: Different suggestion algorithms (future)

### Infrastructure Patterns
1. **Serverless Pattern**: Event-driven, auto-scaling
2. **API Gateway Pattern**: Single entry point for all APIs
3. **Scheduled Task Pattern**: EventBridge triggers for reminders

---

## Non-Functional Requirements Support

### Performance
- **Frontend**: React Query caching, lazy loading, code splitting
- **Backend**: Lambda cold start optimization, DynamoDB efficient queries
- **Caching**: Weather data caching, React Query cache

### Security
- **Authentication**: Cognito JWT tokens
- **Authorization**: Middleware validates tokens, userId-based data access
- **Data Protection**: HTTPS, DynamoDB encryption at rest
- **Input Validation**: Validator utility on all inputs

### Scalability
- **Frontend**: CDN distribution via Amplify
- **Backend**: Lambda auto-scaling, DynamoDB on-demand capacity
- **Stateless**: All Lambda functions stateless

### Reliability
- **Error Handling**: Comprehensive error handling in all layers
- **Retry Logic**: AWS SDK automatic retries
- **Graceful Degradation**: Weather API failure doesn't block suggestions

### Maintainability
- **Layered Architecture**: Clear separation of concerns
- **Dependency Injection**: Testable components
- **Type Safety**: TypeScript throughout
- **Documentation**: Inline comments, API documentation

### Cost Optimization
- **Serverless**: Pay per use, no idle costs
- **DynamoDB**: On-demand pricing, efficient queries
- **S3**: Lifecycle policies for images
- **Lambda**: Right-sized memory allocation

---

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Components, hooks (Jest, React Testing Library)
- **Integration Tests**: Feature flows (Cypress)
- **E2E Tests**: Critical user journeys (Cypress)

### Backend Testing
- **Unit Tests**: Services, repositories (Jest)
- **Integration Tests**: Handler + Service + Repository (Jest with local DynamoDB)
- **Contract Tests**: API endpoint contracts (Pact)

### Infrastructure Testing
- **SAM Local**: Test Lambda functions locally
- **Integration Tests**: Test with real AWS services (test account)

---

## Deployment Architecture

### Frontend Deployment
- **Hosting**: AWS Amplify Hosting
- **Build**: Vite build process
- **CI/CD**: Amplify automatic deployments from Git

### Backend Deployment
- **IaC**: AWS SAM templates
- **Build**: SAM build process
- **Deploy**: SAM deploy to AWS
- **CI/CD**: GitHub Actions or AWS CodePipeline

### Environment Strategy
- **Development**: Local development with SAM Local
- **Staging**: Test AWS account
- **Production**: Production AWS account

---

## Future Enhancements (Out of Scope for MVP)

### Potential Architectural Changes
1. **GraphQL API**: Replace REST with GraphQL for flexible queries
2. **Event-Driven Architecture**: Use EventBridge for service communication
3. **Caching Layer**: Add ElastiCache for frequently accessed data
4. **ML-Based Suggestions**: Replace rule-based engine with ML model
5. **Real-Time Features**: Add WebSocket support for real-time updates
6. **Multi-Region**: Deploy to multiple AWS regions for global users

---

## Design Validation

### Requirements Coverage
✅ All functional requirements covered by components  
✅ All user stories mapped to components  
✅ All API endpoints defined  
✅ All data models specified  

### Design Quality
✅ No circular dependencies  
✅ Clear separation of concerns  
✅ Testable architecture  
✅ Scalable design  
✅ Secure by design  

### NFR Support
✅ Performance requirements addressed  
✅ Security requirements addressed  
✅ Scalability requirements addressed  
✅ Cost optimization addressed  
✅ Maintainability addressed  

---

## Summary

The ClosetMind application design provides a solid foundation for building a scalable, maintainable, and user-friendly outfit planning system. The architecture leverages AWS serverless services for cost efficiency and scalability, while maintaining clear separation of concerns and testability.

**Key Strengths**:
- Clear component boundaries and responsibilities
- Scalable serverless architecture
- Comprehensive service layer design
- Well-defined dependencies and communication patterns
- Support for all functional and non-functional requirements

**Next Steps**:
- Proceed to Units Generation to decompose into development units
- Then move to CONSTRUCTION phase for detailed design and implementation

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for Review and Approval
