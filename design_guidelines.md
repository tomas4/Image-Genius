# AI Photo Editor Design Guidelines

## Design Approach: Professional Editing Tool System

**Selected Approach**: Design System (Material Design + Professional Editing Tool Patterns)

**References**: Adobe Lightroom, Figma, Photoshop - applications that balance powerful functionality with clean interfaces

**Key Principles**:
- Maximize canvas space for the editing area
- Dark/neutral interface to reduce eye strain and make colors pop
- Clear visual hierarchy between tools and workspace
- Immediate visual feedback for all editing operations

---

## Core Design Elements

### A. Typography

**Font Family**: Inter (via Google Fonts CDN)

**Hierarchy**:
- Tool labels/buttons: 14px, medium weight (500)
- Chat messages: 15px, regular (400)
- Section headers: 16px, semibold (600)
- Canvas metadata: 12px, regular (400)

### B. Layout System

**Spacing Primitives**: Tailwind units of 2, 3, 4, 6, and 8
- Toolbar padding: p-3
- Canvas margins: m-4
- Button spacing: gap-2
- Panel sections: p-6

**Grid Structure**:
- Main layout: Three-column (tools sidebar | canvas area | chat panel)
- Sidebar width: 280px (fixed)
- Chat panel width: 360px (collapsible)
- Canvas: Flexible remaining space

---

## C. Component Library

### Layout Structure

**Main Application Grid**:
- Left Sidebar (280px): Quick-action editing tools in vertical stack
- Center Canvas Area (flex-1): Dominant workspace with zoom/pan controls
- Right Chat Panel (360px, collapsible): AI assistant interface

**Top Bar**: 
- Logo/app name (left)
- Current filename and dimensions display (center)
- Export button and view options (right)
- Height: h-14

### Quick-Action Toolbar (Left Sidebar)

**Tool Buttons** (full-width):
- Height: h-12
- Icon (24px) + label layout
- Grouped by category with dividers
- Categories: Enhance (sharpen, denoise), Repair (red eye, remove object), Adjust (contrast, exposure), Transform (background change)

**Visual Treatment**:
- Each button gets icon from Heroicons
- Rounded corners (rounded-md)
- Subtle hover states
- Active state shows current tool selected

### Canvas Editor (Center)

**Canvas Container**:
- Maximum usable space with centered image
- Checkerboard pattern for transparent areas
- Zoom controls (bottom-right floating): 25%, 50%, 100%, 200%, Fit
- Pan tool indicator when active

**Before/After Comparison**:
- Horizontal slider control overlaying canvas
- Split-screen view with draggable divider
- Toggle button in top-right of canvas area

### Chat Interface (Right Panel)

**Message List**:
- Scrollable container with gap-4 between messages
- User messages: aligned right, max-w-[85%]
- AI responses: aligned left, max-w-[85%]
- Message bubbles: rounded-2xl, p-4
- Timestamp: 11px below each message

**Input Area** (fixed bottom):
- Multiline textarea with p-3
- Send button (icon-only) positioned right
- Height expands with content (max 120px)
- Placeholder: "Describe what you'd like to edit..."

### Control Overlays

**Progress Indicator**:
- Centered modal overlay during AI processing
- Spinner + percentage counter
- Processing status text
- Semi-transparent backdrop

**Export Dialog**:
- Format selector (PNG, JPEG, WebP) as radio buttons
- Quality slider for JPEG
- Filename input field
- Size/dimension display
- Download button (primary CTA)

---

## D. Visual Hierarchy

**Primary Actions**: Export button (prominent in top bar)
**Secondary Actions**: Tool buttons (sidebar), chat send
**Tertiary Actions**: Zoom controls, view toggles

**Focus States**: All interactive elements get clear focus rings for accessibility
**Loading States**: Skeleton screens for image loading, spinners for processing

---

## Images

**No hero images** - This is a utility application, not a landing page. The canvas area itself becomes the primary visual element once users upload their photos.

**Icon Usage**: Heroicons throughout for consistency
- Camera icon: Upload/import
- Sparkles icon: AI features
- Adjustments icon: Manual controls
- Eye icon: Preview toggle

---

## Responsive Behavior

**Desktop-First** (optimized for 1440px+):
- Three-column layout on screens 1280px+
- Chat panel collapses to icon-only on 1024px-1279px
- Single-column mobile view (768px-): Stacked panels with tabs

**Critical Breakpoints**:
- xl (1280px): Full layout
- lg (1024px): Collapsed chat
- md (768px): Tablet stacked view