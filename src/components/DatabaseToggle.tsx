import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Database, Copy, Download } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function DatabaseToggle() {
  const { currentDatabase, switchDatabase, duplicateToSecondary, importFromOldProject } = useDatabase();
  const { toast } = useToast();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const results = await importFromOldProject();
      const successCount = results.filter(r => r.count > 0).length;
      const totalRecords = results.reduce((sum, r) => sum + r.count, 0);
      
      toast({
        title: "Import Complete",
        description: `Imported ${totalRecords} records from ${successCount} tables`,
      });
      
      console.log('Import results:', results);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Error importing data from old project",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <Label htmlFor="db-toggle" className="text-base font-medium">
              Database: {currentDatabase === 'primary' ? 'Primary (New)' : 'Secondary (Old)'}
            </Label>
          </div>
          <Switch
            id="db-toggle"
            checked={currentDatabase === 'secondary'}
            onCheckedChange={handleSwitch}
          />
        </div>

        <Button
          onClick={handleImport}
          disabled={isImporting}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isImporting ? 'Importing...' : 'Import dari Project Lama'}
        </Button>

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
          Klik "Import dari Project Lama" untuk mengambil data skills, jobs, testimonials dari project sebelumnya.
        </p>
      </div>
    </Card>
  );
}
