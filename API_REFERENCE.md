# 🔌 API Integration Reference

## New API Endpoints

### POST /api/analyze - AI Performance Analysis

**Purpose**: Get AI-powered performance critique and strategic advice

**Request:**
```json
{
  "logs": [
    {
      "log_date": "2026-04-13",
      "score": 85,
      "sales": 45,
      "tasks": {
        "adOperations": true,
        "salesCodOps": true,
        "websiteCopyOptimization": false,
        "creativeProduction": true,
        "sheryiansCoding": false,
        "projectBuild": false,
        "codingLogicChallenge": true,
        "bookReading": true,
        "personalBrandContent": false,
        "experienceJournal": true
      },
      "status": "pass",
      "saved": true
    }
  ],
  "userName": "Hadi"
}
```

**Response (Success):**
```json
{
  "critique": "Your score is strong at 85. Focus on completing all high-impact tasks consistently.",
  "advice": "Tonight: Dedicate 30 mins to Creative Production to strengthen this category.",
  "metrics": {
    "avgScore": 78,
    "avgSales": 42,
    "strength": "adOperations",
    "weakness": "projectBuild"
  }
}
```

**Response (No Logs):**
```json
{
  "critique": "Start tracking your days to get performance insights.",
  "advice": "Complete your first day execution to unlock personalized strategies."
}
```

**Response (API Error):**
```json
{
  "critique": "System analyzing your performance...",
  "advice": "Keep pushing—consistency builds excellence.",
  "error": "Error message if any"
}
```

**HTTP Status**: Always 200 (errors handled gracefully)

---

## Data Structure Changes

### Task Definition Structure

**Before (v1.0):**
```typescript
interface TaskDefinition {
  key: "runAds" | "gotSales" | "codCare" | "clientFollowUp" | ...
  label: string
  weight: number
  category: "high" | "medium" | "low"
}
```

**After (v2.0):**
```typescript
interface TaskDefinition {
  key: "adOperations" | "salesCodOps" | "websiteCopyOptimization" | ...
  label: string
  weight: number
  category: "high" | "medium" | "low"
}
```

### DayTasks Interface

**Before:**
```typescript
interface DayTasks {
  runAds: boolean
  gotSales: boolean
  codCare: boolean
  clientFollowUp: boolean
  creativesWork: boolean
  objectionHandling: boolean
  landingPageWork: boolean
  systemCheck: boolean
  learning: boolean
  experienceJournal: boolean
}
```

**After:**
```typescript
interface DayTasks {
  adOperations: boolean
  salesCodOps: boolean
  websiteCopyOptimization: boolean
  creativeProduction: boolean
  sheryiansCoding: boolean
  projectBuild: boolean
  codingLogicChallenge: boolean
  bookReading: boolean
  personalBrandContent: boolean
  experienceJournal: boolean
}
```

### AppSettings Extension

**Added:**
```typescript
interface AppSettings {
  // ... existing fields
  nightOwlMode: boolean  // NEW - false by default
}
```

### DayLog (Unchanged)

```typescript
interface DayLog {
  log_date: string       // YYYY-MM-DD
  score: number         // 0-100
  sales: number         // Daily count
  tasks: DayTasks       // Task completion (keys updated)
  status: string        // "pass" | "fail"
  saved: boolean        // Sync status
}
```

---

## Component Integration

### AIAnalyst Component

**Location**: `src/components/AIAnalyst.tsx`

**Props**: None (uses useApp hook)

**Usage:**
```tsx
import { AIAnalyst } from "@/components/AIAnalyst"

export default function Page() {
  return (
    <div>
      <AIAnalyst />
    </div>
  )
}
```

**Features:**
- Auto-fetches from `/api/analyze`
- Shows critique, advice, metrics
- GSAP fade-in animation
- Responsive grid layout
- Error handling with fallback
- Loading state with spinner

**Styling**: Uses Tailwind CSS with purple theme

---

## Environment Variables

### Required for v2.0

```env
# Existing (v1.0)
NEXT_PUBLIC_SUPABASE_URL=https://jrwqwbeegqvluaftepjn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# New (v2.0)
GEMINI_API_KEY=AIzaSyBM_pbK2fEpHdtoTylckIsfF1qfthFC004
```

### Optional

```env
# For future use
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Backward Compatibility

### Database Schema
✅ **No changes** - Existing logs remain compatible

Migration handling:
- Old task keys can be mapped to new ones if needed
- New logs use new task structure
- No schema migration required

### Export/Import
```typescript
// Existing exports still work
export { useApp } from "@/context/AppContext"
export { TASK_DEFINITIONS, DayTasks } from "@/types"

