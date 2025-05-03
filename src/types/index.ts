// Define the shap of a log entry
export interface LogEntryMeta {
  slug: string;
  // difficulty: 'Easy' | 'Medium' | 'Hard';
  status: '✅ Pass' | '💥 Fail' | '⚠️ Attempted';
  approach: string;
  // tags: string[];
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
