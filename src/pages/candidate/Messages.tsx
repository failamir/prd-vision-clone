import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Inbox } from "lucide-react";

export default function Messages() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your messages
          </p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              You don't have any messages at the moment. Check back later for updates from recruiters.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
