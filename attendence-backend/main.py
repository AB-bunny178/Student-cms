from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils import student_dict, date_columns
import pandas as pd

app = FastAPI(title="Student Attendance Dashboard API")

# CORS for frontend at localhost:808
origins = [
    "http://localhost:8080",     # if you run locally
    "http://127.0.0.1:8080",
    "http://10.78.5.228:8081",  # your current frontend origin

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/attendance/{student_id}")
async def get_attendance(student_id: str):
    student = student_dict.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Profile
    profile = {
        "student_id": student_id,
        "name": student["Student Name"],
        "course": student["Course Category"],
        "date_of_joining": student["Date of Joining"]
    }

    # Insights
    total_classes = student["Total Classes Allotted"]
    attended = student["Classes Attended to-date"]
    attendance_percentage = student["Attendance %"]
    last_date = student["Last Attended Date"]
    status = "✅ On track" if attendance_percentage >= 75 else "⚠️ Low attendance"

    insights = {
        "total_classes_allotted": total_classes,
        "total_classes_attended": attended,
        "attendance_percentage": attendance_percentage,
        "last_attended_date": last_date,
        "status": status
    }

    # Trend
    trend = []
    for date in date_columns:
        val = student.get(date)
        if val is None or (isinstance(val, float) and pd.isna(val)):
            attended_val = 0
        else:
            attended_val = int(val)
        trend.append({
            "date": date,
            "attended": attended_val
        })

    return {
        "profile": profile,
        "insights": insights,
        "trend": trend
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running"}
