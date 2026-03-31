# SAP Concur ICS JSON Explainer - Installation Guide

## What is This App?

The **ICS JSON File Explorer** is a tool that helps you view, analyze, and export SAP Concur JSON data. It runs locally on your laptop and lets you:

* 📁 Upload and view JSON files in an easy-to-read tree format
* 🔍 Search through large JSON files
* 📊 Export data to Excel spreadsheets
* 🤖 Get AI-powered insights about your data (optional)

**No internet connection is required** - everything runs on your computer!

\---

## ⚡ Quick Start (5 Minutes)

### What You Need Before Starting

Your laptop needs these three things installed (in this order):

1. **Node.js \& npm** (JavaScript runtime - includes the package manager)
2. **Git** (for version control - optional but recommended)
3. **Google Gemini API Key** (for AI features - optional, get it free from Google)

#### Step 1: Install Node.js \& npm

This is the **most important** prerequisite. Node.js comes with npm, which manages the app's dependencies.

**Windows:**

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS (Long Term Support)** version
3. Run the installer and click **Next** through all options (keep defaults)
4. **Restart your computer** after installation

**Verify Installation:**

1. Open Command Prompt (Windows key + R, type `cmd`, press Enter)
2. Type: `node --version`
3. Type: `npm --version`
4. If you see version numbers (like `v18.15.0`), Node.js is installed ✅

\---

#### Step 2: Download This App

1. Go to the folder where this app is located
2. Open **File Explorer** to that folder
3. You're in the right place if you see this `README.md` file

**Optional - For updates:** If you want to track changes, install **Git**:

