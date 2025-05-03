// Define the shap of a log entry
export interface LogEntryMeta {
  slug: string;
  status: '✅ Pass' | '💥 Fail' | '⚠️ Attempted';
  approach: string;
  starred: boolean;
}

// export interface LogEntry extends LogEntryInput {
//   title: string;
// }
export interface ProblemMeta {
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  url: string;
}
