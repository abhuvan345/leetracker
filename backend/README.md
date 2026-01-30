# LeetTracker Backend

Backend server for LeetCode question tracker with MongoDB integration.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/leetracker
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Questions

- `POST /api/questions/upload` - Upload CSV file with questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/company/:companyName` - Get questions for a specific company
- `GET /api/questions/companies/all` - Get all companies with statistics
- `DELETE /api/questions/company/:companyName` - Delete all questions for a company

### Progress

- `POST /api/progress/toggle/:questionId` - Toggle question completion status
- `GET /api/progress/daily` - Get daily progress for streak calendar
- `GET /api/progress/stats` - Get overall statistics

## CSV Format

Your CSV file should have these headers:

```
Title,Difficulty,Frequency,Acceptance,Link,Topics
```

Example:

```
Two Sum,Easy,95.5,49.2,https://leetcode.com/problems/two-sum/,"Array,Hash Table"
Add Two Numbers,Medium,82.3,41.8,https://leetcode.com/problems/add-two-numbers/,"Linked List,Math"
```
