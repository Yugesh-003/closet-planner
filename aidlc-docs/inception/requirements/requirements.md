# ClosetMind - Requirements Document

## Intent Analysis Summary

**User Request**: Build a full-stack web application called "ClosetMind" - a women-centric smart outfit planning system

**Request Type**: New Project (Greenfield)

**Scope Estimate**: System-wide - Full-stack serverless application with multiple integrated components

**Complexity Estimate**: Moderate - Multiple features with AWS serverless integration, rule-based logic, and scheduled notifications

---

## 1. Functional Requirements

### 1.1 User Authentication
- **FR-1.1**: Users can sign up with email and password using Amazon Cognito
- **FR-1.2**: Users can log in with email and password
- **FR-1.3**: User profile stores minimal fields: userId, name, email
- **FR-1.4**: No social login or MFA required for MVP

### 1.2 Wardrobe Management
- **FR-2.1**: Users can add clothing items with the following attributes:
  - Name (text)
  - Type (top, bottom, dress, saree, etc.)
  - Category (casual, formal, traditional)
  - Color (text)
  - Fabric (text)
  - Occasion tags (college, office, function, casual) - multiple tags allowed
  - Comfort level (high, medium, low)
  - Weather suitability (hot, cold, rain) - multiple tags allowed
- **FR-2.2**: Optional image upload capability (store in S3, save URL in database) - nice-to-have for MVP
- **FR-2.3**: System tracks lastWorn date and timesWorn count for each item
- **FR-2.4**: Users can view all wardrobe items
- **FR-2.5**: Users can edit and delete wardrobe items

### 1.3 Calendar-Based Outfit Logging
- **FR-3.1**: Display monthly calendar view
- **FR-3.2**: Users can click on any date to log an outfit
- **FR-3.3**: Users can select multiple wardrobe items to create an outfit
- **FR-3.4**: Outfits are stored as references to wardrobe item IDs
- **FR-3.5**: Users can view logged outfits on the calendar
- **FR-3.6**: Users can edit or delete logged outfits

### 1.4 Event Planning
- **FR-4.1**: Users can create events with:
  - Title (text)
  - Date (date)
  - Type (formal, casual, function, interview)
- **FR-4.2**: Users can view all upcoming events
- **FR-4.3**: Users can edit and delete events
- **FR-4.4**: Events are associated with outfit suggestions

### 1.5 Smart Outfit Suggestions (Rule-Based)
- **FR-5.1**: System fetches current weather data using a free weather API (OpenWeatherMap recommended)
- **FR-5.2**: System filters wardrobe items based on:
  - Weather suitability matching current weather
  - Occasion tags matching event type
  - Comfort level preferences
- **FR-5.3**: System excludes items worn in the last 3-5 days
- **FR-5.4**: System generates outfit combinations:
  - Top + Bottom combinations
  - Top + Bottom + Accessories (if available)
  - Complete outfits (dresses, sarees) as single items
  - Flexible logic based on item types
- **FR-5.5**: System returns 2-3 outfit suggestions per request
- **FR-5.6**: Users can request outfit suggestions for specific dates or events

### 1.6 Reminder System
- **FR-6.1**: System sends SMS notifications via Amazon SNS for event reminders
- **FR-6.2**: Reminders are sent 1 day before scheduled events
- **FR-6.3**: Users can enable/disable notifications (cannot change timing in MVP)
- **FR-6.4**: Reminders are triggered using AWS Lambda with EventBridge Scheduler

### 1.7 Outfit Analytics
- **FR-7.1**: Dashboard displays outfit usage analytics:
  - Most worn items
  - Least worn items
  - Outfit frequency statistics
- **FR-7.2**: Each wardrobe item shows last worn date

### 1.8 User Onboarding
- **FR-8.1**: First-time users see a simple welcome message with tips
- **FR-8.2**: No guided tour required for MVP

---

## 2. Non-Functional Requirements

### 2.1 Performance
- **NFR-1.1**: Page load time should be under 3 seconds on standard broadband
- **NFR-1.2**: API response time should be under 2 seconds for most operations
- **NFR-1.3**: Calendar view should render smoothly with up to 365 days of outfit data

