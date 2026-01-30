import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Target, Code2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import QuestionTable from "@/components/questions/QuestionTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { questionAPI } from "@/lib/api";
import { CompanyData, Question } from "@/types/question";

const CompanyQuestions = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const [company, setCompany] = useState<CompanyData | null>(null);

  const loadData = useCallback(async () => {
    try {
      const decodedName = decodeURIComponent(companyName || "");
      const questions = await questionAPI.getQuestionsByCompany(decodedName);

      // Calculate stats from questions
      const companyData: CompanyData = {
        name: decodedName,
        questions,
        totalQuestions: questions.length,
        completedQuestions: questions.filter((q) => q.completed).length,
        easyCount: questions.filter((q) => q.difficulty === "Easy").length,
        mediumCount: questions.filter((q) => q.difficulty === "Medium").length,
        hardCount: questions.filter((q) => q.difficulty === "Hard").length,
      };

      setCompany(companyData);
    } catch (error) {
      console.error("Failed to load company questions:", error);
      setCompany(null);
    }
  }, [companyName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!company) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Company not found
          </h2>
          <p className="mt-1 text-muted-foreground">
            The company you're looking for doesn't exist
          </p>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const completionPercentage =
    company.totalQuestions > 0
      ? Math.round((company.completedQuestions / company.totalQuestions) * 100)
      : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {company.name}
              </h1>
              <p className="text-muted-foreground">
                {company.totalQuestions} questions total
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {company.totalQuestions}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Questions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                  <Target className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {company.completedQuestions}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Breakdown */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <Badge
                variant="outline"
                className="border-chart-1/50 text-chart-1 bg-chart-1/10 px-3 py-1"
              >
                Easy: {company.easyCount}
              </Badge>
              <Badge
                variant="outline"
                className="border-chart-3/50 text-chart-3 bg-chart-3/10 px-3 py-1"
              >
                Medium: {company.mediumCount}
              </Badge>
              <Badge
                variant="outline"
                className="border-destructive/50 text-destructive bg-destructive/10 px-3 py-1"
              >
                Hard: {company.hardCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Mark questions as completed to track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionTable questions={company.questions} onUpdate={loadData} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyQuestions;
