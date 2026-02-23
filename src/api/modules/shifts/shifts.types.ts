/**
 * Shifts module types
 */

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  type: "whole_day" | "hourly";
  isActive: boolean;
  createdAt: string;
}
