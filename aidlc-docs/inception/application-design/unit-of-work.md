# ClosetMind - Unit of Work Definition

## Overview
For the ClosetMind MVP, we're using a **single unit of work** approach to maximize development speed and minimize complexity. This is optimal for a prototype with cost constraints.

---

## Unit Definition

### Unit 1: ClosetMind Full-Stack Application

**Type**: Full-Stack Unit  
**Scope**: Complete application (Frontend + Backend + Infrastructure)  
**Development Approach**: Iterative - Build thin vertical slices across all layers

#### Responsibilities
- React frontend with all pages and components
- AWS Lambda backend with all services
- DynamoDB database schema and data access
- AWS infrastructure (Cognito, S3, SNS, EventBridge, API Gateway)
- Deployment configurations (Amplify + SAM)

#### Components Included
**Frontend** (40+ components):
- All pages: Login, Signup, Dashboard, Wardrobe, Calendar, Events, Suggestions, Settings
- All UI components: Modals, cards, forms, widgets
- All custom hooks: useAuth, useWardrobe, useCalendar, useEvents, useSuggestions, useAnalytics, useSettings
- Shared components: Layout, Navigation, LoadingSpinner, ErrorBoundary, Toast

**Backend** (25+ components):
- All Lambda handlers: Auth, Wardrobe, Outfit, Events, Suggestions, Notification, Reminder, Analytics
- All services: AuthService, WardrobeService, OutfitService, EventsService, SuggestionEngine, WeatherService, NotificationService, AnalyticsService
- All repositories: WardrobeRepository, OutfitRepository, EventsRepository
- Shared utilities: AuthMiddleware, ErrorHandler, ResponseFormatter, Validator

**Infrastructure** (8 components):
- Cognito User Pool
- DynamoDB tables (Users, Wardrobe, Outfits, Events)
- S3 bucket (optional images)
- SNS topic (SMS)
- EventBridge rule (reminders)
- API Gateway
- Lambda functions (8)
- Amplify Hosting

---

## Code Organization (Monorepo)

```
closetmind/
├── frontend/                    # React application
│   ├── src/
│   │   ├── features/           # Feature-based organization
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── pages/
│   │   │   ├── wardrobe/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── pages/
│   │   │   ├── calendar/
│   │   │   ├── events/
│   │   │   ├── suggestions/
│   │   │   ├── dashboard/
│   │   │   └── settings/
│   │   ├── shared/             # Shared components
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Lambda functions
│   ├── src/
│   │   ├── handlers/           # Lambda handlers
│   │   │   ├── auth.ts
│   │   │   ├── wardrobe.ts
│   │   │   ├── outfit.ts
│   │   │   ├── events.ts
│   │   │   ├── suggestions.ts
│   │   │   ├── notification.ts
│   │   │   ├── reminder.ts
│   │   │   └── analytics.ts
│   │   ├── services/           # Business logic
│   │   │   ├── auth/
│   │   │   ├── wardrobe/
│   │   │   ├── outfit/
│   │   │   ├── events/
│   │   │   ├── suggestions/
│   │   │   ├── notification/
│   │   │   └── analytics/
│   │   ├── repositories/       # Data access
│   │   │   ├── wardrobe.repository.ts
│   │   │   ├── outfit.repository.ts
│   │   │   └── events.repository.ts
│   │   ├── shared/             # Shared utilities
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   └── types/              # TypeScript types
│   └── package.json
│
├── infrastructure/              # AWS SAM/IaC
│   ├── template.yaml           # SAM template
│   ├── samconfig.toml          # SAM configuration
│   └── README.md
│
├── docs/                        # Additional documentation
├── .gitignore
├── README.md
└── package.json                # Root package.json (optional)
```

---

## Development Strategy

### Iterative Approach
Build thin vertical slices that deliver end-to-end functionality:

