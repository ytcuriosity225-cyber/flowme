// Legacy memoryStore removed to avoid type conflicts with Supabase schema.
// All logs are now persisted to the database.
export const memoryStore = {
  getAllLogs: () => [],
  getLogByDate: () => null,
  saveLog: () => {},
  resetAll: () => {},
};
