import { useState } from "react";
import { ExternalLink, Check, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Question } from "@/types/question";
import { progressAPI } from "@/lib/api";

interface QuestionTableProps {
  questions: Question[];
  onUpdate: () => void;
  showCompany?: boolean;
}

const QuestionTable = ({
  questions,
  onUpdate,
  showCompany = false,
}: QuestionTableProps) => {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [completedFilter, setCompletedFilter] = useState<string>("all");

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty =
      difficultyFilter === "all" || q.difficulty === difficultyFilter;
    const matchesCompleted =
      completedFilter === "all" ||
      (completedFilter === "completed" && q.completed) ||
      (completedFilter === "pending" && !q.completed);

    return matchesSearch && matchesDifficulty && matchesCompleted;
  });

  const handleToggleComplete = async (id: string) => {
    try {
      await progressAPI.toggleComplete(id);
      onUpdate();
    } catch (error) {
      console.error("Failed to toggle question completion:", error);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return (
          <Badge
            variant="outline"
            className="border-chart-1/50 text-chart-1 bg-chart-1/10"
          >
            Easy
          </Badge>
        );
      case "Medium":
        return (
          <Badge
            variant="outline"
            className="border-chart-3/50 text-chart-3 bg-chart-3/10"
          >
            Medium
          </Badge>
        );
      case "Hard":
        return (
          <Badge
            variant="outline"
            className="border-destructive/50 text-destructive bg-destructive/10"
          >
            Hard
          </Badge>
        );
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search questions or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={completedFilter} onValueChange={setCompletedFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredQuestions.length} of {questions.length} questions
      </p>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">Done</TableHead>
                <TableHead>Title</TableHead>
                {showCompany && (
                  <TableHead className="hidden md:table-cell">
                    Company
                  </TableHead>
                )}
                <TableHead className="hidden sm:table-cell">
                  Difficulty
                </TableHead>
                <TableHead className="hidden lg:table-cell">Topics</TableHead>
                <TableHead className="hidden md:table-cell">
                  Acceptance
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Frequency
                </TableHead>
                <TableHead className="w-12">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow
                  key={question.id}
                  className={question.completed ? "bg-chart-1/5" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={question.completed}
                      onCheckedChange={() => handleToggleComplete(question.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${question.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                      >
                        {question.title}
                      </span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {question.difficulty}
                      </span>
                    </div>
                  </TableCell>
                  {showCompany && (
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{question.company}</Badge>
                    </TableCell>
                  )}
                  <TableCell className="hidden sm:table-cell">
                    {getDifficultyBadge(question.difficulty)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {question.topics.slice(0, 3).map((topic, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {question.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{question.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {question.acceptanceRate > 0
                      ? `${question.acceptanceRate}%`
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {question.frequency > 0
                      ? question.frequency.toFixed(1)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {question.link && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={question.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredQuestions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={showCompany ? 8 : 7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No questions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default QuestionTable;
