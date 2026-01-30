import { useMemo } from 'react';
import { DailyProgress } from '@/types/question';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakCalendarProps {
  progress: DailyProgress[];
}

const StreakCalendar = ({ progress }: StreakCalendarProps) => {
  const calendarData = useMemo(() => {
    const today = new Date();
    const weeks: { date: Date; count: number }[][] = [];
    
    // Go back 52 weeks
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const progressMap = new Map(progress.map(p => [p.date, p.count]));
    
    let currentWeek: { date: Date; count: number }[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      currentWeek.push({
        date: new Date(currentDate),
        count: progressMap.get(dateStr) || 0,
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [progress]);

  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-primary/30';
    if (count <= 3) return 'bg-primary/50';
    if (count <= 5) return 'bg-primary/70';
    return 'bg-primary';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-max">
        {/* Month labels */}
        <div className="mb-2 flex gap-1 pl-8">
          {calendarData.map((week, weekIndex) => {
            if (weekIndex === 0 || week[0]?.date.getDate() <= 7) {
              const month = week[0]?.date.getMonth();
              return (
                <span
                  key={weekIndex}
                  className="w-3 text-xs text-muted-foreground"
                  style={{ marginLeft: weekIndex === 0 ? 0 : undefined }}
                >
                  {month !== undefined ? months[month] : ''}
                </span>
              );
            }
            return <span key={weekIndex} className="w-3" />;
          })}
        </div>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {days.map((day, index) => (
              <span
                key={day}
                className="h-3 text-xs text-muted-foreground"
                style={{ visibility: index % 2 === 1 ? 'visible' : 'hidden' }}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger>
                      <div
                        className={`h-3 w-3 rounded-sm transition-colors ${getIntensityClass(day.count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {day.count} question{day.count !== 1 ? 's' : ''} on{' '}
                        {day.date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted/30" />
            <div className="h-3 w-3 rounded-sm bg-primary/30" />
            <div className="h-3 w-3 rounded-sm bg-primary/50" />
            <div className="h-3 w-3 rounded-sm bg-primary/70" />
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
