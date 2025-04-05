# Thought of the Day Generator 🎨✨

Automatically generate beautiful "Thought of the Day" images with dynamic quotes and customizable designs. Built with NestJS (Backend) and React (Frontend).

![Demo Screenshot](/public/screenshots/demo.png)  
*Example output with random design and quote*

## 🚀 Features
- **Dynamic Quote Fetching**: From Quotable/ZenQuotes APIs.
- **Two Design Modes**: 
  - Fixed (day-specific designs) 
  - Random (randomly generated layouts)
- **Auto-Text Wrapping**: Smart font scaling for optimal readability.
- **Downloadable Images**: Save generated quotes as PNG files.

## 🛠 Tech Stack
### Backend (NestJS)
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (quote storage)
- **Image Generation**: node-canvas
- **APIs**: Quotable, ZenQuotes

### Frontend (React)
- **UI Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## 🌐 API Documentation
### Base URL: `http://localhost:3001/api`

### **Quote Endpoints**
| Endpoint              | Method | Description                          |
|-----------------------|--------|--------------------------------------|
| `/quotes/random`      | GET    | Fetch a random unused quote          |
| `/quotes/debug`       | GET    | Debug: list all quotes (dev-only)    |

**Example Request**:
```bash
curl http://localhost:3001/quotes/random

**Response**:
{
"id": "c2ef4983-87f0-4cff-b681-09e3fe87cb6e",
"text": "Loving thoughts and actions are clearly beneficial for our physical and mental health.",
"author": "Dalai Lama",
"source": "zen-quotes",
"lastUsedAt": "2025-04-05T05:02:33.235Z",
"usageCount": 0,
"createdAt": "2025-03-30T15:26:41.054Z",
"category": null
}

### **Design Endpoints**
| Endpoint              | Method | Description                          |
|-----------------------|--------|--------------------------------------|
| `/design/random`      | GET    | Get random design config             |
| `/design/fixed/Monday`| GET    | Get fixed design for Monday          |

**Example Request**:
```bash
curl http://localhost:3001/design/random

### **Design Endpoints**
| Endpoint              | Method | Description                          |
|-----------------------|--------|--------------------------------------|
| `/image/quote-image`  | GET    | Generate quote image                 |

**Query Params**:
```bash
mode: fixed or random (required)
day: Day name (required if mode=fixed)

**Example Request**:
```bash
curl "http://localhost:3001/api/image/quote-image?mode=fixed&day=Monday"

**Response**:
```bash
{ "imageUrl": "/public/images/quote_123.png" }

🏗️ Setup
Backend
Configure Environment:

bash
Copy
cd backend
cp .env.example .env  # Update PostgreSQL credentials
Install & Run:

bash
Copy
npm install
npm run start:dev
Frontend
Set API URL:

bash
Copy
cd frontend
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
Install & Run:

bash
Copy
npm install
npm start
