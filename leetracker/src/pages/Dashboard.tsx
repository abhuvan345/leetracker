import { useState, useEffect } from "react";
import { Building2, Code2, Flame, Target, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import CompanyCard from "@/components/dashboard/CompanyCard";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionAPI, progressAPI } from "@/lib/api";
import { CompanyData, DailyProgress } from "@/types/question";

const Dashboard = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companiesData, progressData, stats] = await Promise.all([
          questionAPI.getAllCompanies(),
          progressAPI.getDailyProgress(),
          progressAPI.getStats(),
        ]);

        setCompanies(companiesData);
        setProgress(progressData);
        setStreak(stats.currentStreak);
        setTotalQuestions(stats.totalQuestions);
        setCompletedQuestions(stats.completedQuestions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadData();
  }, []);

  const completionRate =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Track your LeetCode progress across different companies
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Current Streak"
            value={streak}
            subtitle="consecutive days"
            icon={<Flame className="h-8 w-8" />}
            variant="warning"
          />
          <StatsCard
            title="Total Questions"
            value={totalQuestions}
            subtitle="across all companies"
            icon={<Code2 className="h-8 w-8" />}
          />
          <StatsCard
            title="Completed"
            value={completedQuestions}
            subtitle={`${completionRate}% done`}
            icon={<Target className="h-8 w-8" />}
            variant="success"
          />
          <StatsCard
            title="Companies"
            value={companies.length}
            subtitle="tracked"
            icon={<Building2 className="h-8 w-8" />}
            variant="primary"
          />
        </div>

        {/* Streak Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakCalendar progress={progress} />
          </CardContent>
        </Card>

        {/* Company Cards */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Companies
          </h2>
          {companies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No companies yet
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Head to the Admin page to upload your first company's
                  questions
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.name} company={company} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
