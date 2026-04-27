import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mock-data";

export function RecentUsersCard() {
  const recentUsers = mockUsers.slice(0, 5);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-base">Recent Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-xs text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge
              variant={user.status === "active" ? "success" : "secondary"}
              className="text-xs capitalize"
            >
              {user.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