**Iteration 1: Core Authentication & Wardrobe**
- User signup/login (frontend + backend + Cognito)
- Add wardrobe items (frontend + backend + DynamoDB)
- View wardrobe items (frontend + backend)
- Basic infrastructure setup

**Iteration 2: Calendar & Outfit Logging**
- Calendar view (frontend)
- Log outfits (frontend + backend + DynamoDB)
- Usage tracking (backend logic)

**Iteration 3: Events & Suggestions**
- Create events (frontend + backend + DynamoDB)
- Get outfit suggestions (frontend + backend + Weather API)
- Suggestion engine logic

**Iteration 4: Notifications & Analytics**
- SMS reminders (backend + SNS + EventBridge)
- Notification preferences (frontend + backend)
- Analytics dashboard (frontend + backend)

**Iteration 5: Polish & Optimization**
- Error handling improvements
- UI/UX refinements
- Performance optimization
- Testing

---

## Dependencies

### External Dependencies
- **OpenWeatherMap API**: Weather data for suggestions
- **AWS Services**: Cognito, DynamoDB, S3, SNS, EventBridge, API Gateway, Lambda, Amplify

### Internal Dependencies
- Frontend depends on Backend API
- Backend depends on DynamoDB
- Suggestion engine depends on Weather API
- Reminder handler depends on EventBridge schedule

### Development Dependencies
- No blocking dependencies - single unit can be developed iteratively
- Frontend can use mock data initially
- Backend can be tested with local DynamoDB

---

## Team Structure

### Single Team Approach
For MVP, a single developer or small team can handle the entire unit:
- Full-stack development capability
- AWS infrastructure knowledge
- React and Node.js/TypeScript expertise

### Skill Requirements
- Frontend: React, TypeScript, Tailwind CSS, React Query
- Backend: Node.js/TypeScript, AWS Lambda, DynamoDB
- Infrastructure: AWS SAM, Cognito, API Gateway, SNS, EventBridge
- DevOps: Git, AWS CLI, deployment automation

---

## Testing Strategy

### Unit Testing
- Frontend: Jest + React Testing Library
- Backend: Jest for services and repositories
- Test coverage: Focus on business logic (services, suggestion engine)

### Integration Testing
- API endpoint testing with test DynamoDB
- Frontend integration tests with Cypress
- End-to-end critical paths

### Manual Testing
- User acceptance testing for all features
- Mobile responsiveness testing
- Cross-browser testing

---

## Deployment Strategy

### Single Deployment
- Deploy all components together as one release
- Frontend: Amplify Hosting (automatic from Git)
- Backend: SAM deploy (all Lambdas + infrastructure)
- Database: DynamoDB tables created by SAM

### Deployment Steps
1. Deploy infrastructure (SAM template)
2. Deploy backend (Lambda functions)
3. Deploy frontend (Amplify build)
4. Verify integration
5. Test end-to-end

### Environment Strategy
- **Development**: Local development with SAM Local + mock data
- **Production**: AWS account with all services

---

## Success Criteria

### Unit Complete When:
- ✅ All Must-Have user stories implemented
- ✅ All API endpoints functional
- ✅ Frontend pages complete and responsive
- ✅ Authentication working with Cognito
- ✅ Data persisting to DynamoDB
- ✅ Outfit suggestions generating correctly
- ✅ SMS reminders sending successfully
- ✅ Analytics displaying usage data
- ✅ Unit tests passing
- ✅ Integration tests passing
- ✅ Deployed to AWS and accessible

---

## Risk Mitigation

### Single Unit Risks
- **Risk**: All features in one unit - if blocked, everything blocked
- **Mitigation**: Iterative approach allows partial delivery

- **Risk**: Large codebase harder to manage
- **Mitigation**: Clear folder structure, modular design

- **Risk**: Deployment failures affect entire app
- **Mitigation**: Thorough testing, rollback plan

### Cost Control
- Stay within AWS free tier limits
- Monitor usage with CloudWatch
- Optimize DynamoDB queries
- Use on-demand pricing

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for CONSTRUCTION Phase
