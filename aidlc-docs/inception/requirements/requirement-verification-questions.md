# Requirements Verification Questions

Please answer the following questions to clarify and validate the requirements for ClosetMind. Fill in your answer after each [Answer]: tag using the letter choice provided.

---

## Question 1: Target User Base
Who is the primary target user for this MVP?

A) Individual women managing personal wardrobes
B) Fashion stylists managing client wardrobes
C) Retail stores managing inventory
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Individual women managing personal wardrobes

---

## Question 2: Authentication Scope
For the MVP, what level of authentication is required?

A) Basic email/password with Cognito (no social login)
B) Email/password + social login (Google, Facebook)
C) Email/password + MFA (multi-factor authentication)
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Basic email/password with Cognito (no social login)

---

## Question 3: Image Upload Priority
How critical is the image upload feature for wardrobe items in the MVP?

A) Must-have - users need to see photos of their clothes
B) Nice-to-have - can launch without it and add later
C) Skip for MVP - focus on text-based attributes only
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Nice-to-have - can launch without it and add later


---

## Question 4: Weather API Selection
Do you have a preferred weather API provider, or should I recommend one?

A) Use OpenWeatherMap (free tier available)
B) Use WeatherAPI.com (free tier available)
C) Use AWS-native solution if available
D) Recommend the best free option
E) Other (please describe after [Answer]: tag below)

[Answer]: D) Recommend the best free option


---

## Question 5: SMS Notification Scope
What is the scope of SMS notifications for the MVP?

A) Event reminders only (1 day before events)
B) Event reminders + optional daily outfit planning reminders
C) Event reminders + daily reminders + outfit suggestion notifications
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Event reminders only (1 day before events)


---

## Question 6: User Preferences
Should users be able to configure notification preferences (enable/disable, timing)?

A) Yes - users should control all notification settings
B) Partial - users can enable/disable but not change timing
C) No - use default settings for MVP
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Partial - users can enable/disable but not change timing


---

## Question 7: Outfit Combination Logic
For outfit suggestions, what combinations should the system generate?

A) Top + Bottom only
B) Top + Bottom + Accessories (if available)
C) Support for complete outfits (dresses, sarees) as single items
D) All of the above - flexible combinations based on item types
E) Other (please describe after [Answer]: tag below)

[Answer]: D) All of the above - flexible combinations based on item types


---

## Question 8: Calendar View
What calendar functionality is needed for the MVP?

A) Monthly view only - click date to log outfit
B) Monthly + daily view with outfit details
C) Monthly + weekly + daily views
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Monthly view only - click date to log outfit


---

## Question 9: Outfit History and Analytics
Should the app provide any analytics or insights about outfit usage?

A) Yes - show most worn items, least worn items, outfit frequency
B) Basic - just show last worn date for each item
C) No - keep it simple for MVP
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Yes - show most worn items, least worn items, outfit frequency


---

## Question 10: Mobile Responsiveness Priority
What is the priority for mobile experience?

A) Mobile-first - optimize primarily for mobile devices
B) Responsive - work well on both mobile and desktop
C) Desktop-first - mobile is secondary
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Responsive - work well on both mobile and desktop


---

## Question 11: Deployment Preference
What is your preferred deployment approach for the frontend?

A) Vercel (as mentioned in requirements)
B) AWS S3 + CloudFront
C) AWS Amplify Hosting
D) Other (please describe after [Answer]: tag below)

[Answer]: C) AWS Amplify Hosting


---

## Question 12: Backend Deployment Tool
What tool should be used for backend infrastructure deployment?

A) AWS SAM (Serverless Application Model)
B) Serverless Framework
C) AWS CDK (Cloud Development Kit)
D) Terraform
E) Other (please describe after [Answer]: tag below)

[Answer]: A) AWS SAM (Serverless Application Model)


---

## Question 13: Error Handling and Validation
What level of error handling is expected for the MVP?

A) Comprehensive - detailed error messages, input validation, retry logic
B) Standard - basic error messages and validation
C) Minimal - simple error handling for MVP
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Comprehensive - detailed error messages, input validation, retry logic


---

## Question 14: Data Privacy and Security
Are there specific data privacy or security requirements beyond basic authentication?

A) Yes - need data encryption at rest and in transit
B) Standard AWS security best practices
C) Basic security for MVP
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Standard AWS security best practices


---

## Question 15: Testing Requirements
What level of testing is expected for the MVP?

A) Unit tests + integration tests + E2E tests
B) Unit tests + integration tests
C) Basic unit tests only
D) Manual testing only for MVP
E) Other (please describe after [Answer]: tag below)

[Answer]: B) Unit tests + integration tests

---

## Question 16: Budget Constraints
What are the AWS cost constraints for this project?

A) Stay within AWS free tier as much as possible
B) Minimal cost acceptable (< $10/month)
C) Moderate budget for production-ready app
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Stay within AWS free tier as much as possible

---

## Question 17: User Onboarding
Should there be any user onboarding or tutorial for first-time users?

A) Yes - guided tour of features
B) Simple welcome message with tips
C) No onboarding - keep it intuitive
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Simple welcome message with tips


---

## Question 18: Accessibility Requirements
What accessibility standards should be followed?

A) WCAG 2.1 AA compliance
B) Basic accessibility (keyboard navigation, alt text)
C) Standard web accessibility practices
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Basic accessibility (keyboard navigation, alt text)


---

## Question: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
C) Other (please describe after [Answer]: tag below)

[Answer]: B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)


---

## Question: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)
B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)
C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)


---

**Instructions**: Please fill in your answer choice (letter) after each [Answer]: tag. Once complete, let me know and I'll analyze your responses.
