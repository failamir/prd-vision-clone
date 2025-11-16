import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Database, Copy } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function DatabaseToggle() {
  const { currentDatabase, switchDatabase, duplicateToSecondary } = useDatabase();
  const { toast } = useToast();
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleSwitch = (checked: boolean) => {
    const newDb = checked ? 'secondary' : 'primary';
    switchDatabase(newDb);
    toast({
      title: "Database Switched",
      description: `Now using ${newDb} database`,
    });
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      await duplicateToSecondary();
      toast({
        title: "Data Duplicated",
        description: "All data has been copied to secondary database",
      });
    } catch (error) {
      toast({
        title: "Duplication Failed",
        description: "Error copying data to secondary database",
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <Label htmlFor="db-toggle" className="text-base font-medium">
              Database: {currentDatabase === 'primary' ? 'Primary' : 'Secondary'}
            </Label>
          </div>
          <Switch
            id="db-toggle"
            checked={currentDatabase === 'secondary'}
            onCheckedChange={handleSwitch}
          />
        </div>

        <Button
          onClick={handleDuplicate}
          disabled={isDuplicating}
          variant="outline"
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          {isDuplicating ? 'Duplicating...' : 'Duplicate to Secondary'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Toggle to switch between primary and secondary database. Use duplicate button to copy all data from primary to secondary.
        </p>
      </div>
    </Card>
  );
}
