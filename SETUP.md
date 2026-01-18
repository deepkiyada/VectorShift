# Setup Guide

Complete step-by-step setup instructions for the VectorShift Workflow Editor (Frontend + Backend).

## Prerequisites

### Required Software

1. **Node.js 18+ and npm**
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Python 3.9+**
   - Download: https://www.python.org/downloads/
   - Verify: `python3 --version` or `python --version`

3. **pip3** (usually comes with Python)
   - Verify: `pip3 --version` or `python3 -m pip --version`

## Quick Setup (All Steps)

### Step 1: Extract Project

```bash
# Extract the zip file to your desired location
unzip vectorshift-project.zip  # or extract using GUI
cd VectorShift
```

### Step 2: Install Frontend Dependencies

```bash
# From project root
npm install
```

**Expected output:** Dependencies installed, may take 1-2 minutes.

**Troubleshooting:**
- If `npm` not found: Install Node.js from https://nodejs.org/
- If permission errors: Don't use `sudo`, npm doesn't require root access

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

**Expected output:** `Successfully installed fastapi-0.109.0 uvicorn-0.27.0 ...`

**Troubleshooting:**
- If `python3` not found: Try `python` instead
- If `pip` not found: Try `python3 -m pip` instead
- If `venv` module not found: Python may be missing venv module (rare)

### Step 4: Configure Environment (Optional)

The project works with defaults, but you can customize:

```bash
# From project root, create .env.local file (optional)
# This file is already in .gitignore, so it won't be committed
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
```

**Note:** Default backend URL is `http://localhost:8000` - no configuration needed if running on default port.

### Step 5: Start Backend Server

```bash
# From backend directory
# Make sure virtual environment is activated (you should see (venv) in terminal)
cd backend

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

**Keep this terminal window open** - the backend server must remain running.

**Verify backend is running:**
- Open browser: http://localhost:8000
- Should see: `{"status":"healthy","service":"vectorshift-workflow-api",...}`
- Or visit: http://localhost:8000/docs (FastAPI documentation)

### Step 6: Start Frontend Server

Open a **new terminal window** (keep backend terminal running):

```bash
# From project root (NOT backend directory)
cd VectorShift  # if not already there

# Start frontend development server
npm run dev
```

**Expected output:**
```
   ▲ Next.js 16.1.1
   - Local:        http://localhost:3000
   - ready started server on 0.0.0.0:3000
```

### Step 7: Open Application

Open your browser and visit: **http://localhost:3000**

You should see the Workflow Editor interface with nodes and edges.

## Testing the Application

### Test Frontend → Backend Connection

1. In the browser at http://localhost:3000, click **"Submit Workflow"**
2. You should see a statistics alert appear (top-right) showing:
   - Node count
   - Edge count
   - DAG validity status

### Test Graph Analysis

1. Click **"Analyze Workflow"** button
2. You should see analysis results including DAG detection

### Verify Backend API

Visit http://localhost:8000/docs to see the interactive API documentation.

## Common Issues & Solutions

### Issue: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
source venv/bin/activate  # Activate virtual environment first
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend

**Error:** `Failed to parse pipeline` or `404 Not Found`

**Solutions:**
1. Verify backend is running: http://localhost:8000 should return JSON
2. Check backend terminal for errors
3. Verify port 8000 is not blocked by firewall
4. Try hard refresh in browser (Cmd+Shift+R / Ctrl+Shift+F5)

### Issue: Port already in use

**Error:** `Address already in use`

**Solution:**
- **Backend (port 8000):** Kill existing process or change port:
  ```bash
  # Find and kill process on port 8000
  lsof -ti:8000 | xargs kill
  # OR change port
  uvicorn main:app --port 8001
  ```
- **Frontend (port 3000):** Same approach for port 3000

### Issue: Python virtual environment not activating

**Error:** `source: command not found` (Windows)

**Solution:** Use Windows activation command:
```bash
venv\Scripts\activate
```

### Issue: npm install fails

**Error:** Permission errors or network timeouts

**Solutions:**
- Clear npm cache: `npm cache clean --force`
- Use different network (firewall may block npm registry)
- Check Node.js version: `node --version` (should be 18+)

## Verification Checklist

After setup, verify everything works:

- [ ] Backend responds at http://localhost:8000
- [ ] Backend docs accessible at http://localhost:8000/docs
- [ ] Frontend loads at http://localhost:3000
- [ ] "Submit Workflow" button works (shows statistics alert)
- [ ] "Analyze Workflow" button works (shows analysis results)
- [ ] No console errors in browser developer tools
- [ ] No errors in backend terminal

## Project Structure

```
VectorShift/
├── README.md              # Main project documentation
├── SETUP.md              # This file - setup instructions
├── package.json          # Frontend dependencies
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Pydantic models
│   ├── graph_utils.py    # DAG detection algorithms
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend-specific documentation
└── app/                  # Next.js frontend
```

## Development Commands

### Frontend

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend

```bash
cd backend
source venv/bin/activate  # Activate virtual environment

# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Next Steps

After successful setup:

1. Explore the workflow editor at http://localhost:3000
2. Drag nodes and create connections
3. Try the "Submit Workflow" and "Analyze Workflow" buttons
4. Review the code structure in `components/`, `lib/`, and `backend/`
5. Check API documentation at http://localhost:8000/docs

## Need Help?

If you encounter issues not covered here:

1. Check browser console for errors (F12 → Console tab)
2. Check backend terminal for Python errors
3. Verify all prerequisites are installed correctly
4. Ensure both servers are running (frontend on 3000, backend on 8000)

---

**Note:** Both servers (frontend and backend) must be running simultaneously for full functionality. The frontend connects to the backend API for workflow validation and analysis.
