# import pandas as pd

# # Load CSV here
# df = pd.read_csv("data/final.csv")

# def get_student_row(student_id: str):
#     """Fetch a student's row from CSV by ID"""
#     student = df[df["Student ID"] == student_id]
#     return None if student.empty else student.iloc[0]

# def build_profile(row):
#     """Build student profile dictionary"""
#     return {
#         "student_id": row["Student ID"],
#         "name": row["Student Name"],
#         "course": row["Course Category"],
#         "date_of_joining": row["Date of Joining"]
#     }

# def build_insights(row):
#     """Build attendance insights dictionary"""
#     total_allotted = int(row["Total classes Allotted"])
#     total_attended = int(row["Classes Attended to-date"])
#     percentage = float(row["Attendance %"])
#     last_attended = row["Last Attended Date"]

#     if percentage >= 75:
#         status = "Good"
#     elif percentage >= 50:
#         status = "Average"
#     else:
#         status = "At Risk"

#     return {
#         "total_classes_allotted": total_allotted,
#         "total_classes_attended": total_attended,
#         "attendance_percentage": percentage,
#         "last_attended_date": last_attended,
#         "status": status
#     }

# def build_trend(row):
#     """Dummy trend data (replace with real attendance if available)"""
#     return [
#         {"date": "2025-08-01", "attended": 1},
#         {"date": "2025-08-02", "attended": 0},
#         {"date": "2025-08-03", "attended": 1}
#     ]