1. Go to [git-scm.com](https://git-scm.com)
2. Download and install (keep all defaults)

\---

#### Step 3: Install App Dependencies

This downloads all the libraries the app needs to run.

1. Open **Command Prompt** in the app folder:

   * Shift + Right-click in the folder → Select "Open PowerShell window here"
2. Type: `npm install`
3. Wait 2-3 minutes while it downloads (\~250MB)
4. When it's done, you'll see a message like "X packages in Y seconds" ✅

\---

#### Step 4: Get a Google Gemini API Key (Optional - for AI features)

If you want AI-powered analysis, you need a free API key:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the key (it's a long text string) - don't share it!
5. Keep this handy - you'll paste it in the app later

**Skip this step if you don't want AI features** - the app works fine without it.

\---

### Run the App

**Easy Way (Recommended):**

1. Double-click `ICS Explorer Startup.bat` in the app folder
2. A terminal window opens
3. A browser tab automatically opens showing the app ✅

**Manual Way:**

1. Open Command Prompt in the app folder
2. Type: `npm run dev`
3. When you see `"Local: http://localhost:3000"`, open your browser
4. Go to `http://localhost:3000`

\---

## 📚 How to Use the App

### First Time Setup

1. Click the **⚙️ Settings** button (top-right)
2. Paste your Gemini API Key (if you have one - optional)
3. Click **Save** and close

### Upload a JSON File

1. Click **"Choose File"** in the left panel, or
2. Drag \& drop a `.json` file onto the left panel

### View Your Data

* The middle panel shows your JSON in a tree format
* Click **►** to expand sections
* Type in the **Search** box to find specific fields

### Export to Excel

* Click the **📊 Export to Excel** button
* Your data is flattened into rows and downloaded as `.xlsx`

### Get AI Insights (if you have an API key)

1. Click **"Analyze JSON"** button
2. Wait 10-15 seconds
3. The right panel shows AI analysis

### Try Demo Data

* Click **"Load Demo Data"** to see how it works with sample data

\---

## 🛠️ System Requirements \& Prerequisites

### Minimum Requirements

|Component|Requirement|Why|
|-|-|-|
|**Operating System**|Windows 10 or newer|Modern browser support|
|**RAM**|4GB minimum (8GB recommended)|Smooth performance|
|**Disk Space**|500MB available|Node.js and dependencies|
|**Internet**|Not required\*|App runs completely locally|

\* Internet needed only to download Node.js and (optionally) for Gemini API

### Required Software (Installation Order)

#### 1\. **Node.js \& npm** (REQUIRED) ⭐⭐⭐

* **What:** JavaScript runtime and package manager
* **Why:** The app is built with JavaScript/React and needs Node.js to run
* **Download:** [nodejs.org](https://nodejs.org) - Get the **LTS version**
* **Install Time:** \~5 minutes
* **Verification:** Open Command Prompt and run:

```
  node --version
  npm --version
  ```

#### 2\. **Web Browser** (REQUIRED) ⭐⭐⭐

* **What:** You already have this (Chrome, Edge, Firefox, Safari)
* **Why:** The app runs in your web browser at `localhost:3000`
* **Recommendation:** Chrome or Edge (modern browsers work best)
* **No installation needed** - just use what you have

#### 3\. **Google Gemini API Key** (OPTIONAL) ⭐

* **What:** Free API access to Google's AI model
* **Why:** Powers the AI analysis feature
* **Cost:** FREE (Google gives you free API calls monthly)
* **Get it:** [aistudio.google.com/app/apikeys](https://aistudio.google.com/app/apikeys)
* **Setup Time:** \~2 minutes
* **If you skip:** App still works, just without AI insights

#### 4\. **Git** (OPTIONAL) ⭐

* **What:** Version control system
* **Why:** Makes it easy to update the app in the future
* **Download:** [git-scm.com](https://git-scm.com)
* **If you skip:** You can still run the app, just download updates manually

\---

## 🚀 Installation Steps (Detailed)

### Prerequisites Check Before You Start

1. Make sure Node.js is installed (`node --version` in Command Prompt)
2. Make sure you have a modern web browser
3. Optional: Have your Gemini API Key ready

### Step-by-Step Installation

**Step 1: Navigate to the App Folder**

```
File Explorer → Navigate to: C:\\Users\\\[YourUsername]\\OneDrive - Covantage\\Apps\\ICS JSON file
```

You should see this `README.md` file and other files listed at the top of this document.

**Step 2: Open Command Prompt Here**

* Windows 10/11: Shift + Right-click in empty space → "Open PowerShell window here"
* Or: File → Open Windows PowerShell

**Step 3: Install Dependencies**

```
npm install
```

This takes 2-3 minutes. You'll see files downloading and at the end:

```
added XYZ packages in XXs
```

**Step 4: Start the App**

```
npm run dev
```

You'll see:

```
  VITE v5.1.6  ready in 432ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**Step 5: Access the App**

* A browser window should open automatically
* If not, manually go to: `http://localhost:3000`
* You should see the app interface with three panels

\---

## 📋 Supported File Formats

* **JSON files** (`.json`) - Primary format
* **Drag \& drop** - Drop any JSON file directly on the app
* **Paste raw JSON** - Copy-paste JSON text into the textarea
* **Demo data** - Click "Load Demo Data" to see sample

\---

## Technical Architecture

The app is built using the **React** framework with **TypeScript**. It is bundled using **Vite**.

### Core Technologies

* **React 18**: UI Component library.
* **TypeScript**: Adds static typing to JavaScript for robustness.
* **Vite**: The build tool and local development server.
* **Tailwind CSS**: Utility-first CSS framework for styling.
* **Google GenAI SDK**: Connects to Gemini API for analysis.
* **SheetJS (xlsx)**: Handles the logic for converting JSON to Excel.

\---

## File Structure \& Responsibilities

### Root Configuration

* **`package.json`**: The project manifest. It lists dependencies (React, GenAI, etc.) and defines the scripts (`dev`, `build`).
* **`vite.config.ts`**: Configures the local server (port 3000) and how the code is compiled.
* **`tsconfig.json`**: Rules for the TypeScript compiler (strict mode, JSX support).
* **`index.html`**: The entry point. It contains the root `<div>` where React attaches itself. It loads `index.tsx`.

### Application Entry

* **`index.tsx`**: The JavaScript entry point. It finds the `#root` element in the HTML and renders the main `<App />` component into it.

### Main Application Logic

* **`App.tsx`**: The "Brain" of the application.

  * It manages the global state: `jsonContent` (the data), `apiKey` (for AI), and `analysis` results.
  * It lays out the 3-column grid (Input | Viewer | Analysis).
  * It handles the coordination between components (e.g., when a file is uploaded in `InputSection`, it updates `JsonViewer`).

### Components (`/components`)

#### 1\. `InputSection.tsx`

* **Role**: Handles data ingestion.
* **Features**:

  * File Upload (Drag \& Drop or Click).
  * Text Paste area.
  * "Load Demo Data" button for testing.
* **Logic**: It attempts to `JSON.parse()` any input immediately. If successful, it passes the data up to `App.tsx`. If it fails, it reports a syntax error.

#### 2\. `JsonViewer.tsx`

* **Role**: Displays the JSON data interactively.
* **Features**:

  * **Tree View**: Recursively renders `JsonNode` components to show nested data.
  * **Search**: A real-time filter that highlights matching keys/values and auto-expands the tree to show them.
  * **Excel Export**: Contains the complex logic (`exportToExcel` function) to "pivot" nested arrays (like `allocations` inside `entries` inside `reports`) into flat rows for Excel.
  * **Hide Nulls**: A toggle to filter out fields with `null` values to reduce noise.

#### 3\. `AnalysisPanel.tsx`

* **Role**: Displays the AI-generated insights.
* **Features**:

  * Renders the "Executive Summary", "Financial Context", and "Warnings".
  * Uses a loading skeleton state while waiting for the AI.
  * Parses the structured JSON response from Gemini to display color-coded tags (High/Medium/Low importance).

#### 4\. `SettingsModal.tsx`

* **Role**: A secure dialog for entering the Google Gemini API Key.
* **Security**: The key is saved to `localStorage` in the browser. It is never sent to any developer server; it goes directly from the user's browser to Google's API.

### Services (`/services`)

#### `geminiService.ts`

* **Role**: The bridge to Google's AI.
* **Logic**:

  * Constructs a strict prompt telling Gemini to act as an "SAP Concur Expert".
  * Defines a **JSON Schema** to force the AI to return structured data (Summary, Warnings, Field Explanations) instead of free text.
  * Sends the user's JSON payload (truncated to 30k chars to stay within limits) to the model.

\---

## Data Flow Diagram

1. **User Action**: User drops a file in `InputSection`.
2. **Parsing**: `InputSection` parses the text. If valid, calls `onJsonLoaded`.
3. **State Update**: `App.tsx` receives the data and updates `jsonContent`.
4. **Rendering**:

   * `JsonViewer` immediately renders the new tree.
   * `AnalysisPanel` resets to "Ready to Analyze" state.
5. **User Action**: User clicks "Analyze JSON".
6. **AI Request**: `App.tsx` calls `geminiService.ts` -> sends data to Google API.
7. **AI Response**: Google returns structured JSON analysis.
8. **Display**: `App.tsx` updates `analysis` state, and `AnalysisPanel` renders the insights.

\---

## Key Algorithms

### Excel Flattening (`JsonViewer.tsx`)

The `exportToExcel` function uses a **Recursive Drill-Down** strategy:

1. It starts at the root.
2. It looks for keys that contain **Arrays of Objects**.

   * *Example:* If it sees `reports: \[...]`, it dives in.
3. As it dives, it **collects context**.

   * *Example:* It grabs `batchId` from the root and passes it down.
4. When it finds the deepest array (e.g., `allocations` or `entries`), it creates a **Row** for each item.
5. Each row contains: `{ ...RootData, ...ReportData, ...EntryData, ...AllocationData }`.

This ensures that a nested JSON file becomes a flat, filterable Excel table.

\---

## ❌ Troubleshooting

### Issue: "npm command not found" or "node command not found"

**Problem:** Your command prompt doesn't recognize npm or node commands.

**Solution:**

1. **Restart your computer** - You may not have restarted after installing Node.js
2. **Reinstall Node.js** - Uninstall and reinstall from [nodejs.org](https://nodejs.org)
3. **Check PATH variable** - If already installed:

   * Right-click "This PC" or "My Computer" → Properties
   * Click "Advanced system settings"
   * Click "Environment Variables"
   * Check that Node.js path is in the PATH variable
4. **Use a new Command Prompt window** - Close and reopen command prompt after installation

\---

### Issue: "Port 3000 already in use"

**Problem:** You see an error like `Port 3000 already in use`.

**Solution:**

* Another instance of this app is already running
* Kill any existing npm processes:

```
  taskkill /F /IM node.exe
  ```

* Then try `npm run dev` again
* Or stop the currently running app (Ctrl+C in its Command Prompt window)

\---

### Issue: Browser Shows "Cannot Connect" Error

**Problem:** Browser can't reach `http://localhost:3000`.

**Solution:**

1. Check Command Prompt - Does it show `Vite running at http://localhost:3000`?
2. If not, the server didn't start - try `npm run dev` again
3. If it did, try:

   * Refresh the browser (F5)
   * Try a different browser (Chrome, Edge, Firefox)
   * Close and reopen the browser tab
   * Ensure no firewall is blocking localhost

\---

### Issue: npm install Fails or Stalls

**Problem:** `npm install` shows errors or takes more than 5 minutes.

**Solution:**

1. **Cancel and retry:**

   * Press Ctrl+C in Command Prompt
   * Wait 10 seconds
   * Type: `npm install` again\\
2. **Clear npm cache:**

```
   npm cache clean --force
   npm install
   ```

3. **Check internet:** Make sure your WiFi/network is working
4. **Increase timeout:**

```
   npm install --legacy-peer-deps
   ```

\---

### Issue: "Invalid JSON" Error When Loading a File

**Problem:** You see "JSON Parse Error" when uploading a file.

**Solution:**

1. Check that the file is actually `.json` format, not `.txt` or `.xlsx`
2. Validate the JSON using an online tool:

   * Go to [jsonlint.com](https://www.jsonlint.com)
   * Paste your JSON content
   * It will show any syntax errors
3. Fix the JSON syntax errors in your original file
4. Try uploading again

\---

### Issue: AI Analysis Not Working or Shows Error

**Problem:** When you click "Analyze JSON", nothing happens or you see an error.

**Solution:**

1. **Check if you set the API Key:**

   * Click ⚙️ Settings
   * Paste your Gemini API Key
   * Click Save
2. **Check if the key is correct:**

   * Get a new key from [aistudio.google.com/app/apikeys](https://aistudio.google.com/app/apikeys)
   * Make sure you copy the entire key (no spaces at the end)
3. **Check internet connection:** Gemini requires internet
4. **Check Google account:** Make sure you have an active Google account
5. **Wait a moment:** First analysis can take 15-20 seconds

\---

### Issue: App Runs Slowly or Freezes with Large JSON Files

**Problem:** The app becomes sluggish when loading very large JSON files (multi-MB).

**Solution:**

1. **Close other apps** to free up RAM
2. **Restart the app:**

   * Close the browser tab
   * Press Ctrl+C in the Command Prompt
   * Type: `npm run dev` again
3. **Use a smaller subset of data** if possible
4. **Upgrade your RAM** (if you consistently work with multi-GB files)

\---

### Issue: "Missing node\_modules" Error

**Problem:** You see errors mentioning `node\_modules` folder.

**Solution:**

1. Make sure you ran `npm install` in the app folder
2. Verify the `node\_modules` folder exists:

   * Open File Explorer to the app folder
   * Look for a `node\_modules` folder (large folder \~250MB)
3. If missing, run: `npm install` again

\---

## ❓ Frequently Asked Questions (FAQ)

### Q: Do I need internet to use the app?

**A:** Mostly no. The app runs completely locally. You only need internet to:

* Download and install Node.js (first time)
* Use the AI analysis feature (requires Gemini API)
* Download your Google Gemini API Key

### Q: Can multiple people use this app on different computers?

**A:** Yes! Each person needs:

1. Node.js installed on their computer
2. A copy of the app folder
3. To run `npm install` on their computer

### Q: Is my data secure?

**A:** Yes. By default:

* All processing happens locally on your computer
* Files never leave your laptop
* Except: If you use AI analysis, the JSON data is sent to Google's servers (encrypted). *Never* analyze files with sensitive/private info unless you trust Google Gemini.

### Q: Why does the app run in a browser if it's local?

**A:** The browser is just the display. The app uses React (a web framework) for the user interface, but everything runs on your machine - no web server needed (except Vite's local dev server).

### Q: Can I close the Command Prompt window?

**A:** No - if you close it, the app stops. Keep the Command Prompt window open while you use the app.

### Q: How do I update the app to a newer version?

**A:**

1. Download the updated app folder
2. Replace your old app folder
3. Open Command Prompt in the new folder
4. Run `npm install`
5. Run `npm run dev`

### Q: Can I run this on Mac or Linux?

**A:** Yes! The app is cross-platform. Just install Node.js for Mac/Linux:

* **Mac:** Install from [nodejs.org](https://nodejs.org) or use Homebrew: `brew install node`
* **Linux:** Use your package manager, e.g., `apt install nodejs npm`
* Then follow the same `npm install` and `npm run dev` steps

### Q: What if I don't want to use the Command Prompt?

**A:** You can create a simpler launcher:

1. Right-click on `ICS Explorer Startup.bat`
2. Create a shortcut to your Desktop
3. Double-click the shortcut to start the app anytime

### Q: Can I export to formats other than Excel?

**A:** Currently only Excel (`.xlsx`). Future versions might add CSV or other formats.

### Q: What JSON file structures are supported?

**A:** Any valid JSON file. The app works best with hierarchical/nested JSON data like SAP Concur payloads with Reports, Entries, and Allocations.

\---

## 🔧 Maintenance

### Updating Dependencies

If you ever need to update the app's libraries:

```
npm update
```

### Rebuilding for Production

To create an optimized version (not needed for local use):

```
npm run build
npm run preview
```

### Checking App Logs

If something goes wrong, check the Command Prompt window where you ran `npm run dev` - it will show error messages.

\---

## 📞 Support

**For issues:**

1. Check the **Troubleshooting** section above
2. Check the **FAQ** section
3. Verify Node.js is installed: `node --version`
4. Verify npm is installed: `npm --version`
5. Try restarting the app and your computer

**Still stuck?**

* Try creating a fresh `node\_modules` folder: `rm -r node\_modules` then `npm install`
* Contact your IT support with the error message from the Command Prompt

\---

## 📝 Summary: Installation Checklist

* \[ ] **Node.js \& npm installed** (verify with `node --version` and `npm --version`)
* \[ ] **App folder downloaded** and accessible
* \[ ] **npm install completed** (`npm install` command ran successfully)
* \[ ] **App starts** (`npm run dev` shows port 3000 ready)
* \[ ] **Browser opens** to `http://localhost:3000` (or you can navigate manually)
* \[ ] **Optional: Gemini API key** obtained from [aistudio.google.com/app/apikeys](https://aistudio.google.com/app/apikeys)
* \[ ] **Optional: API key entered** in app settings (⚙️ button)
* \[ ] **Test with demo data** by clicking "Load Demo Data" button

**You're ready to use the app!** 🎉

\---

## Version Information

* **App Name:** SAP Concur ICS JSON Explainer
* **Current Version:** 1.0.0
* **Last Updated:** April 2026
* **Built With:** React 18, TypeScript, Vite
* **Node.js Minimum:** v14.0.0
* **npm Minimum:** v6.0.0

