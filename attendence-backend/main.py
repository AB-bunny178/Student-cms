from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
import math


app = FastAPI()
app = FastAPI(title="Student Attendance Dashboard API")

# CORS for frontend at localhost:808
origins = [
    "https://student-cms-neon.vercel.app",     # if you run locally
    "http://127.0.0.1:8080",
    "http://10.78.5.228:8081",  # your current frontend origin

]


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_FILE = Path("data/final.csv")

# Load CSV safely
try:
    df = pd.read_csv(CSV_FILE)
    df.columns = df.columns.str.strip()  # strip spaces in column names
    df["Student ID"] = df["Student ID"].astype(str).str.strip()
    print("✅ CSV Loaded successfully")
except Exception as e:
    print("❌ Failed to load CSV:", e)
    df = pd.DataFrame()

def sanitize_for_json(value, default=None):
    """Sanitize a value for JSON: convert NaN/Inf to default, keep others as is."""
    try:
        if isinstance(value, float):
            if math.isnan(value) or math.isinf(value):
                return default
        return value if value is not None else default
    except:
        return default

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend service is running"}

@app.get("/attendance/{student_id}")
async def get_attendance(student_id: str):
    student_id = student_id.strip()
    student = df[df["Student ID"] == student_id]

    if student.empty:
        raise HTTPException(status_code=404, detail="Student not found")

    row = student.iloc[0]

    # Profile
    profile = {
        "student_id": sanitize_for_json(row.get("Student ID"), ""),
        "name": sanitize_for_json(row.get("Student Name"), ""),
        "course": sanitize_for_json(row.get("Course Category"), ""),
        "date_of_joining": sanitize_for_json(row.get("Date of Joining"), "")
    }

    # Numeric values safely
    total_allotted = int(sanitize_for_json(row.get("Total Classes Allotted"), 0))
    total_attended = int(sanitize_for_json(row.get("Classes Attended to-date"), 0))
    attendance_percentage = sanitize_for_json(row.get("Attendance %"), 0)
    last_attended = sanitize_for_json(row.get("Last Attended Date"), "N/A")

    # Status
    if attendance_percentage >= 75:
        status = "Good"
    elif attendance_percentage >= 50:
        status = "Average"
    else:
        status = "At Risk"

    insights = {
        "total_classes_allotted": total_allotted,
        "total_classes_attended": total_attended,
        "attendance_percentage": attendance_percentage,
        "last_attended_date": last_attended,
        "status": status
    }

    # Trend generation
    trend = []
    attendance_dates = row.get("Attendance Dates", "")
    if attendance_dates and isinstance(attendance_dates, str):
        for date_str in attendance_dates.split(","):
            date_str = date_str.strip()
            if date_str:
                trend.append({
                    "date": sanitize_for_json(date_str, "Unknown Date"),
                    "attended": 1
                })
    else:
        for i in range(1, total_allotted + 1):
            trend.append({
                "date": f"Class {i}",
                "attended": 1 if i <= total_attended else 0
            })

    return {
        "profile": profile,
        "insights": insights,
        "trend": trend
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
