import type { User } from "@/types/db/user";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Award, CheckCircle2 } from "lucide-react";

interface UserStatsProps {
  user: User;
}

export function UserStats({ user }: UserStatsProps) {
  const stats = [
    {
      label: "Total Courses",
      value: user.totalCourses,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Rating",
      value: (user.rating ?? 0).toFixed(1),
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      label: "Status",
      value:
        user.status === 0
          ? "Active"
          : user.status === 1
            ? "Inactive"
            : "Pending",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-none shadow-lg bg-card hover:shadow-xl transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-3xl font-black tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
