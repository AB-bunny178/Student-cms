import { Calendar, GraduationCap, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProfile as StudentProfileType } from "@/lib/api";

interface StudentProfileProps {
  student: StudentProfileType;
}

const StudentProfile = ({ student }: StudentProfileProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5" />
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm opacity-90 mb-1">Student ID</div>
            <div className="text-lg font-semibold">{student.student_id}</div>
          </div>
          
          <div>
            <div className="text-sm opacity-90 mb-1">Student Name</div>
            <div className="text-lg font-semibold">{student.name}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 opacity-90" />
            <div>
              <div className="text-sm opacity-90">Course Category</div>
              <div className="font-medium">{student.course}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-90" />
            <div>
              <div className="text-sm opacity-90">Date of Joining</div>
              <div className="font-medium">{formatDate(student.date_of_joining)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfile;