import { toPng } from "html-to-image";

export async function downloadMindMap() {
  const element = document.querySelector(".react-flow") as HTMLElement;

  if (!element) return;

  const dataUrl = await toPng(element, {
    backgroundColor: "#ffffff",

    pixelRatio: 5, 

    cacheBust: true,
  });

  const link = document.createElement("a");

  link.download = "mindmap.png";

  link.href = dataUrl;

  link.click();
}
