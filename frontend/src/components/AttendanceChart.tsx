import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { AttendancePoint } from "@/lib/api";

interface AttendanceChartProps {
  data: AttendancePoint[];
}

const AttendanceChart = ({ data }: AttendanceChartProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Attendance Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full flex items-center justify-center">
            <p>No attendance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare cumulative percentage
  const chartData = data.map((point, idx) => {
    const attendedCount = data.slice(0, idx + 1).reduce((sum, p) => sum + p.attended, 0);
    const cumulativePercentage = ((attendedCount / (idx + 1)) * 100).toFixed(1);
    return {
      date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      daily: point.attended,
      cumulative: parseFloat(cumulativePercentage),
    };
  });

  return (
    <Card className="col-span-full border-2 hover:shadow-md transition-shadows">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Attendance Trend Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your attendance pattern over time
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 1]} tickFormatter={(v) => (v === 1 ? 'Present' : 'Absent')} />
              <Tooltip />
              <Bar dataKey="daily" fill="hsl(var(--chart-primary))" name="Daily Attendance" />
              <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--chart-secondary))" name="Cumulative %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
