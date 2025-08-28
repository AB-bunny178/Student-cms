import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import StudentProfile from "@/components/StudentProfile";
import AttendanceMetrics from "@/components/AttendanceMetrics";
import AttendanceChart from "@/components/AttendanceChart";
import { api, StudentAttendanceResponse, ApiError, AttendancePoint } from "@/lib/api";

const Dashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);

  // Check backend availability on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.healthCheck();
        setIsBackendAvailable(true);
      } catch (err) {
        setIsBackendAvailable(false);
        console.error('Backend not available:', err);
      }
    };
    checkBackend();
  }, []);

  const handleSearch = async (studentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const studentData = await api.getStudentAttendance(studentId);

      // Convert trend values to numeric safely (0 = Absent, 1 = Present)
      const numericTrend: AttendancePoint[] = studentData.trend.map((point) => ({
        ...point,
        attended: ["Present", 1, "1"].includes(point.attended) ? 1 : 0,
      }));

      studentData.trend = numericTrend;
      setSelectedStudent(studentData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setSelectedStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Show backend unavailable message
  if (isBackendAvailable === false) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center p-8">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Backend Service Unavailable</h2>
          <p className="text-muted-foreground mb-4">
            The backend server is not running. Please start the backend server first.
          </p>
          <div className="bg-card rounded-lg p-6 max-w-md mx-auto border">
            <h3 className="font-medium mb-3">To start the backend:</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>1. Navigate to the backend directory</div>
              <div>2. Run: <code className="bg-muted px-2 py-1 rounded">uvicorn app.main:app --reload --host 0.0.0.0 --port 8000</code></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Student Attendance Dashboard</h1>
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Enter your Student ID to view attendance details and insights
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try entering a valid Student ID from the database
            </p>
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      {selectedStudent && (
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <StudentProfile student={selectedStudent.profile} />
            </div>
            <div className="lg:col-span-2">
              <AttendanceMetrics attendance={selectedStudent.insights} />
            </div>
          </div>

          {/* Attendance Trend Chart */}
          <AttendanceChart data={selectedStudent.trend} />
        </div>
      )}

      {/* Welcome State */}
      {!selectedStudent && !error && !isLoading && isBackendAvailable && (
        <div className="container mx-auto px-4 pb-8">
          <div className="text-center py-16">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Your Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              Search for a Student ID above to get started
            </p>
            <div className="bg-card rounded-lg p-6 max-w-md mx-auto border">
              <h3 className="font-medium mb-3">Available Student IDs:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>KD22ARINHYDKP010001 - Dhanush J (Art Foundation Basic)</div>
                <div>KD24GTINHYDKP010012 - Sample Student (Hindustani Vocal)</div>
                <div>And many more from the database...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
