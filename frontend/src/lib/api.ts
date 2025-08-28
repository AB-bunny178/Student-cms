const API_BASE_URL = import.meta.env.VITE_API_BASE;

export interface StudentProfile {
  student_id: string;
  name: string;
  course: string;
  date_of_joining: string;
}

export interface AttendanceInsights {
  total_classes_allotted: number;
  total_classes_attended: number;
  attendance_percentage: number;
  last_attended_date: string | null;
  status: string;
}

export interface AttendancePoint {
  date: string;
  attended: number;
}

export interface StudentAttendanceResponse {
  profile: StudentProfile;
  insights: AttendanceInsights;
  trend: AttendancePoint[];
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async getStudentAttendance(studentId: string): Promise<StudentAttendanceResponse> {
    const response = await fetch(`${API_BASE_URL}/attendance/${encodeURIComponent(studentId)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(404, 'Student not found. Please check the Student ID and try again.');
      }
      throw new ApiError(response.status, 'Failed to fetch student data. Please try again.');
    }

    return response.json();
  },

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Backend service is not available.');
    }
    return response.json();
  }
};
