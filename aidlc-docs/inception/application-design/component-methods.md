# ClosetMind - Component Methods

## Overview
This document defines method signatures for all components. Detailed business rules and implementation logic will be defined in Functional Design (CONSTRUCTION phase).

---

## Frontend Component Methods

### Authentication Feature

#### useAuth Hook
```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

function useAuth(): UseAuthReturn
```

#### LoginPage
```typescript
interface LoginPageProps {}

function LoginPage(props: LoginPageProps): JSX.Element

// Internal methods:
- handleSubmit(email: string, password: string): Promise<void>
- validateForm(email: string, password: string): ValidationErrors
```

#### SignupPage
```typescript
interface SignupPageProps {}

function SignupPage(props: SignupPageProps): JSX.Element

// Internal methods:
- handleSubmit(email: string, password: string, name: string): Promise<void>
- validateForm(email: string, password: string, name: string): ValidationErrors
- checkPasswordStrength(password: string): PasswordStrength
```

#### OnboardingModal
```typescript
interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function OnboardingModal(props: OnboardingModalProps): JSX.Element
```

---

### Wardrobe Feature

#### useWardrobe Hook
```typescript
interface UseWardrobeReturn {
  items: WardrobeItem[];
  isLoading: boolean;
  error: Error | null;
  addItem: (item: CreateWardrobeItemInput) => Promise<void>;
  updateItem: (itemId: string, updates: UpdateWardrobeItemInput) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

function useWardrobe(): UseWardrobeReturn
```

#### WardrobePage
```typescript
interface WardrobePageProps {}

function WardrobePage(props: WardrobePageProps): JSX.Element

// Internal methods:
- handleAddItem(): void
- handleEditItem(itemId: string): void
- handleDeleteItem(itemId: string): void
- filterItems(searchTerm: string): WardrobeItem[]
```

#### WardrobeItemCard
```typescript
interface WardrobeItemCardProps {
  item: WardrobeItem;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

function WardrobeItemCard(props: WardrobeItemCardProps): JSX.Element
```

#### AddItemModal
```typescript
interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: CreateWardrobeItemInput) => Promise<void>;
}

function AddItemModal(props: AddItemModalProps): JSX.Element

// Internal methods:
- handleSubmit(formData: WardrobeItemFormData): Promise<void>
- validateForm(formData: WardrobeItemFormData): ValidationErrors
- handleImageUpload(file: File): Promise<string>
```

#### EditItemModal
```typescript
interface EditItemModalProps {
  isOpen: boolean;
  item: WardrobeItem;
  onClose: () => void;
  onSubmit: (itemId: string, updates: UpdateWardrobeItemInput) => Promise<void>;
}

function EditItemModal(props: EditItemModalProps): JSX.Element

// Internal methods:
- handleSubmit(formData: WardrobeItemFormData): Promise<void>
- validateForm(formData: WardrobeItemFormData): ValidationErrors
- handleImageUpload(file: File): Promise<string>
- handleImageRemove(): Promise<void>
```

---

### Calendar Feature

#### useCalendar Hook
```typescript
interface UseCalendarReturn {
  outfits: Record<string, Outfit>; // date -> outfit mapping
  isLoading: boolean;
  error: Error | null;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  logOutfit: (date: string, itemIds: string[]) => Promise<void>;
  updateOutfit: (date: string, itemIds: string[]) => Promise<void>;
  deleteOutfit: (date: string) => Promise<void>;
  getOutfitForDate: (date: string) => Outfit | null;
}

function useCalendar(): UseCalendarReturn
```

#### CalendarPage
```typescript
interface CalendarPageProps {}

function CalendarPage(props: CalendarPageProps): JSX.Element

// Internal methods:
- handleDateClick(date: string): void
- handleMonthChange(direction: 'prev' | 'next'): void
- handleLogOutfit(date: string): void
- handleViewOutfit(date: string): void
```

#### CalendarGrid
```typescript
interface CalendarGridProps {
  month: Date;
  outfits: Record<string, Outfit>;
  onDateClick: (date: string) => void;
}

function CalendarGrid(props: CalendarGridProps): JSX.Element

// Internal methods:
- generateCalendarDays(month: Date): CalendarDay[]
- hasOutfit(date: string): boolean
- isToday(date: string): boolean
```

#### OutfitLogModal
```typescript
interface OutfitLogModalProps {
  isOpen: boolean;
  date: string;
  wardrobeItems: WardrobeItem[];
  onClose: () => void;
  onSubmit: (date: string, itemIds: string[]) => Promise<void>;
}

function OutfitLogModal(props: OutfitLogModalProps): JSX.Element

// Internal methods:
- handleItemSelection(itemId: string): void
- handleSubmit(): Promise<void>
- validateSelection(itemIds: string[]): ValidationErrors
```

#### OutfitDetailModal
```typescript
interface OutfitDetailModalProps {
  isOpen: boolean;
  outfit: Outfit;
  date: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

function OutfitDetailModal(props: OutfitDetailModalProps): JSX.Element
```

---

### Events Feature

#### useEvents Hook
```typescript
interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  addEvent: (event: CreateEventInput) => Promise<void>;
  updateEvent: (eventId: string, updates: UpdateEventInput) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getUpcomingEvents: (limit?: number) => Event[];
}

function useEvents(): UseEventsReturn
```

#### EventsPage
```typescript
interface EventsPageProps {}

function EventsPage(props: EventsPageProps): JSX.Element

// Internal methods:
- handleAddEvent(): void
- handleEditEvent(eventId: string): void
- handleDeleteEvent(eventId: string): void
- sortEventsByDate(events: Event[]): Event[]
```

#### EventCard
```typescript
interface EventCardProps {
  event: Event;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onGetSuggestions: (eventId: string) => void;
}

function EventCard(props: EventCardProps): JSX.Element

// Internal methods:
- calculateDaysUntil(eventDate: string): number
- formatEventDate(date: string): string
```

#### AddEventModal
```typescript
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: CreateEventInput) => Promise<void>;
}

function AddEventModal(props: AddEventModalProps): JSX.Element

// Internal methods:
- handleSubmit(formData: EventFormData): Promise<void>
- validateForm(formData: EventFormData): ValidationErrors
```

#### EditEventModal
```typescript
interface EditEventModalProps {
  isOpen: boolean;
  event: Event;
  onClose: () => void;
  onSubmit: (eventId: string, updates: UpdateEventInput) => Promise<void>;
}

function EditEventModal(props: EditEventModalProps): JSX.Element

// Internal methods:
- handleSubmit(formData: EventFormData): Promise<void>
- validateForm(formData: EventFormData): ValidationErrors
```

---

### Suggestions Feature

#### useSuggestions Hook
```typescript
interface UseSuggestionsReturn {
  suggestions: OutfitSuggestion[];
  isLoading: boolean;
  error: Error | null;
  getSuggestions: (params: SuggestionParams) => Promise<void>;
  clearSuggestions: () => void;
}

interface SuggestionParams {
  date?: string;
  eventId?: string;
}

function useSuggestions(): UseSuggestionsReturn
```

#### SuggestionsPage
```typescript
interface SuggestionsPageProps {}

function SuggestionsPage(props: SuggestionsPageProps): JSX.Element

// Internal methods:
- handleRequestSuggestions(params: SuggestionParams): Promise<void>
- handleSelectSuggestion(suggestion: OutfitSuggestion): void
```

#### SuggestionCard
```typescript
interface SuggestionCardProps {
  suggestion: OutfitSuggestion;
  onSelect: (suggestion: OutfitSuggestion) => void;
}

function SuggestionCard(props: SuggestionCardProps): JSX.Element

// Internal methods:
- formatReasoning(reasoning: string[]): string
```

#### SuggestionFilters
```typescript
interface SuggestionFiltersProps {
  events: Event[];
  onSubmit: (params: SuggestionParams) => void;
}

function SuggestionFilters(props: SuggestionFiltersProps): JSX.Element

// Internal methods:
- handleDateChange(date: string): void
- handleEventChange(eventId: string): void
- handleSubmit(): void
```

---

### Dashboard Feature

#### useAnalytics Hook
```typescript
interface UseAnalyticsReturn {
  analytics: AnalyticsData;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface AnalyticsData {
  mostWornItems: WardrobeItem[];
  leastWornItems: WardrobeItem[];
  outfitFrequency: Record<string, number>; // month -> count
}

function useAnalytics(): UseAnalyticsReturn
```

#### DashboardPage
```typescript
interface DashboardPageProps {}

function DashboardPage(props: DashboardPageProps): JSX.Element
```

#### AnalyticsWidget
```typescript
interface AnalyticsWidgetProps {
  analytics: AnalyticsData;
}

function AnalyticsWidget(props: AnalyticsWidgetProps): JSX.Element

// Internal methods:
- renderMostWornItems(items: WardrobeItem[]): JSX.Element
- renderLeastWornItems(items: WardrobeItem[]): JSX.Element
- renderOutfitFrequency(frequency: Record<string, number>): JSX.Element
```

#### UpcomingEventsWidget
```typescript
interface UpcomingEventsWidgetProps {
  events: Event[];
}

function UpcomingEventsWidget(props: UpcomingEventsWidgetProps): JSX.Element
```

---

### Settings Feature

#### useSettings Hook
```typescript
interface UseSettingsReturn {
  preferences: UserPreferences;
  isLoading: boolean;
  error: Error | null;
  updateNotificationPreference: (enabled: boolean) => Promise<void>;
}

interface UserPreferences {
  notificationsEnabled: boolean;
}

function useSettings(): UseSettingsReturn
```

#### SettingsPage
```typescript
interface SettingsPageProps {}

function SettingsPage(props: SettingsPageProps): JSX.Element

// Internal methods:
- handleLogout(): Promise<void>
```

#### NotificationSettings
```typescript
interface NotificationSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
}

function NotificationSettings(props: NotificationSettingsProps): JSX.Element
```

---

### Shared Frontend Components

#### Layout
```typescript
interface LayoutProps {
  children: React.ReactNode;
}

function Layout(props: LayoutProps): JSX.Element
```

#### Navigation
```typescript
interface NavigationProps {
  currentPath: string;
}

function Navigation(props: NavigationProps): JSX.Element

// Internal methods:
- isActiveRoute(path: string): boolean
- handleLogout(): Promise<void>
```

---

## Backend Component Methods

### Authentication Service

#### AuthHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- POST /auth/signup -> handleSignup(event)
- POST /auth/login -> handleLogin(event)

async function handleSignup(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleLogin(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### AuthService
```typescript
class AuthService {
  async signup(email: string, password: string, name: string): Promise<SignupResult>
  async login(email: string, password: string): Promise<LoginResult>
  async validateToken(token: string): Promise<TokenValidationResult>
  async createUserRecord(userId: string, email: string, name: string): Promise<void>
}
```

---

### Wardrobe Service

#### WardrobeHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- POST /wardrobe/items -> handleAddItem(event)
- GET /wardrobe/items -> handleGetItems(event)
- PUT /wardrobe/items/{itemId} -> handleUpdateItem(event)
- DELETE /wardrobe/items/{itemId} -> handleDeleteItem(event)

async function handleAddItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleGetItems(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleUpdateItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleDeleteItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### WardrobeService
```typescript
class WardrobeService {
  async addItem(userId: string, item: CreateWardrobeItemInput): Promise<WardrobeItem>
  async getItems(userId: string): Promise<WardrobeItem[]>
  async updateItem(userId: string, itemId: string, updates: UpdateWardrobeItemInput): Promise<WardrobeItem>
  async deleteItem(userId: string, itemId: string): Promise<void>
  async updateUsageTracking(userId: string, itemIds: string[]): Promise<void>
}
```

#### WardrobeRepository
```typescript
class WardrobeRepository {
  async create(item: WardrobeItemRecord): Promise<WardrobeItemRecord>
  async findByUserId(userId: string): Promise<WardrobeItemRecord[]>
  async findByItemId(userId: string, itemId: string): Promise<WardrobeItemRecord | null>
  async update(userId: string, itemId: string, updates: Partial<WardrobeItemRecord>): Promise<WardrobeItemRecord>
  async delete(userId: string, itemId: string): Promise<void>
  async batchUpdateUsage(userId: string, itemIds: string[], lastWorn: string): Promise<void>
}
```

---

### Calendar/Outfit Service

#### OutfitHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- POST /outfits -> handleLogOutfit(event)
- GET /outfits -> handleGetOutfits(event)
- PUT /outfits/{date} -> handleUpdateOutfit(event)
- DELETE /outfits/{date} -> handleDeleteOutfit(event)

async function handleLogOutfit(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleGetOutfits(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleUpdateOutfit(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleDeleteOutfit(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### OutfitService
```typescript
class OutfitService {
  async logOutfit(userId: string, date: string, itemIds: string[], eventType?: string): Promise<Outfit>
  async getOutfits(userId: string, startDate?: string, endDate?: string): Promise<Outfit[]>
  async updateOutfit(userId: string, date: string, itemIds: string[]): Promise<Outfit>
  async deleteOutfit(userId: string, date: string): Promise<void>
}
```

#### OutfitRepository
```typescript
class OutfitRepository {
  async create(outfit: OutfitRecord): Promise<OutfitRecord>
  async findByUserId(userId: string, startDate?: string, endDate?: string): Promise<OutfitRecord[]>
  async findByDate(userId: string, date: string): Promise<OutfitRecord | null>
  async update(userId: string, date: string, updates: Partial<OutfitRecord>): Promise<OutfitRecord>
  async delete(userId: string, date: string): Promise<void>
}
```

---

### Events Service

#### EventsHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- POST /events -> handleCreateEvent(event)
- GET /events -> handleGetEvents(event)
- PUT /events/{eventId} -> handleUpdateEvent(event)
- DELETE /events/{eventId} -> handleDeleteEvent(event)

async function handleCreateEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleGetEvents(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleUpdateEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleDeleteEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### EventsService
```typescript
class EventsService {
  async createEvent(userId: string, event: CreateEventInput): Promise<Event>
  async getEvents(userId: string): Promise<Event[]>
  async updateEvent(userId: string, eventId: string, updates: UpdateEventInput): Promise<Event>
  async deleteEvent(userId: string, eventId: string): Promise<void>
  async getEventsTomorrow(): Promise<Event[]>
}
```

#### EventsRepository
```typescript
class EventsRepository {
  async create(event: EventRecord): Promise<EventRecord>
  async findByUserId(userId: string): Promise<EventRecord[]>
  async findByEventId(userId: string, eventId: string): Promise<EventRecord | null>
  async update(userId: string, eventId: string, updates: Partial<EventRecord>): Promise<EventRecord>
  async delete(userId: string, eventId: string): Promise<void>
  async findByDateRange(startDate: string, endDate: string): Promise<EventRecord[]>
}
```

---

### Suggestions Service

#### SuggestionsHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- GET /suggestions -> handleGetSuggestions(event)

async function handleGetSuggestions(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### SuggestionEngine
```typescript
class SuggestionEngine {
  async generateSuggestions(params: SuggestionParams): Promise<OutfitSuggestion[]>
  
  // Internal methods (detailed logic in Functional Design):
  private async fetchWeatherData(date: string): Promise<WeatherData>
  private filterByWeather(items: WardrobeItem[], weather: WeatherData): WardrobeItem[]
  private filterByOccasion(items: WardrobeItem[], eventType: string): WardrobeItem[]
  private excludeRecentlyWorn(items: WardrobeItem[], outfits: Outfit[], days: number): WardrobeItem[]
  private generateCombinations(items: WardrobeItem[]): OutfitCombination[]
  private rankSuggestions(combinations: OutfitCombination[]): OutfitSuggestion[]
}

interface SuggestionParams {
  userId: string;
  date?: string;
  eventId?: string;
}
```

#### WeatherService
```typescript
class WeatherService {
  async getCurrentWeather(location: string): Promise<WeatherData>
  async getForecast(location: string, date: string): Promise<WeatherData>
  private mapWeatherToSuitability(weather: WeatherData): string[]
  private cacheWeatherData(key: string, data: WeatherData): void
  private getCachedWeatherData(key: string): WeatherData | null
}
```

---

### Notifications Service

#### NotificationHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- PUT /user/preferences -> handleUpdatePreferences(event)
- GET /user/preferences -> handleGetPreferences(event)

async function handleUpdatePreferences(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
async function handleGetPreferences(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### ReminderHandler
```typescript
export async function handler(event: EventBridgeEvent): Promise<void>

// Scheduled execution:
async function processReminders(): Promise<void>
async function sendReminder(event: Event, user: User): Promise<void>
```

#### NotificationService
```typescript
class NotificationService {
  async updatePreferences(userId: string, notificationsEnabled: boolean): Promise<void>
  async getPreferences(userId: string): Promise<UserPreferences>
  async sendSMS(phoneNumber: string, message: string): Promise<void>
  private formatReminderMessage(event: Event): string
}
```

---

### Analytics Service

#### AnalyticsHandler
```typescript
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>

// Routes:
- GET /analytics -> handleGetAnalytics(event)

async function handleGetAnalytics(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
```

#### AnalyticsService
```typescript
class AnalyticsService {
  async getAnalytics(userId: string): Promise<AnalyticsData>
  
  // Internal methods:
  private async calculateMostWornItems(items: WardrobeItem[]): Promise<WardrobeItem[]>
  private async calculateLeastWornItems(items: WardrobeItem[]): Promise<WardrobeItem[]>
  private async calculateOutfitFrequency(outfits: Outfit[]): Promise<Record<string, number>>
}
```

---

### Shared Backend Components

#### AuthMiddleware
```typescript
async function validateAuth(event: APIGatewayProxyEvent): Promise<AuthContext>

interface AuthContext {
  userId: string;
  email: string;
}
```

#### ErrorHandler
```typescript
function handleError(error: Error): APIGatewayProxyResult

function formatErrorResponse(statusCode: number, message: string, details?: any): APIGatewayProxyResult
```

#### ResponseFormatter
```typescript
function formatSuccessResponse(statusCode: number, data: any): APIGatewayProxyResult

function addCorsHeaders(response: APIGatewayProxyResult): APIGatewayProxyResult
```

#### Validator
```typescript
function validateRequest(schema: ValidationSchema, data: any): ValidationResult

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29  
**Status**: Ready for Review

**Note**: Detailed business rules, algorithms, and implementation logic will be defined in Functional Design during the CONSTRUCTION phase.
