import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { questionAPI } from "@/lib/api";
import { toast } from "sonner";

interface FileUpload {
  file: File;
  status: "pending" | "success" | "error";
  questionsCount?: number;
  error?: string;
}

interface CSVUploaderProps {
  onUploadComplete: () => void;
}

const CSVUploader = ({ onUploadComplete }: CSVUploaderProps) => {
  const [companyName, setCompanyName] = useState("");
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv"),
    );

    if (droppedFiles.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...droppedFiles.map((file) => ({ file, status: "pending" as const })),
      ]);
    } else {
      toast.error("Please upload CSV files only");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      setFiles((prev) => [
        ...prev,
        ...selectedFiles.map((file) => ({ file, status: "pending" as const })),
      ]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const processFiles = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    if (files.length === 0) {
      toast.error("Please add at least one CSV file");
      return;
    }

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await questionAPI.uploadQuestions(
          files[i].file,
          companyName.trim(),
        );

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "success",
                  questionsCount: result.inserted,
                }
              : f,
          ),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload file";
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: errorMessage } : f,
          ),
        );
      }
    }

    setIsUploading(false);

    const successCount = files.filter((f) => f.status === "success").length;
    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded for ${companyName}`);
      onUploadComplete();
    }
  };

  const resetForm = () => {
    setCompanyName("");
    setFiles([]);
  };

  const allProcessed =
    files.length > 0 && files.every((f) => f.status !== "pending");
  const hasSuccess = files.some((f) => f.status === "success");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Questions
        </CardTitle>
        <CardDescription>
          Upload CSV files containing LeetCode questions for a specific company.
          You can upload multiple files at once.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Name Input */}
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            placeholder="e.g., Google, Amazon, Meta..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {/* Drop Zone */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
            disabled={isUploading}
          />
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <label
                htmlFor="csv-upload"
                className="cursor-pointer text-primary hover:underline"
              >
                Click to upload
              </label>
              <span className="text-muted-foreground"> or drag and drop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              CSV files only. Multiple files supported.
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files ({files.length})</Label>
            <div className="space-y-2">
              {files.map((fileUpload, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    fileUpload.status === "success"
                      ? "border-chart-1/50 bg-chart-1/5"
                      : fileUpload.status === "error"
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {fileUpload.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(fileUpload.file.size / 1024).toFixed(1)} KB
                        {fileUpload.questionsCount && (
                          <span className="text-chart-1">
                            {" "}
                            • {fileUpload.questionsCount} questions
                          </span>
                        )}
                        {fileUpload.error && (
                          <span className="text-destructive">
                            {" "}
                            • {fileUpload.error}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {fileUpload.status === "success" && (
                      <Badge
                        variant="outline"
                        className="border-chart-1/50 text-chart-1 bg-chart-1/10"
                      >
                        <Check className="mr-1 h-3 w-3" /> Done
                      </Badge>
                    )}
                    {fileUpload.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" /> Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!allProcessed ? (
            <Button
              onClick={processFiles}
              disabled={
                isUploading || files.length === 0 || !companyName.trim()
              }
              className="flex-1"
            >
              {isUploading ? "Processing..." : "Upload Questions"}
            </Button>
          ) : (
            <Button onClick={resetForm} className="flex-1">
              Upload More
            </Button>
          )}
        </div>

        {/* CSV Format Help */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">
            Expected CSV Format:
          </h4>
          <p className="text-xs text-muted-foreground">
            Your CSV should have headers:{" "}
            <code className="rounded bg-background px-1 py-0.5">
              Difficulty, Title, Frequency, Acceptance Rate, Link, Topics,
              Completed
            </code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;
