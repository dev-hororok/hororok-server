export interface DailySummary {
  date: string;
  totalSeconds: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalSeconds: number;
  uniqueStudyDays: number;
}

export interface HeatMapData {
  date: string;
  totalSeconds: number;
}
