# AI Photo Editor - Project Documentation

## Project Overview
A responsive, AI-powered photo editing application built with Fullstack JavaScript. Supports both client-side image processing for speed and OpenAI API integration for advanced AI features.

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
- OpenAI API integration (optional)

### Key Components
1. **PhotoEditor** (main page) - Orchestrates all editor functionality
2. **ImageCanvas** - High-performance image rendering and interaction
3. **ToolsSidebar** - Tool selection and quick actions
4. **ToolSettings** - Parameter adjustment with sliders
5. **ChatPanel** - AI assistant interface
6. **SettingsDialog** - API key and model configuration
7. **ExportDialog** - Multi-format export options

### Data Flow
1. User uploads image → Stored in state + history
2. Selects tool → Opens ToolSettings panel
3. Adjusts parameters → Real-time preview via Canvas API
4. Applies effect → Processed client-side, added to history
5. Exports → Downloads file in selected format

## Features Implemented

### ✅ Complete
- 7 client-side image processing tools (sharpen, denoise, contrast, exposure, color correction, red eye removal, enhance)
- Full undo/redo history system
- Before/after comparison view
- Settings dialog with API key configuration
- Dark mode theme
- Responsive UI with collapsible chat panel
- Export with multiple formats (PNG, JPEG, WebP)
- Image upload with drag-and-drop support
- Processing status indicators

### 🚧 Backend Ready (Not Implemented)
- OpenAI Vision API integration for object removal and background changes
- Chat message processing for natural language commands
- Local model support (GFPGAN, Real-ESRGAN, REMBG, ONNX)

### ⏸ Not Implemented
- Database persistence for editing history
- User authentication
- Batch processing
- Cloud storage integration
- Real-time collaboration

## Technical Decisions

### Client-Side Processing
Decision: Use Canvas API for all basic operations
Rationale: Immediate feedback, no server latency, works offline

### Settings Storage
Decision: Use localStorage for API keys and model config
Rationale: Convenient for single-user app, settings persist across sessions
Note: In production, should use secure credential storage

### History Tracking
Decision: Store edited image DataURLs in memory
Rationale: Simple implementation, works well for session-based editing
Limitation: Not persisted, limited by browser memory

### Image Format
Decision: Use PNG as default, support PNG/JPEG/WebP on export
Rationale: PNG preserves quality, supports transparency

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
None required for basic functionality. Optional:
- OPENAI_API_KEY (if using AI features via env instead of settings panel)

## Performance Characteristics
- Initial load: ~2s (includes React, TailwindCSS, components)
- Image processing: 100-500ms depending on operation and image size
- Memory usage: ~50-100MB per edited image in history

## Known Issues & Limitations

1. **Canvas Context Loss**: If browser memory runs low, processing may fail
2. **Large Image Handling**: Very large images (>4K) may be slow to process
3. **Mobile Responsiveness**: Chat panel may not be ideal on very small screens
4. **Processing Accuracy**: Simplified algorithms for red eye removal and denoise

## Testing Checklist
- [ ] Image upload (drag-drop and click)
- [ ] Tool application (each of 7 tools)
- [ ] Parameter adjustment (sliders)
- [ ] Undo/redo functionality
- [ ] Before/after comparison toggle
- [ ] Export in different formats
- [ ] Settings configuration (API key, models)
- [ ] Chat panel open/close
- [ ] Dark mode toggle
- [ ] Theme persistence

## Future Work Priority

1. **High Priority**
   - Implement OpenAI API integration for AI features
   - Add proper error handling and validation
   - Database for history persistence

2. **Medium Priority**
   - Local model support (TensorFlow.js)
   - Batch processing
   - Advanced filters library

3. **Low Priority**
   - Real-time collaboration
   - Cloud storage integration
   - Mobile app

## Session Notes
- Settings are stored in localStorage as JSON
- History is stored in state array with current index
- All client-side processing happens on main thread (consider Web Workers for large images)
- API routes are stubbed and ready for OpenAI integration

## Deployment Notes
- Frontend builds to static files with Vite
- Backend runs on same port as frontend (5000)
- No database required for MVP
- OPENAI_API_KEY should be set as environment variable in production