// New export available
export { AIAnalyst } from "@/components/AIAnalyst"
```

---

## Context API Changes

### AppContext (Unchanged Interface)

```typescript
interface AppContextType {
  // Auth - no change
  isUnlocked: boolean
  unlock: (password: string) => boolean
  lock: () => void

  // Settings - enhanced
  settings: AppSettings  // Now includes nightOwlMode
  updateSettings: (partial: Partial<AppSettings>) => void
  resetAllData: () => void

  // Day logs - no change
  logs: DayLog[]
  todayLog: DayLog
  updateTodayTasks: (tasks: DayTasks) => void
  updateTodaySales: (sales: number) => void
  saveDay: () => Promise<void>

  // Computed - no change
  totalSales: number
  todayScore: number
  isSaving: boolean
}
```

### AppContext Features

**Night Owl Mode Persistence:**
```typescript
// Automatically persisted in localStorage
const [settings, setSettings] = useState<AppSettings>(...)

// Update triggers auto-save
updateSettings({ nightOwlMode: true })

// Loads on app start
const storedSettings = getStoredSettings()
```

---

## Utility Functions

### Updated Exports

```typescript
// All existing functions still work
export function getTasksByCategory(category: "high" | "medium" | "low")
export function calculateScore(tasks: DayTasks): number
export function getScoreColor(score: number): string
export function getScoreLabel(score: number): string

// New task keys work automatically
// Old code references compile but won't match new tasks
```

### Migration Helper (Optional)

```typescript
// Map old task keys to new ones
const migrationMap: Record<string, keyof DayTasks> = {
  "runAds": "adOperations",
  "gotSales": "salesCodOps",
  "codCare": "salesCodOps",
  // ... etc
}

function migrateOldTasks(oldTasks: any): DayTasks {
  const newTasks: Partial<DayTasks> = {}
  Object.entries(oldTasks).forEach(([oldKey, value]) => {
    const newKey = migrationMap[oldKey]
    if (newKey) newTasks[newKey] = value as boolean
  })
  return newTasks as DayTasks
}
```

---

## API Rate Limiting

### Gemini API
- Free tier: Generous rate limits
- Personal use: ~1,000 requests/month
- Per endpoint: 2 requests/second

### Supabase
- Existing limits apply (no change)
- Logs endpoint: Same as before

---

## Error Handling

### AI Analysis Failures

**Scenario 1: Invalid API Key**
```
Response: Falls back to generic advice
Status: 200 (graceful)
```

**Scenario 2: Network Timeout**
```
Response: Generic performance insights
Status: 200 (graceful)
```

**Scenario 3: No Logs Available**
```
Response: "Start tracking to get insights"
Status: 200 (expected)
```

### Type Errors

**Old Task References:**
```typescript
// This will cause TypeScript error
todayLog.tasks.gotSales  // ❌ Property 'gotSales' does not exist

// New reference
todayLog.tasks.salesCodOps  // ✅ Correct
```

---

## Testing Checklist

### API Endpoint
- [ ] Responds to POST requests
- [ ] Returns JSON with critique and advice
- [ ] Falls back gracefully on error
- [ ] Handles empty logs array
- [ ] Parses Gemini API response

### Component
- [ ] Loads on `/day` page
- [ ] Animates on mount
- [ ] Shows metrics grid
- [ ] Handles loading state
- [ ] Displays error gracefully

### Data Flow
- [ ] Reads from AppContext logs
- [ ] Updates when logs change
- [ ] Persists nightOwlMode
- [ ] Type safety with TypeScript
- [ ] No console errors

---

## Debugging

### Check AI Analysis

```typescript
// In browser console on /day
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    logs: JSON.parse(localStorage.getItem('flowme_logs') || '[]'),
    userName: 'Hadi'
  })
})
console.log(await response.json())
```

### Check Task Definitions

```typescript
// In browser console
import { TASK_DEFINITIONS } from '@/types'
TASK_DEFINITIONS.forEach(t => console.log(`${t.key}: ${t.label} (${t.weight} pts)`))
```

### Check Settings

```typescript
// In browser console
const settings = JSON.parse(localStorage.getItem('flowme_sales_settings'))
console.log('Night Owl Mode:', settings.nightOwlMode)
```

---

## Version Info

**Current**: v2.0.0 (High-Performance Execution Workspace)  
**Previous**: v1.0.0 (Original FlowMe Sales)

**Breaking Changes**: None (backward compatible)  
**New Features**: 3 major (Tasks, Roadmap, AI Analyst)  
**API Changes**: 1 new endpoint (/api/analyze)

---

**For Questions**: Refer to UPGRADE.md, DEPLOYMENT.md, or FEATURES_SUMMARY.md
