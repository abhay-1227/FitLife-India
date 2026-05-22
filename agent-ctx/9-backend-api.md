# Task 9: PBL Hub Backend API Routes

## Work Completed

### API Routes Created

1. **`/api/projects/route.ts`** - Projects CRUD
   - GET: List all projects with optional filtering (category, search, featured)
   - POST: Create new project with validation (title, description, category, techStack, author required)
   - Returns projects with related tasks included

2. **`/api/projects/[id]/route.ts`** - Single Project Operations
   - GET: Get single project by ID with tasks
   - PUT: Update project (partial updates supported)
   - DELETE: Delete project by ID (with 404 check)
   - Uses Next.js 16 async params pattern

3. **`/api/resources/route.ts`** - Resources CRUD
   - GET: List all resources with optional filtering (category, type, search)
   - POST: Create new resource with validation (title, description, category, url, author required)
   - Search covers title, description, and tags fields

4. **`/api/tasks/route.ts`** - Tasks CRUD
   - GET: List all tasks with optional filtering (status, projectId, priority)
   - POST: Create new task with project existence validation
   - Returns tasks with related project data included

5. **`/api/tasks/[id]/route.ts`** - Single Task Operations
   - PUT: Update task (especially for kanban board status changes)
   - DELETE: Delete task by ID
   - Supports partial updates for status, priority, assignee changes

6. **`/api/chat/route.ts`** - AI Chat Assistant
   - POST: Send messages to AI assistant using z-ai-web-dev-sdk
   - System prompt defines PBL Hub assistant persona
   - Uses `zai.chat.completions.create()` with thinking disabled
   - Returns structured response with message and role

7. **`/api/skills/route.ts`** - Skills Management
   - GET: Get all skills ordered by name
   - POST: Create or update skill (upsert pattern - updates if name exists)
   - Supports level, category, and icon fields

8. **`/api/seed/route.ts`** - Database Seeding
   - POST: Seed database with sample data (only if empty)
   - Creates: 6 projects, 6 resources, 8 tasks, 8 skills
   - Returns counts of created records
   - Idempotent - won't re-seed if data exists

### Technical Details

- All routes use proper TypeScript typing
- Error handling with try/catch and appropriate HTTP status codes (200, 201, 400, 404, 500)
- Uses `NextResponse.json()` for all responses
- Database access via `import { db } from '@/lib/db'`
- Next.js 16 async params pattern for dynamic routes
- z-ai-web-dev-sdk used only in backend chat route
- ESLint passes with 0 errors

### Testing Results

All endpoints tested and verified:
- Seed: POST /api/seed → 6 projects, 6 resources, 8 tasks, 8 skills created
- Projects: GET /api/projects → returns all projects
- Projects filtered: GET /api/projects?category=Web+Dev → filtered results
- Projects featured: GET /api/projects?featured=true → featured only
- Single project: GET /api/projects/{id} → returns project with tasks
- Resources: GET /api/resources → returns all resources
- Tasks: GET /api/tasks → returns all tasks with project data
- Tasks filtered: GET /api/tasks?status=todo → filtered by status
- Task update: PUT /api/tasks/{id} → status change works
- Skills: GET /api/skills → returns all skills
