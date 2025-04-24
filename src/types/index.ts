// Define the shap of a log entry
export interface LogEntryInput {
  dateOption: 'today' | 'yesterday';
  // title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: '✅ Pass' | '💥 Fail';
  approach: string;
  tags: string[];
  starred: boolean;
}

export interface LogEntry extends LogEntryInput {
  title: string;
}
