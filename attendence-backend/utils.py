import pandas as pd
import re

# Load files
attendance_file = "data/Hindustani Vocal & Tabla v7.csv"
master_file = "data/KaushikDhwanee_Master_Student_IDs.csv"

att_df = pd.read_csv(attendance_file)
ids_df = pd.read_csv(master_file)

# Clean attendance dataframe
att_df = att_df.loc[:, ~att_df.columns.str.contains("^Unnamed")]

# Identify attendance date columns
date_columns = [col for col in att_df.columns if "-" in col and col not in ["Start Date", "End Date"]]

# Extract total classes allotted from "Package Name"
def extract_total_classes(package_name):
    if pd.isna(package_name):
        return None
    match = re.search(r"\((\d+)\s*classes?\)", str(package_name), flags=re.IGNORECASE)
    if match:
        return int(match.group(1))
    match = re.search(r"(\d+)\s*sessions?", str(package_name), flags=re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None

att_df["Total Classes Allotted"] = att_df["Package Name"].apply(extract_total_classes)

# Find the last attended date
def get_last_attended(row):
    attended_dates = [col for col in date_columns if pd.notna(row[col]) and row[col] == 1]
    return attended_dates[-1] if attended_dates else None

att_df["Last Attended Date"] = att_df.apply(get_last_attended, axis=1)

# Merge with master file
merged = att_df.merge(ids_df[["Student ID", "Date of Joining"]], on="Student ID", how="left")

# Compute Attendance %
merged["Attendance %"] = (
    merged["Classes Attended to-date"] / merged["Total Classes Allotted"] * 100
).round(2)

# Final useful columns
final_df = merged[[
    "Student ID",
    "Student Name", 
    "Course Category", 
    "Date of Joining",
    "Total Classes Allotted", 
    "Classes Attended to-date",
    "Attendance %", 
    "Last Attended Date"
]]

# Convert to dict for faster lookup
student_dict = final_df.set_index("Student ID").T.to_dict()
