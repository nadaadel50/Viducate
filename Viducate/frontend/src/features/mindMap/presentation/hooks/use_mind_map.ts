import { useMemo } from "react";
import { useGetMindMap } from "./use_get_mind_map";
import { transformMindMap } from "../utils/transform_mind_map";
import { getLayoutedElements } from "../utils/make_minde_map_layout";

export function useMindMapFlow() {
  const { data, isLoading, error } = useGetMindMap();

  const flow = useMemo(() => {
    if (!data) {
      return {
        nodes: [],
        edges: [],
      };
    }

    const transformed = transformMindMap(data);

    return getLayoutedElements(transformed.nodes, transformed.edges);
  }, [data]);

  return {
    nodes: flow.nodes,
    edges: flow.edges,

    isLoading,
    error,
  };
}