### 2.2 Security
- **NFR-2.1**: Follow standard AWS security best practices
- **NFR-2.2**: Use HTTPS for all communications
- **NFR-2.3**: Implement proper authentication and authorization using Cognito
- **NFR-2.4**: Validate all user inputs on both client and server side
- **NFR-2.5**: Security extension rules are NOT enforced (MVP/prototype scope)

### 2.3 Scalability
- **NFR-3.1**: Architecture should support multiple concurrent users
- **NFR-3.2**: DynamoDB tables should use appropriate partition keys for scalability
- **NFR-3.3**: Lambda functions should be stateless and horizontally scalable

### 2.4 Usability
- **NFR-4.1**: UI should be clean, intuitive, and mobile-friendly
- **NFR-4.2**: Responsive design - work well on both mobile and desktop devices
- **NFR-4.3**: Basic accessibility: keyboard navigation and alt text for images
- **NFR-4.4**: Consistent design language using Tailwind CSS

### 2.5 Reliability
- **NFR-5.1**: Comprehensive error handling with detailed error messages
- **NFR-5.2**: Input validation with user-friendly feedback
- **NFR-5.3**: Retry logic for transient failures
- **NFR-5.4**: Graceful degradation if external services (weather API) are unavailable

### 2.6 Maintainability
- **NFR-6.1**: Code should be well-structured and documented
- **NFR-6.2**: Use TypeScript for type safety in frontend
- **NFR-6.3**: Follow serverless best practices for backend
- **NFR-6.4**: Unit tests and integration tests required
- **NFR-6.5**: Property-based testing enforced for pure functions and serialization (partial enforcement)

### 2.7 Cost Efficiency
- **NFR-7.1**: Stay within AWS free tier as much as possible
- **NFR-7.2**: Use serverless architecture to minimize costs
- **NFR-7.3**: Optimize DynamoDB read/write operations
- **NFR-7.4**: Use S3 for image storage (if implemented) with appropriate lifecycle policies

---

## 3. Technical Architecture

### 3.1 Frontend
- **Tech Stack**: React with TypeScript, Vite build tool
- **Styling**: Tailwind CSS
- **Pages**:
  - Login / Signup
  - Dashboard (with analytics)
  - Wardrobe Management
  - Calendar View
  - Events Management
  - Outfit Suggestions
- **Deployment**: AWS Amplify Hosting

### 3.2 Backend
- **Architecture**: Serverless
- **Compute**: AWS Lambda (Node.js recommended for consistency with frontend)
- **API**: Amazon API Gateway (REST API)
- **Deployment**: AWS SAM (Serverless Application Model)

### 3.3 Database
- **Service**: Amazon DynamoDB
- **Tables**:
  1. **Users**
     - userId (PK)
     - name
     - email
     - notificationsEnabled (boolean)
  2. **Wardrobe**
     - userId (PK)
     - itemId (SK)
     - name, type, category, color, fabric
     - occasion (list)
     - comfort, weatherSuitability (list)
     - lastWorn, timesWorn
     - imageUrl (optional)
  3. **Outfits**
     - userId (PK)
     - date (SK)
     - itemIds (list)
     - eventType (optional)
  4. **Events**
     - userId (PK)
     - eventId (SK)
     - title, date, type

### 3.4 External Services
- **Notifications**: Amazon SNS for SMS
- **Scheduling**: Amazon EventBridge Scheduler
- **Weather API**: OpenWeatherMap (free tier)
- **Storage**: Amazon S3 (for optional image uploads)
- **Authentication**: Amazon Cognito User Pools

### 3.5 API Endpoints (Lambda Functions)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /wardrobe/items` - Add wardrobe item
- `GET /wardrobe/items` - Get all wardrobe items
- `PUT /wardrobe/items/{itemId}` - Update wardrobe item
- `DELETE /wardrobe/items/{itemId}` - Delete wardrobe item
- `POST /outfits` - Log outfit for a date
- `GET /outfits` - Get outfits (with date range filter)
- `PUT /outfits/{date}` - Update outfit
- `DELETE /outfits/{date}` - Delete outfit
- `POST /events` - Create event
- `GET /events` - Get all events
- `PUT /events/{eventId}` - Update event
- `DELETE /events/{eventId}` - Delete event
- `GET /suggestions` - Get outfit suggestions (with date/event parameters)
- `GET /analytics` - Get outfit usage analytics
- `PUT /user/preferences` - Update notification preferences

