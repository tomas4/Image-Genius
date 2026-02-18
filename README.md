# AI Photo Editor

A responsive, full-featured photo editing application with both quick-action tools and AI-powered capabilities for advanced image manipulation.

**Note** - Powered by Google Gemini. See also: [replit.md](replit.md)

## Features

### Client-Side Image Processing
- **Sharpen** - Enhance image details with adjustable amount
- **Denoise** - Reduce noise while preserving fine details
- **Contrast** - Adjust image contrast from -100 to 100
- **Exposure** - Control overall exposure and brightness
- **Color Correction** - Saturation adjustments
- **Red Eye Removal** - Automatically reduce red-eye effects
- **Auto Enhance** - One-click enhancement with preset optimizations

### Advanced AI Features (Gemini Integration)
- **Object Removal** - Intelligent removal using Gemini AI analysis
- **Background Change** - AI-powered background replacement
- **Chat Assistant** - Natural language interface powered by Gemini Pro
- **Undo/Redo** - Full history tracking for all edits

### UI Components
- **Image Canvas** - High-performance rendering with zoom and pan
- **Before/After Comparison** - Toggle view to see editing results
- **Tool Settings** - Slider controls for precise parameter adjustments
- **Chat Panel** - AI assistant for editing guidance and commands
- **Export Dialog** - Multiple format support (PNG, JPEG, WebP)
- **Settings Panel** - Local model setup and AI configuration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Express.js with Node.js
- **Image Processing**: Canvas API (client-side)
- **State Management**: React Hooks with localStorage
- **AI Integration**: Google Gemini (via Replit AI Integrations)
- **Local Models Support**: GFPGAN, Real-ESRGAN, REMBG, ONNX Runtime

## Getting Started

### Installation

```bash
npm install
npm run dev
```

The application will start on `http://localhost:5000`

### Configuration

1. **AI Features**: Automatically configured via Replit AI Integrations.
   - No external API keys required.
   - Powered by Gemini 1.5 Flash.

2. **Local Models**: Configure model paths in Settings
   - Supported: GFPGAN, Real-ESRGAN, REMBG, ONNX models
   - Models run locally without internet connection

## Project Structure

```
├── client/
│   └── src/
│       ├── pages/
│       │   └── photo-editor.tsx       # Main editor page
│       ├── components/
│       │   └── editor/
│       │       ├── ImageCanvas.tsx     # Image display and interaction
│       │       ├── ToolsSidebar.tsx    # Tool selection
│       │       ├── ToolSettings.tsx    # Parameter adjustments
│       │       ├── ChatPanel.tsx       # AI chat interface
│       │       ├── TopBar.tsx          # Header with controls
│       │       ├── ExportDialog.tsx    # Export options
│       │       ├── SettingsDialog.tsx  # Configuration
│       │       ├── UploadZone.tsx      # Image upload
│       │       └── ThemeToggle.tsx     # Dark mode toggle
│       └── lib/
│           ├── image-processing.ts    # Canvas-based processing
│           └── openai-client.ts       # AI API integration (Gemini)
├── server/
│   ├── routes.ts                      # API endpoints
│   ├── image-processor.ts             # Backend processing utilities
│   └── storage.ts                     # Data storage interface
├── shared/
│   └── schema.ts                      # Shared data types and schemas
```

## API Endpoints

### Processing Operations

- `GET /api/health` - Health check
- `POST /api/process-image` - Client-side image processing
- `POST /api/process-ai` - AI-powered image editing (Gemini)
- `POST /api/chat` - Chat interface for natural language commands
- `GET /api/capabilities` - List available processing capabilities

## Image Processing Pipeline

1. **User uploads image** → Canvas rendering at native resolution
2. **Selects tool** → Configures parameters with real-time preview
3. **Applies effect** → Client-side Canvas API processing
4. **Auto-save to history** → Enables undo/redo functionality
5. **Exports result** → Multiple format support (PNG, JPEG, WebP)

## Advanced Features

### Chat-Based Editing
Describe edits in natural language:
- "Remove the background"
- "Make the colors more vibrant"
- "Enhance this portrait"

The AI assistant understands intent and suggests appropriate editing operations.

### Before/After Comparison
Toggle between original and edited versions to verify changes.

### Undo/Redo System
Full history tracking allows reverting to any previous state.

## Performance Optimizations

- Canvas-based client-side processing (no server round-trips)
- Lazy loading for images
- Efficient state management with React hooks
- LocalStorage for settings persistence
- Optimized bundle with tree-shaking

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Limitations

- Local model processing requires TensorFlow.js or compatible ONNX runtime
- Image processing is limited to client capabilities on older browsers
- Undo history is session-based (not persisted)

## Future Enhancements

- Database storage for editing history
- Batch processing for multiple images
- Custom filter support
- Mobile app with offline capabilities
- Real-time collaboration
- GPU acceleration with WebGL

## Development

### Building

```bash
npm run build
```

### Testing

Run component examples:
```bash
npm run dev
```

Navigate to component examples in the UI.

## License

MIT

## Support

For issues, feature requests, or questions, please contact support.

## Acknowledgments

Built with:
- Radix UI & shadcn/ui for accessible components
- Lucide React for icons
- TailwindCSS for styling
- Canvas API for image processing
- Google Gemini for AI capabilities
