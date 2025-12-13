# SAP Concur ICS JSON Explainer

## Overview
This application is a specialized developer tool designed to visualize, parse, and analyze SAP Concur JSON payloads (typically used in SAP ICS integrations). It runs as a local "single-page application" (SPA) on your desktop but uses web technologies (React, TypeScript, Vite).

It features:
1.  **JSON Visualization**: A tree-view explorer for complex JSON data.
2.  **Excel Export**: Smart flattening of hierarchical data (Reports -> Entries -> Allocations) into spreadsheet rows.
3.  **AI Analysis**: Uses Google's Gemini Flash model to explain technical fields and detect anomalies.
4.  **Local Execution**: Runs entirely on your machine without needing a dedicated backend server.

---

## Technical Architecture

The app is built using the **React** framework with **TypeScript**. It is bundled using **Vite**.

### Core Technologies
*   **React 18**: UI Component library.
*   **TypeScript**: Adds static typing to JavaScript for robustness.
*   **Vite**: The build tool and local development server.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Google GenAI SDK**: Connects to Gemini API for analysis.
*   **SheetJS (xlsx)**: Handles the logic for converting JSON to Excel.

---

## File Structure & Responsibilities

### Root Configuration
*   **`package.json`**: The project manifest. It lists dependencies (React, GenAI, etc.) and defines the scripts (`dev`, `build`).
*   **`vite.config.ts`**: Configures the local server (port 3000) and how the code is compiled.
*   **`tsconfig.json`**: Rules for the TypeScript compiler (strict mode, JSX support).
*   **`index.html`**: The entry point. It contains the root `<div>` where React attaches itself. It loads `index.tsx`.

### Application Entry
*   **`index.tsx`**: The JavaScript entry point. It finds the `#root` element in the HTML and renders the main `<App />` component into it.

### Main Application Logic
*   **`App.tsx`**: The "Brain" of the application.
    *   It manages the global state: `jsonContent` (the data), `apiKey` (for AI), and `analysis` results.
    *   It lays out the 3-column grid (Input | Viewer | Analysis).
    *   It handles the coordination between components (e.g., when a file is uploaded in `InputSection`, it updates `JsonViewer`).

### Components (`/components`)

#### 1. `InputSection.tsx`
*   **Role**: Handles data ingestion.
*   **Features**:
    *   File Upload (Drag & Drop or Click).
    *   Text Paste area.
    *   "Load Demo Data" button for testing.
*   **Logic**: It attempts to `JSON.parse()` any input immediately. If successful, it passes the data up to `App.tsx`. If it fails, it reports a syntax error.

#### 2. `JsonViewer.tsx`
*   **Role**: Displays the JSON data interactively.
*   **Features**:
    *   **Tree View**: Recursively renders `JsonNode` components to show nested data.
    *   **Search**: A real-time filter that highlights matching keys/values and auto-expands the tree to show them.
    *   **Excel Export**: Contains the complex logic (`exportToExcel` function) to "pivot" nested arrays (like `allocations` inside `entries` inside `reports`) into flat rows for Excel.
    *   **Hide Nulls**: A toggle to filter out fields with `null` values to reduce noise.

#### 3. `AnalysisPanel.tsx`
*   **Role**: Displays the AI-generated insights.
*   **Features**:
    *   Renders the "Executive Summary", "Financial Context", and "Warnings".
    *   Uses a loading skeleton state while waiting for the AI.
    *   Parses the structured JSON response from Gemini to display color-coded tags (High/Medium/Low importance).

#### 4. `SettingsModal.tsx`
*   **Role**: A secure dialog for entering the Google Gemini API Key.
*   **Security**: The key is saved to `localStorage` in the browser. It is never sent to any developer server; it goes directly from the user's browser to Google's API.

### Services (`/services`)

#### `geminiService.ts`
*   **Role**: The bridge to Google's AI.
*   **Logic**:
    *   Constructs a strict prompt telling Gemini to act as an "SAP Concur Expert".
    *   Defines a **JSON Schema** to force the AI to return structured data (Summary, Warnings, Field Explanations) instead of free text.
    *   Sends the user's JSON payload (truncated to 30k chars to stay within limits) to the model.

---

## Data Flow Diagram

1.  **User Action**: User drops a file in `InputSection`.
2.  **Parsing**: `InputSection` parses the text. If valid, calls `onJsonLoaded`.
3.  **State Update**: `App.tsx` receives the data and updates `jsonContent`.
4.  **Rendering**: 
    *   `JsonViewer` immediately renders the new tree.
    *   `AnalysisPanel` resets to "Ready to Analyze" state.
5.  **User Action**: User clicks "Analyze JSON".
6.  **AI Request**: `App.tsx` calls `geminiService.ts` -> sends data to Google API.
7.  **AI Response**: Google returns structured JSON analysis.
8.  **Display**: `App.tsx` updates `analysis` state, and `AnalysisPanel` renders the insights.

---

## Key Algorithms

### Excel Flattening (`JsonViewer.tsx`)
The `exportToExcel` function uses a **Recursive Drill-Down** strategy:
1.  It starts at the root.
2.  It looks for keys that contain **Arrays of Objects**.
    *   *Example:* If it sees `reports: [...]`, it dives in.
3.  As it dives, it **collects context**.
    *   *Example:* It grabs `batchId` from the root and passes it down.
4.  When it finds the deepest array (e.g., `allocations` or `entries`), it creates a **Row** for each item.
5.  Each row contains: `{ ...RootData, ...ReportData, ...EntryData, ...AllocationData }`.

This ensures that a nested JSON file becomes a flat, filterable Excel table.