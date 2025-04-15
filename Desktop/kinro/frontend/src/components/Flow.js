// src/components/Flow.js
import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, { ReactFlowProvider, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";

const initialNodes = [
  { id: "1", type: "custom", position: { x: 100, y: 100 }, data: { label: "Haz clic para editar" } },
];

const Flow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const addNewNode = useCallback(() => {
    const position = { x: Math.random() * 400, y: Math.random() * 400 };
    const newNode = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position,
      data: { label: `Nodo ${nodes.length + 1}` },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, [nodes]);

  return (
    <div className="h-screen w-full relative">
      <button
        onClick={addNewNode}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
      >
        Agregar Nodo
      </button>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
    </div>
  );
};

const FlowWithProvider = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default FlowWithProvider;
