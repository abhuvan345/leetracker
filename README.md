# 🎯 Quick Start Guide - LeetTracker with MongoDB

## What Was Created

Your LeetCode question tracker now has:

- ✅ **Backend API** (Express.js + MongoDB)
- ✅ **Cloud Database** (MongoDB Atlas integration)
- ✅ **Updated Frontend** (React with API calls)
- ✅ **CSV Upload** (Direct to database)
- ✅ **Progress Tracking** (Stored in MongoDB)

---

## 🚀 Getting Started (5 Steps)

### Step 1: Set Up MongoDB Atlas (10 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a FREE account
3. Create a cluster (FREE M0 tier)
4. Create a database user (Security → Database Access)
5. Allow network access (Security → Network Access → Allow from anywhere)
6. Get your connection string (Database → Connect)

Example connection string:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leetracker
```

**📝 Save your connection string!**

---

### Step 2: Install Backend Dependencies

```powershell
cd C:\Users\bhuvan\Desktop\Leetracer\backend
npm install
```

---

### Step 3: Configure Backend Environment

```powershell
# Create .env file
Copy-Item .env.example .env

# Edit it
notepad .env
```

Add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/leetracker
PORT=5000
NODE_ENV=development
```

---

### Step 4: Start Backend Server

```powershell
npm run dev
```

You should see:

```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

**Keep this terminal open!**

---

### Step 5: Configure and Start Frontend

Open a **NEW** terminal:

```powershell
cd C:\Users\bhuvan\Desktop\Leetracer\leetracker

# Create .env file
Copy-Item .env.example .env

# Edit it
notepad .env
```

Add:

```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```powershell
npm run dev
```

Open http://localhost:5173 in your browser

---

## ✅ Test It Works

### 1. Test Backend Health

Open in browser: http://localhost:5000/api/health

Should show:

```json
{ "status": "ok", "message": "Server is running" }
```

### 2. Upload Questions

1. Go to **Admin** page in your app
2. Enter company name: `Google`
3. Upload a CSV file with questions
4. You should see success message

### 3. View in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. You should see:
   - `questions` collection with your data
   - `progresses` collection (empty initially)

### 4. View in App

1. Go to **Dashboard**
2. You should see the company card (Google)
3. Click it to view all questions
4. Check a question as complete
5. Go back to MongoDB → Check `progresses` collection

---

## 📋 CSV File Format

Your CSV should look like this:

```csv
Title,Difficulty,Frequency,Acceptance Rate,Link,Topics
Two Sum,Easy,95.5,49.2,https://leetcode.com/problems/two-sum/,"Array,Hash Table"
Add Two Numbers,Medium,82.3,41.8,https://leetcode.com/problems/add-two-numbers/,"Linked List,Math"
Longest Substring,Medium,78.5,33.1,https://leetcode.com/problems/longest-substring/,"String,Sliding Window"
```

**Required Headers:**

- Title
- Difficulty (Easy/Medium/Hard)
- Frequency
- Acceptance Rate
- Link
- Topics (comma-separated in quotes)

---

## 🗂️ Project Structure

```
Leetracer/
├── backend/              ← Node.js API server
│   ├── models/          ← MongoDB schemas
│   ├── routes/          ← API endpoints
│   ├── .env             ← YOUR MongoDB connection
│   ├── package.json
│   └── server.js
│
├── leetracker/          ← React frontend
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.ts   ← API calls
│   │   ├── components/
│   │   └── pages/
│   ├── .env             ← API URL config
│   └── package.json
│
└── MONGODB_SETUP.md     ← Detailed guide
```

---

## 🔧 Common Issues & Solutions

### ❌ "Cannot connect to MongoDB"

**Solution:**

- Check your connection string in `.env`
- Make sure Network Access allows your IP
- Verify username/password are correct

### ❌ "CORS error" in browser

**Solution:**

- Make sure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Restart both servers

### ❌ "Authentication failed"

**Solution:**

- Check username and password in connection string
- Make sure user has "Read and Write" permissions
- Special characters in password? URL-encode them

### ❌ Questions not showing

**Solution:**

- Open browser DevTools → Network tab
- Check if API calls are successful
- Verify backend terminal shows no errors

---

## 📚 API Endpoints Reference

### Questions

```
POST   /api/questions/upload              Upload CSV
GET    /api/questions                     Get all questions
GET    /api/questions/company/:name       Get company questions
GET    /api/questions/companies/all       Get all companies
DELETE /api/questions/company/:name       Delete company
```

### Progress

```
POST   /api/progress/toggle/:id           Mark complete/incomplete
GET    /api/progress/daily                Get daily streak
GET    /api/progress/stats                Get statistics
```

---

## 🎓 Learn More

- **MongoDB Atlas**: [docs.mongodb.com](https://www.mongodb.com/docs/atlas/)
- **Mongoose**: [mongoosejs.com](https://mongoosejs.com/)
- **Express.js**: [expressjs.com](https://expressjs.com/)

---

## 📞 Need Help?

1. Check [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed setup
2. Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
3. Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) for step-by-step

---

## ✨ What's Next?

- [ ] Add user authentication
- [ ] Deploy to production (Vercel/Railway/Render)
- [ ] Add more statistics
- [ ] Email reminders
- [ ] Question search and filters
- [ ] Dark mode
- [ ] Export progress as PDF

Good luck with your LeetCode practice! 🚀
