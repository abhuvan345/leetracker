import { Link } from 'react-router-dom';
import { Building2, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CompanyData } from '@/types/question';

interface CompanyCardProps {
  company: CompanyData;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const completionPercentage = company.totalQuestions > 0 
    ? Math.round((company.completedQuestions / company.totalQuestions) * 100)
    : 0;

  return (
    <Link to={`/company/${encodeURIComponent(company.name)}`}>
      <Card className="group cursor-pointer border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {company.totalQuestions} questions
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {company.completedQuestions}/{company.totalQuestions} ({completionPercentage}%)
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Difficulty breakdown */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-chart-1/50 text-chart-1 bg-chart-1/10">
              Easy: {company.easyCount}
            </Badge>
            <Badge variant="outline" className="border-chart-3/50 text-chart-3 bg-chart-3/10">
              Medium: {company.mediumCount}
            </Badge>
            <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">
              Hard: {company.hardCount}
            </Badge>
          </div>

          {/* Completion status */}
          <div className="flex items-center gap-2 text-sm">
            {completionPercentage === 100 ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-chart-1" />
                <span className="text-chart-1">All completed!</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {company.totalQuestions - company.completedQuestions} remaining
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompanyCard;
