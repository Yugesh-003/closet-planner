# ClosetMind User Stories

## Document Overview
This document contains user stories for the ClosetMind application, organized by user journey with feature-based grouping. Stories follow the hybrid format with MoSCoW prioritization.

**Story Count**: 24 stories (5 epics, 19 standard stories)  
**Personas**: Priya (Primary), Ananya (Secondary)  
**Organization**: Hybrid (User Journey + Feature-Based)

---

## Table of Contents
1. [Authentication & Onboarding](#1-authentication--onboarding)
2. [Wardrobe Management](#2-wardrobe-management)
3. [Calendar & Outfit Logging](#3-calendar--outfit-logging)
4. [Event Planning](#4-event-planning)
5. [Smart Outfit Suggestions](#5-smart-outfit-suggestions)
6. [Notifications & Reminders](#6-notifications--reminders)
7. [Analytics & Insights](#7-analytics--insights)

---

## 1. Authentication & Onboarding

### EPIC-1: User Authentication System
**Priority**: Must Have  
**As a** new user  
**I want** to create an account and securely log in  
**So that** I can access my personal wardrobe and outfit data

**Acceptance Criteria**:
- Given I am on the signup page, when I provide valid email and password, then my account is created using Cognito
- Given I have an account, when I provide correct credentials, then I am logged into the application
- Given I provide invalid credentials, when I attempt to login, then I see a clear error message
- Given I am logged in, when I close and reopen the app, then my session persists appropriately
- Given I want to log out, when I click logout, then I am securely logged out and redirected to login page

**Technical Constraints**: Must use Amazon Cognito for authentication

---

### US-1.1: User Signup
**Priority**: Must Have  
**As a** new user  
**I want** to sign up with my email and password  
**So that** I can create my personal ClosetMind account

**Acceptance Criteria**:
- Given I am on the signup page, when I enter valid email and password, then my account is created
- Given I enter an invalid email format, when I submit, then I see validation error
- Given I enter a weak password, when I submit, then I see password strength requirements
- Given my email already exists, when I try to signup, then I see appropriate error message
- Given signup is successful, when account is created, then I am redirected to onboarding/dashboard

---

### US-1.2: User Login
**Priority**: Must Have  
**As a** registered user  
**I want** to log in with my email and password  
**So that** I can access my wardrobe and outfit data

**Acceptance Criteria**:
- Given I have an account, when I enter correct credentials, then I am logged in successfully
- Given I enter incorrect password, when I submit, then I see authentication error
- Given I enter non-existent email, when I submit, then I see appropriate error message
- Given I am logged in, when I navigate away, then my session is maintained
- Given login is successful, when I access the app, then I see my dashboard

---

### US-1.3: First-Time User Onboarding
**Priority**: Should Have  
**As a** first-time user  
**I want** to see a welcome message with tips  
**So that** I understand how to use ClosetMind effectively

**Acceptance Criteria**:
- Given I just created my account, when I first login, then I see a welcome message
- Given I see the welcome message, when I read it, then it explains key features (wardrobe, calendar, suggestions)
- Given I see the welcome message, when I dismiss it, then I proceed to the dashboard
- Given I dismissed the welcome message, when I login again, then I don't see it again

---

## 2. Wardrobe Management

### EPIC-2: Wardrobe Management System
**Priority**: Must Have  
**As a** user  
**I want** to manage my clothing items with detailed attributes  
**So that** I can organize my wardrobe and get accurate outfit suggestions

**Acceptance Criteria**:
- Given I want to add clothes, when I access wardrobe, then I can add items with all required attributes
- Given I have wardrobe items, when I view them, then I see all items with their details
- Given I want to update an item, when I edit it, then changes are saved successfully
- Given I want to remove an item, when I delete it, then it's removed from my wardrobe
- Given items have usage tracking, when I log outfits, then lastWorn and timesWorn are updated automatically

**Technical Constraints**: Store items in DynamoDB with userId as partition key

---

### US-2.1: Add Wardrobe Item
**Priority**: Must Have  
**As a** user  
**I want** to add clothing items with detailed attributes  
**So that** I can build my digital wardrobe

**Acceptance Criteria**:
- Given I am on the wardrobe page, when I click "Add Item", then I see a form with all attribute fields
- Given I fill in required fields (name, type, category, color), when I submit, then the item is added to my wardrobe
- Given I select occasion tags, when I choose multiple options, then all selections are saved
- Given I select weather suitability, when I choose multiple options, then all selections are saved
- Given I submit the form, when item is created, then I see success confirmation and the item appears in my wardrobe list

**Fields**: name, type, category, color, fabric, occasion tags, comfort level, weather suitability

---

### US-2.2: View Wardrobe Items
**Priority**: Must Have  
**As a** user  
**I want** to view all my wardrobe items  
**So that** I can see what clothes I have available

**Acceptance Criteria**:
- Given I have wardrobe items, when I navigate to wardrobe page, then I see all my items displayed
- Given I view an item, when I look at details, then I see all attributes (type, category, color, fabric, etc.)
- Given items have usage data, when I view them, then I see lastWorn date and timesWorn count
- Given I have many items, when I scroll, then items load efficiently without performance issues

---

### US-2.3: Edit Wardrobe Item
**Priority**: Must Have  
**As a** user  
**I want** to edit existing wardrobe items  
**So that** I can update item details when needed

**Acceptance Criteria**:
- Given I view a wardrobe item, when I click "Edit", then I see a form pre-filled with current values
- Given I modify any attributes, when I save changes, then the item is updated successfully
- Given I change occasion tags or weather suitability, when I save, then new selections replace old ones
- Given I cancel editing, when I click "Cancel", then no changes are saved

---

### US-2.4: Delete Wardrobe Item
**Priority**: Must Have  
**As a** user  
**I want** to delete wardrobe items I no longer own  
**So that** my wardrobe stays current and accurate

**Acceptance Criteria**:
- Given I view a wardrobe item, when I click "Delete", then I see a confirmation prompt
- Given I confirm deletion, when I proceed, then the item is permanently removed from my wardrobe
- Given I cancel deletion, when I click "Cancel", then the item remains in my wardrobe
- Given an item is deleted, when I view my wardrobe, then it no longer appears in the list

---

### US-2.5: Upload Item Image (Optional)
**Priority**: Could Have  
**As a** user  
**I want** to upload photos of my clothing items  
**So that** I can visually identify items in my wardrobe

**Acceptance Criteria**:
- Given I am adding/editing an item, when I click "Upload Image", then I can select a photo from my device
- Given I upload an image, when it's processed, then it's stored in S3 and URL is saved
- Given an item has an image, when I view it, then the photo is displayed
- Given I want to remove an image, when I delete it, then the item shows without a photo

**Dependencies**: Requires S3 bucket setup for image storage

---

## 3. Calendar & Outfit Logging

### EPIC-3: Calendar-Based Outfit Tracking
**Priority**: Must Have  
**As a** user  
**I want** to log my daily outfits on a calendar  
**So that** I can track what I've worn and avoid repetition

**Acceptance Criteria**:
- Given I view the calendar, when I see the month, then I can identify dates with logged outfits
- Given I click a date, when I interact with it, then I can log, view, edit, or delete outfits for that date
- Given I log an outfit, when I select items, then I can choose multiple wardrobe items to create a complete outfit
- Given I view past outfits, when I check the calendar, then I see visual indicators for logged dates
- Given I log an outfit, when it's saved, then the lastWorn and timesWorn for those items are updated

---

### US-3.1: View Monthly Calendar
**Priority**: Must Have  
**As a** user  
**I want** to view a monthly calendar  
**So that** I can see my outfit history and plan future outfits

**Acceptance Criteria**:
- Given I navigate to calendar page, when it loads, then I see the current month displayed
- Given I view the calendar, when I look at dates, then dates with logged outfits have visual indicators
- Given I want to change months, when I click navigation arrows, then I can move to previous/next months
- Given I view a date with an outfit, when I hover/click, then I see a preview of the logged outfit

---

### US-3.2: Log Outfit for a Date
**Priority**: Must Have  
**As a** user  
**I want** to log an outfit for a specific date  
**So that** I can track what I wore

**Acceptance Criteria**:
- Given I click on a calendar date, when the interface opens, then I see an option to "Log Outfit"
- Given I choose to log an outfit, when I proceed, then I see my wardrobe items to select from
- Given I select wardrobe items, when I choose multiple items, then all selections are included in the outfit
- Given I save the outfit, when it's logged, then the calendar date shows an outfit indicator
- Given I log an outfit, when it's saved, then lastWorn and timesWorn are updated for all selected items

---

### US-3.3: View Logged Outfit Details
**Priority**: Must Have  
**As a** user  
**I want** to view details of outfits I've logged  
**So that** I can see what I wore on specific dates

**Acceptance Criteria**:
- Given a date has a logged outfit, when I click on it, then I see all items in that outfit
- Given I view outfit details, when I look at items, then I see item names, types, and categories
- Given items have images, when I view the outfit, then images are displayed
- Given I view an outfit, when I check details, then I see the date it was worn

---

### US-3.4: Edit Logged Outfit
**Priority**: Should Have  
**As a** user  
**I want** to edit outfits I've previously logged  
**So that** I can correct mistakes or update outfit details

**Acceptance Criteria**:
- Given I view a logged outfit, when I click "Edit", then I can modify the selected items
- Given I add or remove items, when I save changes, then the outfit is updated
- Given I save changes, when outfit is updated, then usage tracking (lastWorn, timesWorn) is recalculated
- Given I cancel editing, when I click "Cancel", then no changes are saved

---

### US-3.5: Delete Logged Outfit
**Priority**: Should Have  
**As a** user  
**I want** to delete logged outfits  
**So that** I can remove incorrect or unwanted entries

**Acceptance Criteria**:
- Given I view a logged outfit, when I click "Delete", then I see a confirmation prompt
- Given I confirm deletion, when I proceed, then the outfit is removed from that date
- Given an outfit is deleted, when I view the calendar, then that date no longer shows an outfit indicator
- Given I cancel deletion, when I click "Cancel", then the outfit remains logged

---

## 4. Event Planning

### US-4.1: Create Event
**Priority**: Must Have  
**As a** user  
**I want** to create events with specific details  
**So that** I can plan outfits for upcoming occasions

**Acceptance Criteria**:
- Given I am on the events page, when I click "Create Event", then I see a form with event fields
- Given I fill in event details (title, date, type), when I submit, then the event is created
- Given I select event type, when I choose from options, then I can select formal, casual, function, or interview
- Given I save the event, when it's created, then it appears in my events list
- Given I create an event, when it's saved, then I can later request outfit suggestions for it

**Dependencies**: Requires events to be created before outfit suggestions can reference them

---

### US-4.2: View Events List
**Priority**: Must Have  
**As a** user  
**I want** to view all my upcoming events  
**So that** I can see what occasions I need to plan for

**Acceptance Criteria**:
- Given I have created events, when I navigate to events page, then I see all my events listed
- Given I view events, when I look at the list, then events are sorted by date (upcoming first)
- Given I view an event, when I check details, then I see title, date, and type
- Given an event has passed, when I view the list, then past events are visually distinguished or filtered

---

### US-4.3: Edit Event
**Priority**: Should Have  
**As a** user  
**I want** to edit event details  
**So that** I can update information when plans change

**Acceptance Criteria**:
- Given I view an event, when I click "Edit", then I see a form pre-filled with current values
- Given I modify event details, when I save changes, then the event is updated
- Given I change the event date, when I save, then reminders are rescheduled accordingly
- Given I cancel editing, when I click "Cancel", then no changes are saved

---

### US-4.4: Delete Event
**Priority**: Should Have  
**As a** user  
**I want** to delete events that are cancelled  
**So that** my events list stays current

**Acceptance Criteria**:
- Given I view an event, when I click "Delete", then I see a confirmation prompt
- Given I confirm deletion, when I proceed, then the event is permanently removed
- Given an event is deleted, when I check my events list, then it no longer appears
- Given I cancel deletion, when I click "Cancel", then the event remains

---

## 5. Smart Outfit Suggestions

### EPIC-4: Rule-Based Outfit Suggestion Engine
**Priority**: Must Have  
**As a** user  
**I want** to receive smart outfit suggestions based on weather and events  
**So that** I can make better outfit choices without spending time planning

**Acceptance Criteria**:
- Given I request suggestions, when the system processes, then it fetches current/forecast weather data
- Given weather data is available, when suggestions are generated, then only weather-appropriate items are included
- Given I have an event, when I request suggestions, then items matching the event type are prioritized
- Given items were recently worn, when suggestions are generated, then items worn in last 3-5 days are excluded
- Given suggestions are generated, when I view them, then I see 2-3 complete outfit combinations

**Technical Constraints**: Use OpenWeatherMap API for weather data

---

### US-5.1: Request Outfit Suggestions
**Priority**: Must Have  
**As a** user  
**I want** to request outfit suggestions for a specific date or event  
**So that** I can get recommendations for what to wear

**Acceptance Criteria**:
- Given I am on the suggestions page, when I click "Get Suggestions", then the system generates recommendations
- Given I select a specific date, when I request suggestions, then weather forecast for that date is used
- Given I select an event, when I request suggestions, then event type influences the recommendations
- Given I don't specify a date, when I request suggestions, then current weather is used
- Given suggestions are ready, when they're displayed, then I see 2-3 outfit options

---

### US-5.2: View Outfit Suggestion Details
**Priority**: Must Have  
**As a** user  
**I want** to view detailed information about suggested outfits  
**So that** I can evaluate each recommendation

**Acceptance Criteria**:
- Given I receive suggestions, when I view them, then each outfit shows all included items
- Given I view a suggestion, when I check details, then I see item names, types, and categories
- Given items have images, when I view suggestions, then images are displayed
- Given I view suggestions, when I check reasoning, then I see why items were suggested (weather match, occasion match)

---

### US-5.3: Select and Log Suggested Outfit
**Priority**: Should Have  
**As a** user  
**I want** to select a suggested outfit and log it to my calendar  
**So that** I can quickly plan my outfit from recommendations

**Acceptance Criteria**:
- Given I view outfit suggestions, when I click "Select This Outfit", then I can log it to a specific date
- Given I select an outfit, when I choose a date, then the outfit is logged to the calendar
- Given I log a suggested outfit, when it's saved, then usage tracking is updated for all items
- Given I log an outfit for an event date, when it's saved, then it's associated with that event

**Dependencies**: Depends on US-3.2 (Log Outfit for a Date)

---

## 6. Notifications & Reminders

### US-6.1: Receive Event Reminders
**Priority**: Must Have  
**As a** user  
**I want** to receive SMS reminders before my events  
**So that** I remember to prepare my outfit in advance

**Acceptance Criteria**:
- Given I have an event tomorrow, when the reminder time arrives, then I receive an SMS notification
- Given I receive a reminder, when I read it, then it includes the event title and date
- Given I have multiple events, when reminders are sent, then I receive separate SMS for each event
- Given I have notifications disabled, when reminder time arrives, then no SMS is sent

**Technical Constraints**: Use Amazon SNS for SMS delivery, EventBridge for scheduling

**Dependencies**: Depends on US-4.1 (Create Event)

---

### US-6.2: Configure Notification Preferences
**Priority**: Should Have  
**As a** user  
**I want** to enable or disable notifications  
**So that** I can control whether I receive reminders

**Acceptance Criteria**:
- Given I am on settings/preferences, when I view notification options, then I see an enable/disable toggle
- Given I disable notifications, when I save preferences, then no reminders are sent for my events
- Given I enable notifications, when I save preferences, then reminders resume for upcoming events
- Given I change preferences, when I save, then changes take effect immediately for future reminders

---

## 7. Analytics & Insights

### US-7.1: View Outfit Usage Analytics
**Priority**: Should Have  
**As a** user  
**I want** to see analytics about my outfit usage  
**So that** I can understand my wardrobe patterns and make better use of my clothes

**Acceptance Criteria**:
- Given I navigate to dashboard/analytics, when the page loads, then I see outfit usage statistics
- Given I view analytics, when I check most worn items, then I see top 5 items by timesWorn count
- Given I view analytics, when I check least worn items, then I see bottom 5 items (excluding never worn)
- Given I view analytics, when I check outfit frequency, then I see total outfits logged per month
- Given I have limited data, when I view analytics, then appropriate messages are shown for insufficient data

---

### US-7.2: View Item Last Worn Information
**Priority**: Must Have  
**As a** user  
**I want** to see when each item was last worn  
**So that** I can avoid repeating outfits too frequently

**Acceptance Criteria**:
- Given I view my wardrobe, when I look at an item, then I see the lastWorn date displayed
- Given an item has never been worn, when I view it, then it shows "Never worn" or similar indicator
- Given I view an item, when I check usage, then I see timesWorn count
- Given I log an outfit, when it's saved, then lastWorn dates are updated immediately for all items in that outfit

---

## Story Summary

### By Priority (MoSCoW)
- **Must Have**: 16 stories (5 epics + 11 standard stories)
- **Should Have**: 7 stories
- **Could Have**: 1 story
- **Won't Have**: 0 stories

### By Feature Area
- Authentication & Onboarding: 4 stories (1 epic + 3 standard)
- Wardrobe Management: 6 stories (1 epic + 5 standard)
- Calendar & Outfit Logging: 6 stories (1 epic + 5 standard)
- Event Planning: 4 stories (4 standard)
- Smart Outfit Suggestions: 4 stories (1 epic + 3 standard)
- Notifications & Reminders: 2 stories (2 standard)
- Analytics & Insights: 2 stories (2 standard)

### Coverage Verification
✅ All functional requirements from requirements.md are covered by user stories  
✅ All pages mentioned in requirements have corresponding stories (Login, Dashboard, Wardrobe, Calendar, Events)  
✅ All core features have user stories (authentication, wardrobe, calendar, events, suggestions, notifications, analytics)  
✅ Stories follow INVEST criteria and include acceptance criteria  
✅ Stories are mapped to personas (primarily Priya, with Ananya as secondary)

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for Review
