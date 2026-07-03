export const StuckReasons = {
  DEAFULT: "",
  REPEATED_SEEK: "repeated_seek",
  SEEK_PAUSE: "seek_pause",
  TIME_SPENT: "time_spent",
} as const;

export type StuckReason = (typeof StuckReasons)[keyof typeof StuckReasons];