---

## 4. Business Rules

### 4.1 Outfit Suggestion Logic
1. Fetch current weather or weather forecast for target date
2. Filter wardrobe items:
   - Match weatherSuitability with current/forecast weather
   - Match occasion tags with event type (if event exists)
   - Exclude items worn in last 3-5 days
3. Generate combinations:
   - If item type is "dress" or "saree": suggest as complete outfit
   - Otherwise: combine top + bottom
   - Add accessories if available and not recently worn
4. Rank suggestions by:
   - Least recently worn items
   - Comfort level (prefer high comfort)
5. Return top 2-3 suggestions

### 4.2 Notification Rules
1. Check for events scheduled for tomorrow (current date + 1 day)
2. For each event, check if user has notificationsEnabled = true
3. Send SMS reminder: "Reminder: You have [event title] tomorrow. Don't forget to prepare your outfit!"
4. Mark notification as sent to avoid duplicates

### 4.3 Analytics Calculation
- **Most Worn Items**: Sort by timesWorn (descending), show top 5
- **Least Worn Items**: Sort by timesWorn (ascending), show bottom 5 (exclude items never worn)
- **Outfit Frequency**: Calculate total outfits logged per month

---

## 5. User Scenarios

### 5.1 New User Journey
1. User signs up with email and password
2. User sees welcome message with tips
3. User adds wardrobe items (at least 5-10 items)
4. User creates an upcoming event
5. User requests outfit suggestions for the event
6. User logs chosen outfit on calendar
7. User receives SMS reminder 1 day before event

### 5.2 Daily Usage
1. User logs in
2. User views dashboard with analytics
3. User checks calendar to see past outfits
4. User logs today's outfit
5. User adds new wardrobe item if needed

### 5.3 Event Planning
1. User creates event (e.g., "Job Interview" on specific date)
2. User requests outfit suggestions for that date
3. System suggests 2-3 formal outfits based on weather
4. User selects and logs outfit for that date
5. User receives reminder 1 day before event

---

## 6. Constraints and Assumptions

### 6.1 Constraints
- Must stay within AWS free tier limits
- No ML/AI models - rule-based logic only
- MVP scope - focus on core features
- Single user per account (no multi-user/family accounts)

### 6.2 Assumptions
- Users have smartphones to receive SMS notifications
- Users will manually input wardrobe items (no automated scanning)
- Weather API will be available and reliable
- Users understand basic wardrobe terminology
- Internet connectivity is available for app usage

---

## 7. Out of Scope (Future Enhancements)

- Social features (sharing outfits, following other users)
- AI/ML-based outfit recommendations
- Automated outfit photo recognition
- Shopping integration or purchase recommendations
- Wardrobe organization tips or decluttering suggestions
- Multi-user accounts or family sharing
- Advanced calendar features (weekly/daily views)
- Cycle-aware comfort tracking (mentioned but not implemented in MVP)
- Custom notification timing
- Push notifications (only SMS for MVP)

---

## 8. Success Criteria

The MVP will be considered successful if:
1. Users can successfully sign up and log in
2. Users can add, view, edit, and delete wardrobe items
3. Users can log outfits on a calendar
4. Users can create and manage events
5. System generates relevant outfit suggestions based on weather and events
6. Users receive SMS reminders 1 day before events
7. Dashboard displays outfit usage analytics
8. Application is responsive and works on mobile and desktop
9. All core features work within AWS free tier limits
10. Unit and integration tests pass successfully

---

## 9. Extension Configuration

| Extension | Enabled | Rationale |
|-----------|---------|-----------|
| Security Baseline | No | MVP/prototype scope - standard AWS security practices sufficient |
| Property-Based Testing | Partial | Enforce for pure functions and serialization (outfit suggestion logic, data transformations) |

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Approved for Workflow Planning
