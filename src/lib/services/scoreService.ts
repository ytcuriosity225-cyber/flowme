import { DayTasks } from '@/types';
import { TASK_DEFINITIONS } from '@/types';

/**
 * Calculate the daily score based on completed tasks.
 * Weights are defined in the task definitions.
 * The score is capped at 100.
 */
export function calculateScore(tasks: DayTasks): number {
  const total = TASK_DEFINITIONS.reduce((sum, def) => {
    return sum + (tasks[def.key] ? def.weight : 0);
  }, 0);
  return Math.min(total, 100);
}
