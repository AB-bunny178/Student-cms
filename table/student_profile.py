import pandas as pd
import re

# Load files
df1 = pd.read_csv("KaushikDhwanee_Master_Student_IDs.csv")
df2 = pd.read_csv("Hindustani Vocal & Tabla v7.csv")

# Drop duplicate Student IDs in master student sheet
df1 = df1.drop_duplicates(subset=["Student ID"], keep="first")

# Extract Total Classes Allotted from Package Name
def extract_allotted(pkg):
    if pd.isna(pkg):
        return None
    match = re.search(r'(\d+)\s*classes|\((\d+)\s*classes\)', str(pkg))
    if match:
        return int(match.group(1) or match.group(2))
    match2 = re.search(r'(\d+)\s*sessions', str(pkg))
    if match2:
        return int(match2.group(1))
    return None

df2["Total Classes Allotted"] = df2["Package Name"].apply(extract_allotted)

# Identify day-wise attendance columns
date_cols = [col for col in df2.columns if re.match(r'\d{2}-[A-Za-z]{3}', str(col))]

# Find last attended date
def get_last_attended(row):
    attended_dates = [col for col in date_cols if row.get(col) == 1.0]
    return attended_dates[-1] if attended_dates else "NA"

df2["Last Attended Date"] = df2.apply(get_last_attended, axis=1)

# Keep only students from df2, merge their Date of Joining from df1
merged = pd.merge(
    df2[["Student ID", "Student Name", "Course Category", "Classes Attended to-date",
         "Total Classes Allotted", "Last Attended Date"]],
    df1[["Student ID", "Date of Joining"]],
    on="Student ID",
    how="left"
)

# Fill missing values
merged["Date of Joining"] = merged["Date of Joining"].fillna("NA")
merged["Course Category"] = merged["Course Category"].fillna("NA")

# Compute Attendance % (cap at 100)
merged["Attendance %"] = (
    merged["Classes Attended to-date"] / merged["Total Classes Allotted"]
) * 100
merged["Attendance %"] = merged["Attendance %"].clip(upper=100).fillna(0)

# Now add students from master sheet who are missing in merged
missing_ids = df1[~df1["Student ID"].isin(merged["Student ID"])]
missing_ids = missing_ids.assign(
    CourseCategory="NA",
    **{
        "Total Classes Allotted": 0,
        "Classes Attended to-date": 0,
        "Attendance %": 0,
        "Last Attended Date": "NA"
    }
)

# Rename columns to match final output
missing_ids = missing_ids.rename(columns={"Activity": "Course Category"})

# Select the same columns as final output
missing_ids = missing_ids[[
    "Student ID",
    "Student Name",
    "Course Category",
    "Date of Joining"
]].assign(
    **{
        "Total Classes Allotted": 0,
        "Classes Attended to-date": 0,
        "Attendance %": 0,
        "Last Attended Date": "NA"
    }
)

# Combine both
final_output = pd.concat([merged, missing_ids], ignore_index=True)

# Reorder columns
final_output = final_output[[
    "Student ID",
    "Student Name",
    "Course Category",
    "Date of Joining",
    "Total Classes Allotted",
    "Classes Attended to-date",
    "Attendance %",
    "Last Attended Date"
]]

# Save to CSV
final_output.to_csv("Final_Student_Profile_Attendance.csv", index=False)

# Print the full table
pd.set_option("display.max_rows", None)
pd.set_option("display.max_columns", None)
# print(final_output)
print(final_output.tail())
print(final_output.head())


print("✅ Final CSV generated: Final_Student_Profile_Attendance.csv")
