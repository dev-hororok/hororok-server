export interface DailySummary {
  date: string;
  totalSeconds: number;
  totalCompleted: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalSeconds: number;
  totalCompleted: number;
  uniqueStudyDays: number;
}

export interface HeatMapData {
  date: string;
  totalSeconds: number;
  totalCompleted: number;
}
