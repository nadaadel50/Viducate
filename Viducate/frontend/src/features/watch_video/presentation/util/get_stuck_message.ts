import { StuckReasons, type StuckReason } from "../../domin/entity/stuck_reason";

export const getStuckMessage = (reason: StuckReason):string => {
  switch (reason) {
    case StuckReasons.REPEATED_SEEK:
      return "Noticed you are seeking a lot, need any help?";
    case StuckReasons.SEEK_PAUSE:
      return "Noticed you paused after seeking, need any help?";
    case StuckReasons.TIME_SPENT:
      return "Noticed you are spending a lot of time on this topic, need any help?";
      case StuckReasons.DEAFULT:
      return "Do you need any help";
    
  }
};