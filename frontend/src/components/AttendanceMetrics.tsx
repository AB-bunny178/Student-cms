import { Calendar, CheckCircle, Percent, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttendanceInsights } from "@/lib/api";

interface AttendanceMetricsProps {
  attendance: AttendanceInsights;
}

const AttendanceMetrics = ({ attendance }: AttendanceMetricsProps) => {
  const getStatusInfo = (percentage: number) => {
    if (percentage >= 85) return { status: "Excellent", variant: "success" as const, icon: "✅" };
    if (percentage >= 75) return { status: "Good", variant: "success" as const, icon: "✅" };
    if (percentage >= 65) return { status: "Warning", variant: "warning" as const, icon: "⚠️" };
    return { status: "Critical", variant: "destructive" as const, icon: "🚨" };
  };

  const statusInfo = getStatusInfo(attendance.attendance_percentage);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No attendance";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Classes
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{attendance.total_classes_allotted}</div>
          <p className="text-xs text-muted-foreground mt-1">Allotted from package</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Classes Attended
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{attendance.total_classes_attended}</div>
          <p className="text-xs text-muted-foreground mt-1">Classes completed</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Attendance Rate
          </CardTitle>
          <Percent className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{attendance.attendance_percentage}%</div>
            <Badge variant={statusInfo.variant} className="text-xs">
              {statusInfo.icon} {attendance.attendance_percentage >= 75 ? "On track" : attendance.attendance_percentage >= 60 ? "Borderline" : "Low attendance"}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                attendance.attendance_percentage >= 75 
                  ? 'bg-gradient-success' 
                  : attendance.attendance_percentage >= 60 
                  ? 'bg-gradient-warning' 
                  : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(attendance.attendance_percentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Last Attended
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatDate(attendance.last_attended_date)}</div>
          <p className="text-xs text-muted-foreground mt-1">Most recent class</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceMetrics;