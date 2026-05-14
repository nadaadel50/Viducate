// import { getStuckMessage } from "../util/get_stuck_message";
// import { getRandomStuckQuestion } from "../util/get_stuck_question";
// import { getClosestSubTopic } from "../util/get_subtopic";
// import { StuckPopup } from "./video_widgets/stuck_popup";

// export function StuckPopUp(){
//     return(<StuckPopup
//     reason={getStuckMessage(stuckReason)}
//     onHelp={() => {
//       openChat();
//       const subtopic = getClosestSubTopic(
//         selectedTopic?.sub_topics ?? [],
//         currentTime,
//       );
//       console.log("currentTime =", currentTime);
//      console.log("typeof currentTime =", typeof currentTime);  
//       const question=getRandomStuckQuestion(subtopic?.name??"",currentTime)

//       setUserInput(question);
//       setShowPopup(false);
//     }}
//     onDismiss={() => setShowPopup(false)}
//   />)
// }