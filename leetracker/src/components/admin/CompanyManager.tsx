import { useState, useEffect } from "react";
import { Trash2, Building2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { questionAPI } from "@/lib/api";
import { CompanyData } from "@/types/question";
import { toast } from "sonner";

interface CompanyManagerProps {
  refreshKey: number;
  onUpdate: () => void;
}

const CompanyManager = ({ refreshKey, onUpdate }: CompanyManagerProps) => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await questionAPI.getAllCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to load companies:", error);
      }
    };
    loadCompanies();
  }, [refreshKey]);

  const handleDeleteCompany = async (name: string) => {
    try {
      await questionAPI.deleteCompanyQuestions(name);
      onUpdate();
      toast.success(`${name} has been deleted`);
    } catch (error) {
      console.error("Failed to delete company:", error);
      toast.error("Failed to delete company");
    }
  };

  const handleClearAll = async () => {
    try {
      // Delete all companies
      await Promise.all(
        companies.map((c) => questionAPI.deleteCompanyQuestions(c.name)),
      );
      onUpdate();
      toast.success("All data has been cleared");
    } catch (error) {
      console.error("Failed to clear all data:", error);
      toast.error("Failed to clear all data");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Manage Companies
            </CardTitle>
            <CardDescription>
              View and delete uploaded company data.
            </CardDescription>
          </div>
          {companies.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all uploaded questions and
                    progress data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">
              No companies uploaded yet
            </p>
            <p className="text-sm text-muted-foreground/80">
              Upload a CSV file to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {company.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{company.totalQuestions} questions</span>
                      <span>•</span>
                      <span>{company.completedQuestions} completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden gap-1 sm:flex">
                    <Badge
                      variant="outline"
                      className="border-chart-1/50 text-chart-1"
                    >
                      {company.easyCount} Easy
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-chart-3/50 text-chart-3"
                    >
                      {company.mediumCount} Med
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-destructive/50 text-destructive"
                    >
                      {company.hardCount} Hard
                    </Badge>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete {company.name}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all{" "}
                          {company.totalQuestions} questions for {company.name}.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCompany(company.name)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyManager;
