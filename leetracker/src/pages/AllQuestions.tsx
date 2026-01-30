import { useState, useEffect, useCallback } from "react";
import { List, Code2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import QuestionTable from "@/components/questions/QuestionTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { questionAPI } from "@/lib/api";
import { Question } from "@/types/question";

const AllQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const loadQuestions = useCallback(async () => {
    try {
      const allQuestions = await questionAPI.getAllQuestions();
      // Remove duplicates by title
      const uniqueMap = new Map<string, Question>();
      allQuestions.forEach((q) => {
        const key = q.title.toLowerCase().trim();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, q);
        }
      });
      setQuestions(Array.from(uniqueMap.values()));
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const totalQuestions = questions.length;
  const completedQuestions = questions.filter((q) => q.completed).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Questions</h1>
          <p className="mt-1 text-muted-foreground">
            All unique questions across all companies (duplicates removed)
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <List className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">
                  Unique Questions
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                <Code2 className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {completedQuestions}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Code2 className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalQuestions - completedQuestions}
                </p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Table */}
        {questions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <List className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No questions yet
              </h3>
              <p className="mt-1 text-muted-foreground">
                Upload CSV files in the Admin page to see questions here
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Click on a checkbox to mark a question as completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionTable
                questions={questions}
                onUpdate={loadQuestions}
                showCompany
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AllQuestions;
