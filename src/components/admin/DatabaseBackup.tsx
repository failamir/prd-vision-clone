import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Download, Trash2, RefreshCw, HardDrive, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface BackupFile {
  name: string;
  created_at: string;
  metadata: { size: number } | null;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

async function invokeBackup(action: string, extra?: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/backup-database`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ action, ...extra }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Backup failed");
  }
  return res.json();
}

export default function DatabaseBackup() {
  const queryClient = useQueryClient();
  const [converting, setConverting] = useState<string | null>(null);

  const { data: backups, isLoading } = useQuery({
    queryKey: ["database-backups"],
    queryFn: () => invokeBackup("list"),
    select: (d) => (d.backups as BackupFile[]).filter((f) => f.name.endsWith(".sql")),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: () => invokeBackup("create"),
    onSuccess: (data) => {
      toast.success(`Backup selesai! ${data.totalRows} rows, ${data.authUsers} users`);
      queryClient.invalidateQueries({ queryKey: ["database-backups"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (sqlName: string) => {
      const jsonName = sqlName.replace(".sql", ".json");
      await invokeBackup("delete", { fileName: sqlName });
      await invokeBackup("delete", { fileName: jsonName }).catch(() => {});
    },
    onSuccess: () => {
      toast.success("Backup dihapus");
      queryClient.invalidateQueries({ queryKey: ["database-backups"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleDownloadSQL = async (fileName: string) => {
    try {
      const data = await invokeBackup("download", { fileName });
      window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDownloadExcel = async (sqlFileName: string) => {
    const jsonName = sqlFileName.replace(".sql", ".json");
    setConverting(sqlFileName);
    try {
      const urlData = await invokeBackup("download", { fileName: jsonName });
      const res = await fetch(urlData.url);
      const json = await res.json();

      const wb = XLSX.utils.book_new();
      for (const [table, rows] of Object.entries(json.tables || {})) {
        if (Array.isArray(rows) && rows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.book_append_sheet(wb, ws, table.slice(0, 31));
        }
      }
      if (json.authUsers > 0) {
        // Auth users not in JSON tables, just add summary
        const ws = XLSX.utils.json_to_sheet([{ info: `${json.authUsers} auth users exported in SQL file` }]);
        XLSX.utils.book_append_sheet(wb, ws, "auth_users_info");
      }
      XLSX.writeFile(wb, sqlFileName.replace(".sql", ".xlsx"));
      toast.success("Excel berhasil didownload");
    } catch (e: any) {
      toast.error("Gagal convert ke Excel: " + e.message);
    } finally {
      setConverting(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Database Backup</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["database-backups"] })}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <HardDrive className="w-4 h-4 mr-1" />
            )}
            {createMutation.isPending ? "Backing up..." : "Create Backup"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !backups || backups.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          Belum ada backup. Klik "Create Backup" untuk membuat backup pertama.
        </p>
      ) : (
        <div className="space-y-2">
          {backups.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(file.created_at), "dd MMM yyyy, HH:mm")}
                    </span>
                    {file.metadata?.size && (
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(file.metadata.size)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleDownloadSQL(file.name)} title="Download SQL">
                  <Download className="w-4 h-4" />
                  <span className="text-xs ml-1">SQL</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadExcel(file.name)}
                  disabled={converting === file.name}
                  title="Download Excel"
                >
                  {converting === file.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span className="text-xs ml-1">Excel</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(file.name)}
                  disabled={deleteMutation.isPending}
                  className="text-destructive hover:text-destructive"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
