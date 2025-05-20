5/20
/src
  /commands           # CLI command handlers (e.g. log, show, sync)
    └── log.ts
    └── show.ts
  /repositories       # Data access (e.g. reading/writing to JSON or DB)
    └── logRepository.ts
  /services           # Business logic (e.g. validate input, compute stats)
    └── logService.ts
  /models             # Types/interfaces (e.g. LogEntry, ProblemMeta)
    └── LogEntry.ts
  /utils              # Generic helpers (e.g. createId, formatDate)
    └── createId.ts
  index.ts            # CLI entry point


