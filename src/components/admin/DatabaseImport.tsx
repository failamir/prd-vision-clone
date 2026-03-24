import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ValidationResult {
  valid: boolean;
  totalStatements: number;
  insertCount: number;
  tables: string[];
  errors: string[];
}

interface ImportResult {
  success: boolean;
  message: string;
  successCount: number;
  skipCount: number;
  errorCount: number;
  errors: string[];
}

async function invokeImport(body: Record<string, unknown>) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-database`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Import failed");
  }
  return res.json();
}

export default function DatabaseImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sqlContent, setSqlContent] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".sql")) {
      toast.error("Hanya file .sql yang didukung");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File terlalu besar (max 50MB)");
      return;
    }

    setFileName(file.name);
    setValidation(null);
    setImportResult(null);

    const text = await file.text();
    setSqlContent(text);

    // Auto-validate
    setValidating(true);
    try {
      const result = await invokeImport({ action: "validate", sql: text });
      setValidation(result);
    } catch (err: any) {
      toast.error("Validation error: " + err.message);
    } finally {
      setValidating(false);
    }
  };

  const handleImport = async () => {
    if (!sqlContent) return;

    setImporting(true);
    setImportResult(null);
    try {
      const result = await invokeImport({ action: "execute", sql: sqlContent });
      setImportResult(result);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    } catch (err: any) {
      toast.error("Import error: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setFileName(null);
    setSqlContent(null);
    setValidation(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Import Database</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Upload file <code>.sql</code> dari backup untuk me-restore data. Hanya
        statement <code>INSERT</code> yang diizinkan untuk keamanan.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".sql"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!fileName ? (
        <Button
          variant="outline"
          className="w-full h-24 border-dashed border-2 flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="w-8 h-8 text-muted-foreground" />
          <span className="text-muted-foreground">
            Klik untuk upload file .sql
          </span>
        </Button>
      ) : (
        <div className="space-y-4">
          {/* File info */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <FileUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{fileName}</span>
              {sqlContent && (
                <Badge variant="secondary" className="text-xs">
                  {(sqlContent.length / 1024).toFixed(0)} KB
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              Ganti file
            </Button>
          </div>

          {/* Validating */}
          {validating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Memvalidasi file SQL...
            </div>
          )}

          {/* Validation result */}
          {validation && (
            <div
              className={`p-4 rounded-lg border ${
                validation.valid
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {validation.valid ? (
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className="font-semibold text-sm">
                  {validation.valid ? "Validasi berhasil" : "Validasi gagal"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                <div>
                  Total statements:{" "}
                  <strong>{validation.totalStatements}</strong>
                </div>
                <div>
                  INSERT statements: <strong>{validation.insertCount}</strong>
                </div>
              </div>
              {validation.tables.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Tabel: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {validation.tables.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {validation.errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {validation.errors.map((err, i) => (
                    <p
                      key={i}
                      className="text-xs text-destructive font-mono break-all"
                    >
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Import button */}
          {validation?.valid && !importResult && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleImport}
                disabled={importing}
                className="flex-1"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Jalankan Import ({validation.insertCount} statements)
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Import progress */}
          {importing && (
            <div className="space-y-2">
              <Progress value={undefined} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Mengeksekusi SQL statements...
              </p>
            </div>
          )}

          {/* Import result */}
          {importResult && (
            <div
              className={`p-4 rounded-lg border ${
                importResult.success
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-orange-500/30 bg-orange-500/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {importResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                )}
                <span className="font-semibold text-sm">
                  {importResult.message}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 rounded bg-green-500/10">
                  <div className="text-lg font-bold text-green-600">
                    {importResult.successCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Berhasil</div>
                </div>
                <div className="text-center p-2 rounded bg-muted">
                  <div className="text-lg font-bold text-muted-foreground">
                    {importResult.skipCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Dilewati</div>
                </div>
                <div className="text-center p-2 rounded bg-destructive/10">
                  <div className="text-lg font-bold text-destructive">
                    {importResult.errorCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Error</div>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                  {importResult.errors.map((err, i) => (
                    <p
                      key={i}
                      className="text-xs text-destructive font-mono break-all"
                    >
                      {err}
                    </p>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="mt-3"
              >
                Import file lain
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
