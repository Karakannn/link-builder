// components/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Globe, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  userCount: number;
  domainCount: number;
  verifiedCount: number;
}

export const StatsCards = ({ userCount, domainCount, verifiedCount }: StatsCardsProps) => {
  const stats = [
    {
      title: "Toplam Kullanıcı",
      value: userCount,
      icon: User
    },
    {
      title: "Toplam Domain",
      value: domainCount,
      icon: Globe
    },
    {
      title: "Doğrulanmış",
      value: verifiedCount,
      icon: CheckCircle
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};