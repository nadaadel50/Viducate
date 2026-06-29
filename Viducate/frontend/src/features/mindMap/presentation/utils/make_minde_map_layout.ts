import type { Edge, Node } from "reactflow";

export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
//      A -> B
//      A -> C


// childrenMap = {
//   A: ["B", "C"]
// }

  const childrenMap: Record<string, string[]> = {};

//   parentMap = {
//   B: "A",
//   C: "A"
// }
  const parentMap: Record<string, string> = {};

  edges.forEach((e) => {
    if (!childrenMap[e.source]) childrenMap[e.source] = [];
    childrenMap[e.source].push(e.target);
    parentMap[e.target] = e.source;
  });

  const rootId = nodes.find((n) => !parentMap[n.id])?.id;
  if (!rootId) return { nodes, edges };

  // to store the postions of each node
//   positions = {
//   A: { x: 100, y: 200 }
// }

  const positions: Record<string, { x: number; y: number }> = {};

//   level 0 -> radius 0
// level 1 -> radius 550
// level 2 -> radius 950   each level is cirular with bigger redius so the nodes don't overlap

    //       level2

    // level1   ROOT   level1

    //       level2
   const radiusPerLevel = [0, 500, 900, 1300];
  //const radiusPerLevel = [0, 300, 550, 800];

  function placeNodes(
    nodeId: string,
    level: number,
    angleStart: number,
    angleEnd: number,
   

  ) {
    const radius = radiusPerLevel[level] ?? level * 320;
    const angle = (angleStart + angleEnd) / 2;

    positions[nodeId] = {
      x:  radius * Math.cos(angle),
      y:  radius * Math.sin(angle),
    };

    //ex:
    // radius = 100
    // angle = 0
    //  then
    // x = 100
    // y = 0
    // result: nodes will be placed in a circle around the root node

    const children = childrenMap[nodeId] ?? [];
    if (children.length === 0) return;

    // divide the andle range for the children based on how many children there are
    // ex:
    // 0 → 180
    // 2 children
    // 0 → 90
    // 90 → 180

    const angleStep = (angleEnd - angleStart) / children.length;
    children.forEach((childId, i) => {
      placeNodes(
        childId,
        level + 1,
        angleStart + i * angleStep,
        angleStart + (i + 1) * angleStep,
       
      );
    });  // first child  i=0 then angle(0,120)  i=1 then angle(120,240) i=2 then angle(240,360)
  }

  placeNodes(rootId, 0, 0, 2 * Math.PI); // dfs recursive
 


console.log("positions:", JSON.stringify(positions, null, 2));

 
  function getHandle(fromPos: { x: number; y: number }, toPos: { x: number; y: number }) {
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 → 180

    // -45 → 45   = يمين
    // 45  → 135  = تحت
    // -135 → -45 = فوق
    // غير كده    = شمال
    if (angle >= -45 && angle < 45)   return { source: "right",  target: "left"   };
    if (angle >= 45  && angle < 135)  return { source: "bottom", target: "top"    };
    if (angle >= -135 && angle < -45) return { source: "top",    target: "bottom" };
    return                                   { source: "left",   target: "right"  };
  }

  const layoutedNodes = nodes.map((node) => ({
    ...node,
    position: positions[node.id] ?? { x: 0, y: 0 },
  }));

  
  const layoutedEdges = edges.map((edge) => {
    const sourcePos = positions[edge.source];
    const targetPos = positions[edge.target];

    if (!sourcePos || !targetPos) return edge;

    const { source, target } = getHandle(sourcePos, targetPos);

    return {
      ...edge,
      sourceHandle: source,
      targetHandle: target,
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}


// import type { Edge, Node } from "reactflow";

// export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
//   const childrenMap: Record<string, string[]> = {};
//   const parentMap: Record<string, string> = {};

//   edges.forEach((e) => {
//     if (!childrenMap[e.source]) childrenMap[e.source] = [];
//     childrenMap[e.source].push(e.target);
//     parentMap[e.target] = e.source;
//   });

//   const rootId = nodes.find((n) => !parentMap[n.id])?.id;
//   if (!rootId) return { nodes, edges };

//   // ✅ احسب عدد الـ leaves تحت كل node عشان توزع المساحة بشكل عادل
//   const leafCount: Record<string, number> = {};

//   function countLeaves(nodeId: string): number {
//     const children = childrenMap[nodeId] ?? [];
//     if (children.length === 0) {
//       leafCount[nodeId] = 1;
//       return 1;
//     }
//     const total = children.reduce((sum, child) => sum + countLeaves(child), 0);
//     leafCount[nodeId] = total;
//     return total;
//   }

//   countLeaves(rootId);

//   const positions: Record<string, { x: number; y: number }> = {};
//   const radiusPerLevel = [0, 500, 900, 1300];

//   function placeNodes(
//     nodeId: string,
//     level: number,
//     angleStart: number,
//     angleEnd: number,
//   ) {
//     const radius = radiusPerLevel[level] ?? level * 320;
//     const angle = (angleStart + angleEnd) / 2;

//     positions[nodeId] = {
//       x: radius * Math.cos(angle),
//       y: radius * Math.sin(angle),
//     };

//     const children = childrenMap[nodeId] ?? [];
//     if (children.length === 0) return;

//     const totalLeaves = leafCount[nodeId] ?? 1;

//     // ✅ كل child بياخد مساحة بناءً على عدد الـ leaves بتاعته مش بالتساوي
//     let currentAngle = angleStart;
//     children.forEach((childId) => {
//       const childLeaves = leafCount[childId] ?? 1;
//       const childAngleShare = (childLeaves / totalLeaves) * (angleEnd - angleStart);

//       placeNodes(
//         childId,
//         level + 1,
//         currentAngle,
//         currentAngle + childAngleShare,
//       );

//       currentAngle += childAngleShare;
//     });
//   }

//   placeNodes(rootId, 0, 0, 2 * Math.PI);

//   function getHandle(
//     fromPos: { x: number; y: number },
//     toPos: { x: number; y: number }
//   ) {
//     const dx = toPos.x - fromPos.x;
//     const dy = toPos.y - fromPos.y;
//     const angle = Math.atan2(dy, dx) * (180 / Math.PI);

//     if (angle >= -45 && angle < 45)   return { source: "right",  target: "left"   };
//     if (angle >= 45  && angle < 135)  return { source: "bottom", target: "top"    };
//     if (angle >= -135 && angle < -45) return { source: "top",    target: "bottom" };
//     return                                   { source: "left",   target: "right"  };
//   }

//   const layoutedNodes = nodes.map((node) => ({
//     ...node,
//     position: positions[node.id] ?? { x: 0, y: 0 },
//   }));

//   const layoutedEdges = edges.map((edge) => {
//     const sourcePos = positions[edge.source];
//     const targetPos = positions[edge.target];
//     if (!sourcePos || !targetPos) return edge;
//     const { source, target } = getHandle(sourcePos, targetPos);
//     return { ...edge, sourceHandle: source, targetHandle: target };
//   });

//   return { nodes: layoutedNodes, edges: layoutedEdges };
//} 