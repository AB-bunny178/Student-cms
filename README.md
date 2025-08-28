# 🎓 Student CMS (Attendance & Profile Management System)

A **full-stack web application** for managing **student profiles and attendance insights**.  
Built with **React + Vite + Tailwind (Frontend)** and **FastAPI + Uvicorn (Backend)**.  
Deployed on **Vercel (Frontend)** and **Render (Backend)**.  

---

## ✨ Features

✅ Student Profile Management  
✅ Attendance Insights & Trends (CSV-driven data)  
✅ Interactive Charts & Analytics  
✅ Health Check API for backend status  
✅ Deployed & accessible via web  

---

## 🖼️ Project Preview

### 🔹 Landing Page (Frontend - React)
![Landing Page](https://github.com/yourusername/Student-cms/assets/yourimageid/landing.png)

### 🔹 Attendance Dashboard
![Attendance Dashboard](https://github.com/yourusername/Student-cms/assets/yourimageid/dashboard.png)

### 🔹 API Response Example
```json
{
  "profile": {
    "student_id": "KD25TBINHYDKP010001",
    "name": "Dhanush J",
    "course": "Art Foundation Basic (AFB)",
    "date_of_joining": "2022-10-06"
  },
  "insights": {
    "total_classes_allotted": 30,
    "total_classes_attended": 27,
    "attendance_percentage": 90,
    "last_attended_date": "2023-03-12",
    "status": "Good"
  },
  "trend": [
    { "date": "2023-03-01", "attended": 1 },
    { "date": "2023-03-02", "attended": 0 }
  ]
}
🛠️ Tech Stack
Frontend (React + Vite + TypeScript + Tailwind + ShadCN UI)

⚡ Vite for blazing fast builds

🎨 TailwindCSS for modern styling

📊 Charts for attendance trends

Backend (FastAPI + Python + Uvicorn)

🚀 FastAPI for REST APIs

🗂️ Reads data from CSV files

🌐 Deployed on Render

Deployment

Frontend → Vercel

Backend → Render

📂 Project Structure
bash
Copy code
Student-CMS/
│── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI entry point
│   │   ├── routers/       # Attendance, healthcheck routes
│   │   ├── utils/         # CSV parsing logic
│   └── requirements.txt   # Backend dependencies
│
│── frontend/
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Views
│   └── vite.config.ts
│
└── README.md
🚀 Getting Started
1️⃣ Clone Repo
bash
Copy code
git clone https://github.com/yourusername/Student-cms.git
cd Student-cms
2️⃣ Setup Backend
bash
Copy code
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Backend runs on http://localhost:8000

3️⃣ Setup Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs on http://localhost:5173

⚙️ Environment Variables
Backend (Render)
bash
Copy code
PORT=8000
Frontend (Vercel)
bash
Copy code
VITE_API_BASE=https://student-cms-imgl.onrender.com
🌍 Deployment Links
Frontend (Vercel) → Student CMS Frontend

Backend (Render) → Student CMS Backend

🔧 API Endpoints
Method	Endpoint	Description
GET	/health	Check backend health
GET	/attendance/{student_id}	Fetch attendance insights

🎥 Demo (GIF/Animation)


👨‍💻 Author
👤 Pramodkumar Athkuri

GitHub: @AB-bunny178

LinkedIn: https://www.linkedin.com/in/pramodkumar-athkuri-4466382ab/

⭐ Contributing
Contributions are welcome!

Fork the repo

Create a feature branch

Submit a PR 🚀

📜 License
MIT License © 2025 [Your Name]

yaml
Copy code

---

👉 This README includes:
- **Project intro**  
- **Features list**  
- **Images/GIF placeholders**  
- **Tech stack**  
- **Setup instructions**  
- **Env variables (Render + Vercel)**  
- **API docs**  
- **Deployment links**  

---

Do you want me to also **create an ASCII animation/diagram** (like architecture flow) inside README so it looks even cooler?







Ask ChatGPT
