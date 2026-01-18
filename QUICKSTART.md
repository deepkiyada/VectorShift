# Quick Start Guide

Fastest way to get the project running (estimated time: 5 minutes).

## Prerequisites Check

```bash
node --version    # Should show v18 or higher
npm --version     # Should show version number
python3 --version # Should show 3.9 or higher
```

## One-Command Setup

### Terminal 1: Backend
```bash
cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend
```bash
npm install && npm run dev
```

## Verify

1. Backend: Open http://localhost:8000 → Should show `{"status":"healthy"...}`
2. Frontend: Open http://localhost:3000 → Should show workflow editor
3. Test: Click "Submit Workflow" → Should show statistics alert

## Troubleshooting

**Backend won't start:**
- Make sure virtual environment is activated: `source venv/bin/activate`
- Check Python version: `python3 --version` (needs 3.9+)

**Frontend won't start:**
- Check Node.js version: `node --version` (needs 18+)
- Try: `rm -rf node_modules && npm install`

**Connection errors:**
- Ensure both servers are running
- Backend must be on port 8000, frontend on port 3000

For detailed setup instructions, see [SETUP.md](./SETUP.md).
