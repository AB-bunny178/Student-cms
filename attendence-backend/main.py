from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
import math

app = FastAPI()

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

def sanitize_numeric(value, default=0):
    """Convert value to float safely and avoid NaN/Inf."""
    try:
        val = float(value)
        if math.isnan(val) or math.isinf(val):
            return default
        return val
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
        "student_id": row.get("Student ID", ""),
        "name": row.get("Student Name", ""),
        "course": row.get("Course Category", ""),
        "date_of_joining": row.get("Date of Joining", "")
    }

    # Numeric values safely
    total_allotted = int(sanitize_numeric(row.get("Total Classes Allotted")))
    total_attended = int(sanitize_numeric(row.get("Classes Attended to-date")))
    attendance_percentage = sanitize_numeric(row.get("Attendance %"))
    last_attended = row.get("Last Attended Date") or "N/A"

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
        # Split by comma and create trend points
        for date_str in attendance_dates.split(","):
            date_str = date_str.strip()
            if date_str:
                trend.append({"date": date_str, "attended": 1})
    else:
        # Fallback: generate trend based on total attended / allotted
        for i in range(1, total_allotted + 1):
            attended_flag = 1 if i <= total_attended else 0
            trend.append({"date": f"Class {i}", "attended": attended_flag})

    return {
        "profile": profile,
        "insights": insights,
        "trend": trend
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
