# ClosetMind - Unit of Work Dependencies

## Overview
Since ClosetMind uses a single unit of work approach, there are no inter-unit dependencies. This document describes internal dependencies within the unit.

---

## Unit Dependency Matrix

| Unit | Depends On | Dependency Type |
|------|------------|-----------------|
| ClosetMind Full-Stack | None | N/A - Single unit |

---

## Internal Component Dependencies

### Frontend → Backend
- All frontend hooks depend on Backend API endpoints
- Communication via HTTP REST through API Gateway

### Backend → Database
- All repositories depend on DynamoDB tables
- Communication via AWS SDK

### Backend → AWS Services
- AuthService → Cognito User Pool
- WardrobeService → S3 (optional, for images)
- NotificationService → SNS (for SMS)
- ReminderHandler → EventBridge (scheduled trigger)

### Backend → External Services
- WeatherService → OpenWeatherMap API

---

## Development Sequence

Since this is a single unit with iterative development, the sequence is based on feature priority rather than unit dependencies:

### Phase 1: Foundation (Week 1)
- Infrastructure setup (SAM template, DynamoDB tables, Cognito)
- Basic frontend structure (routing, layout, navigation)
- Authentication (signup, login)

### Phase 2: Core Features (Week 2)
- Wardrobe management (add, view, edit, delete items)
- Calendar view and outfit logging
- Usage tracking

### Phase 3: Advanced Features (Week 3)
- Event management
- Outfit suggestions with weather integration
- Suggestion engine logic

### Phase 4: Notifications & Analytics (Week 4)
- SMS reminders setup
- Notification preferences
- Analytics dashboard

### Phase 5: Polish & Deploy (Week 5)
- Error handling and validation
- UI/UX improvements
- Testing and bug fixes
- Production deployment

---

## Integration Points

### Frontend ↔ Backend Integration
- **Contract**: REST API with JSON payloads
- **Authentication**: JWT tokens in Authorization header
- **Error Handling**: Standard HTTP status codes

### Backend ↔ DynamoDB Integration
- **Pattern**: Repository pattern for data access
- **Consistency**: Eventually consistent reads acceptable for MVP
- **Optimization**: Efficient query patterns with proper keys

### Backend ↔ External Services Integration
- **Weather API**: HTTP client with caching
- **Cognito**: AWS SDK for authentication
- **SNS**: AWS SDK for SMS delivery
- **EventBridge**: Scheduled Lambda triggers

---

## Coordination Mechanisms

### API Contracts
- Define API endpoints upfront in application design
- Use TypeScript types for request/response
- Document in OpenAPI/Swagger (optional for MVP)

### Shared Types
- Backend-only approach - no shared types between frontend and backend
- Frontend defines its own types based on API responses
- Simpler deployment, clearer boundaries

### Testing Coordination
- Frontend can use mock API responses during development
- Backend can be tested independently with local DynamoDB
- Integration tests verify frontend + backend together

---

## Dependency Management

### NPM Dependencies
- **Frontend**: React, React Router, React Query, Axios, Tailwind CSS
- **Backend**: AWS SDK v3, Axios (for Weather API)
- **Shared**: TypeScript, Jest (testing)

### AWS Service Dependencies
- All AWS services provisioned via SAM template
- Infrastructure as Code ensures consistency
- No manual AWS console configuration needed

---

## Risk Assessment

### Low Risk (Single Unit)
- ✅ No inter-unit coordination needed
- ✅ No version compatibility issues between units
- ✅ Simpler deployment process
- ✅ Faster development for small team

### Mitigation Strategies
- Clear module boundaries within the unit
- Comprehensive testing at all levels
- Iterative delivery reduces risk of large failures

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for CONSTRUCTION Phase
