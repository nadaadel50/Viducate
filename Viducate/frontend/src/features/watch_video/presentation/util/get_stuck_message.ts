import { StuckReasons, type StuckReason } from "../types/stuck_reason";

export const getStuckMessage = (reason: StuckReason): string => {
  switch (reason) {
    case StuckReasons.REPEATED_SEEK:
      return "watch.stuck.repeatedSeek";

    case StuckReasons.SEEK_PAUSE:
      return "watch.stuck.seekPause";

    case StuckReasons.TIME_SPENT:
      return "watch.stuck.timeSpent";

    case StuckReasons.DEAFULT:
    default:
      return "watch.stuck.default";
  }
};
