# AI Photo Editor - Project Documentation

## Project Overview
A responsive, AI-powered photo editing application built with Fullstack JavaScript. Supports both client-side image processing for speed and Gemini AI integration for advanced AI features.

## Architecture

### Frontend Stack
- React 18 + TypeScript
- Tailwind CSS with shadcn/ui components
- Wouter for routing
- TanStack Query v5 for data fetching
- Canvas API for image processing
- localStorage for settings persistence

### Backend Stack
- Express.js
- Node.js
- Zod for validation
- Gemini AI integration (multimodal gemini-1.5-flash)
- Local model support infrastructure (REMBG, GFPGAN, etc.)

### Key Components
1. **PhotoEditor** (main page) - Orchestrates all editor functionality
2. **ImageCanvas** - High-performance image rendering and interaction
3. **ToolsSidebar** - Tool selection and quick actions
4. **ToolSettings** - Parameter adjustment with sliders
5. **ChatPanel** - AI assistant interface with vision capabilities
6. **SettingsDialog** - Model configuration
7. **ExportDialog** - Multi-format export options

### Data Flow
1. User uploads image → Stored in state + history
2. Selects tool → Opens ToolSettings panel
3. Adjusts parameters → Real-time preview via Canvas API
4. Applies effect → Processed client-side, added to history
5. AI Features → Request sent to backend with image data and prompt
6. Exports → Downloads file in selected format

## Features Implemented

### ✅ Complete
- 7 client-side image processing tools (sharpen, denoise, contrast, exposure, color correction, red eye removal, enhance)
- Full undo/redo history system
- Before/after comparison view
- Settings dialog for local model configuration
- Dark mode theme
- Responsive UI with collapsible chat panel
- Export with multiple formats (PNG, JPEG, WebP)
- Image upload with drag-and-drop support
- Processing status indicators
- Gemini AI integration for image analysis and chat
- Natural language command processing via chat
- Backend infrastructure for local model support (REMBG placeholder)

### 🚧 Backend Ready (In Progress)
- Full local model execution (GFPGAN, Real-ESRGAN, ONNX)
- Specialized image editing endpoints

### ⏸ Not Implemented
- Database persistence for editing history
- User authentication
- Batch processing
- Cloud storage integration
- Real-time collaboration

## Technical Decisions

### Client-Side Processing
Decision: Use Canvas API (Filters) for all basic operations
Rationale: Immediate feedback, no server latency, works offline, resolves greenish rectangle bug by using source-to-canvas rendering with filters.

### Settings Storage
Decision: Use localStorage for model config
Rationale: Convenient for single-user app, settings persist across sessions
Note: AI features use Replit AI Integrations (no API key required)

### History Tracking
Decision: Store edited image DataURLs in memory
Rationale: Simple implementation, works well for session-based editing
Limitation: Not persisted, limited by browser memory

### Image Format
Decision: Use JPEG as default for processing/export (0.95 quality)
Rationale: Better performance and smaller file sizes compared to PNG while maintaining high visual quality.

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional React components with hooks
- Descriptive naming (tool names match UI labels)
- Separation of concerns (components, utilities, types)

### Color System
- Dark theme optimized for photo editing (reduces eye strain)
- CSS variables for theming
- Accessible color contrasts

### Component Pattern
- Props-based configuration
- Callback functions for parent communication
- data-testid attributes for testing
- Error handling with toast notifications

## Environment Variables
- REPLIT_AI_API_KEY (Managed by Replit AI Integrations)

## Performance Characteristics
- Initial load: ~2s (includes React, TailwindCSS, components)
- Image processing: 50-200ms for client-side filters
- AI operations: 2-5s depending on network and model response
- Memory usage: ~50-100MB per edited image in history

## Known Issues & Limitations

1. **Canvas Context Loss**: If browser memory runs low, processing may fail
2. **Large Image Handling**: Very large images (>4K) may be slow to process
3. **Mobile Responsiveness**: Chat panel may not be ideal on very small screens
4. **Local Model Execution**: Currently requires external model setup and environment configuration

## Testing Checklist
- [x] Image upload (drag-drop and click)
- [x] Tool application (each of 7 tools)
- [x] Parameter adjustment (sliders)
- [x] Undo/redo functionality
- [x] Before/after comparison toggle
- [x] Export in different formats
- [x] Settings configuration (models)
- [x] Chat panel open/close
- [x] AI chat interaction (Gemini)
- [x] Dark mode toggle
- [x] Theme persistence

## Future Work Priority

1. **High Priority**
   - Full integration of specialized local models
   - Database for history persistence
   - User authentication

2. **Medium Priority**
   - Batch processing
   - Advanced filters library
   - Cloud storage integration

3. **Low Priority**
   - Real-time collaboration
   - Mobile app

## Session Notes
- Settings are stored in localStorage as JSON
- History is stored in state array with current index
- Client-side processing uses standard Canvas filters for stability
- Backend integrates with Gemini using Replit AI Integrations

## Deployment Notes
- Frontend builds to static files with Vite
- Backend runs on same port as frontend (5000)
- No database required for MVP

</file>
