# ClosetMind - Unit of Work Story Mapping

## Overview
All 24 user stories are assigned to the single ClosetMind Full-Stack unit. Stories are organized by priority (MoSCoW) and development iteration.

---

## Story Assignment

### Unit: ClosetMind Full-Stack Application
**Total Stories**: 24 (5 epics + 19 standard stories)

---

## Priority-Based Story Organization

### Must Have Stories (16 stories) - Core MVP

#### Iteration 1: Authentication & Wardrobe Foundation
1. **EPIC-1**: User Authentication System
2. **US-1.1**: User Signup
3. **US-1.2**: User Login
4. **EPIC-2**: Wardrobe Management System
5. **US-2.1**: Add Wardrobe Item
6. **US-2.2**: View Wardrobe Items
7. **US-2.3**: Edit Wardrobe Item
8. **US-2.4**: Delete Wardrobe Item

#### Iteration 2: Calendar & Outfit Logging
9. **EPIC-3**: Calendar-Based Outfit Tracking
10. **US-3.1**: View Monthly Calendar
11. **US-3.2**: Log Outfit for a Date
12. **US-3.3**: View Logged Outfit Details
13. **US-7.2**: View Item Last Worn Information

#### Iteration 3: Events & Suggestions
14. **US-4.1**: Create Event
15. **US-4.2**: View Events List
16. **EPIC-4**: Rule-Based Outfit Suggestion Engine
17. **US-5.1**: Request Outfit Suggestions
18. **US-5.2**: View Outfit Suggestion Details

#### Iteration 4: Notifications
19. **US-6.1**: Receive Event Reminders

### Should Have Stories (7 stories) - Enhanced MVP

#### Iteration 4 (continued): Enhanced Features
20. **US-1.3**: First-Time User Onboarding
21. **US-3.4**: Edit Logged Outfit
22. **US-3.5**: Delete Logged Outfit
23. **US-4.3**: Edit Event
24. **US-4.4**: Delete Event
25. **US-5.3**: Select and Log Suggested Outfit
26. **US-6.2**: Configure Notification Preferences

#### Iteration 5: Analytics
27. **US-7.1**: View Outfit Usage Analytics

### Could Have Stories (1 story) - Future Enhancement
28. **US-2.5**: Upload Item Image (Optional)

---

## Story-to-Component Mapping

### Authentication Stories → Components
- EPIC-1, US-1.1, US-1.2, US-1.3
- **Frontend**: LoginPage, SignupPage, OnboardingModal, useAuth
- **Backend**: AuthHandler, AuthService
- **Infrastructure**: Cognito User Pool

### Wardrobe Stories → Components
- EPIC-2, US-2.1, US-2.2, US-2.3, US-2.4, US-2.5
- **Frontend**: WardrobePage, WardrobeItemCard, AddItemModal, EditItemModal, useWardrobe
- **Backend**: WardrobeHandler, WardrobeService, WardrobeRepository
- **Infrastructure**: DynamoDB Wardrobe table, S3 bucket (optional)

### Calendar Stories → Components
- EPIC-3, US-3.1, US-3.2, US-3.3, US-3.4, US-3.5
- **Frontend**: CalendarPage, CalendarGrid, OutfitLogModal, OutfitDetailModal, useCalendar
- **Backend**: OutfitHandler, OutfitService, OutfitRepository
- **Infrastructure**: DynamoDB Outfits table

### Events Stories → Components
- US-4.1, US-4.2, US-4.3, US-4.4
- **Frontend**: EventsPage, EventCard, AddEventModal, EditEventModal, useEvents
- **Backend**: EventsHandler, EventsService, EventsRepository
- **Infrastructure**: DynamoDB Events table

### Suggestions Stories → Components
- EPIC-4, US-5.1, US-5.2, US-5.3
- **Frontend**: SuggestionsPage, SuggestionCard, SuggestionFilters, useSuggestions
- **Backend**: SuggestionsHandler, SuggestionEngine, WeatherService
- **Infrastructure**: None (uses existing tables)
- **External**: OpenWeatherMap API

### Notifications Stories → Components
- US-6.1, US-6.2
- **Frontend**: SettingsPage, NotificationSettings, useSettings
- **Backend**: NotificationHandler, ReminderHandler, NotificationService
- **Infrastructure**: SNS topic, EventBridge rule

### Analytics Stories → Components
- US-7.1, US-7.2
- **Frontend**: DashboardPage, AnalyticsWidget, useAnalytics
- **Backend**: AnalyticsHandler, AnalyticsService
- **Infrastructure**: None (uses existing tables)

---

## Development Iteration Plan

### Iteration 1: Foundation (Must Have)
**Duration**: 1 week  
**Stories**: 8 stories (EPIC-1, US-1.1, US-1.2, EPIC-2, US-2.1, US-2.2, US-2.3, US-2.4)  
**Goal**: Users can sign up, log in, and manage wardrobe items

**Deliverables**:
- Working authentication
- Wardrobe CRUD operations
- Basic infrastructure deployed

### Iteration 2: Calendar (Must Have)
**Duration**: 1 week  
**Stories**: 5 stories (EPIC-3, US-3.1, US-3.2, US-3.3, US-7.2)  
**Goal**: Users can log outfits on calendar and track usage

**Deliverables**:
- Calendar view
- Outfit logging
- Usage tracking (lastWorn, timesWorn)

### Iteration 3: Events & Suggestions (Must Have)
**Duration**: 1 week  
**Stories**: 5 stories (US-4.1, US-4.2, EPIC-4, US-5.1, US-5.2)  
**Goal**: Users can create events and get outfit suggestions

**Deliverables**:
- Event management
- Suggestion engine
- Weather API integration

### Iteration 4: Notifications & Enhancements (Must Have + Should Have)
**Duration**: 1 week  
**Stories**: 7 stories (US-6.1, US-1.3, US-3.4, US-3.5, US-4.3, US-4.4, US-5.3, US-6.2)  
**Goal**: Complete core features with SMS reminders and enhanced UX

**Deliverables**:
- SMS reminders
- Onboarding flow
- Edit/delete operations
- Notification preferences

### Iteration 5: Analytics & Polish (Should Have + Could Have)
**Duration**: 1 week  
**Stories**: 2 stories (US-7.1, US-2.5)  
**Goal**: Analytics dashboard and optional image upload

**Deliverables**:
- Analytics dashboard
- Image upload (if time permits)
- UI/UX polish
- Bug fixes and testing

---

## Story Coverage Verification

✅ All 24 user stories assigned to unit  
✅ All Must Have stories (16) in Iterations 1-4  
✅ All Should Have stories (7) in Iterations 4-5  
✅ All Could Have stories (1) in Iteration 5  
✅ All components from application design covered  
✅ All functional requirements addressed  

---

## Success Metrics

### Iteration 1 Success
- Users can create accounts and log in
- Users can add and view wardrobe items
- Basic infrastructure operational

### Iteration 2 Success
- Users can log outfits on calendar
- Usage tracking updates automatically
- Calendar displays logged outfits

### Iteration 3 Success
- Users can create events
- Suggestion engine generates 2-3 outfit recommendations
- Weather data integrated

### Iteration 4 Success
- Users receive SMS reminders
- All CRUD operations complete
- Notification preferences configurable

### Iteration 5 Success
- Analytics dashboard displays usage statistics
- All MVP features complete and tested
- Application deployed to production

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for CONSTRUCTION Phase
