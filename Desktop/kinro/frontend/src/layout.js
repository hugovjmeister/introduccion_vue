// src/layout.js
import dagre from "dagre";

export function getLayoutedNodesAndEdges(nodes, edges, direction = "TB") {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

// const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    // Usar posiciones existentes si están definidas, sino dejar que Dagre las calcule
    dagreGraph.setNode(node.id, {
      width: 224,  // Ancho aproximado de CustomNode (w-56 = 224px)
      height: node.data.attributes ? 50 + node.data.attributes.length * 40 : 50, // Altura dinámica
      x: node.position.x,
      y: node.position.y,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        // Si las posiciones ya existen en la base de datos, usarlas; si no, usar las calculadas
        x: node.position.x !== 0 || node.position.y !== 0 ? node.position.x : nodeWithPosition.x - nodeWithPosition.width / 2,
        y: node.position.x !== 0 || node.position.y !== 0 ? node.position.y : nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}