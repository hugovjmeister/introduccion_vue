// src/components/ClassDiagram.js
import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import CustomNode from "./CustomNode";

export default function ClassDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ custom: (props) => <CustomNode {...props} setNodes={setNodes} /> }), [setNodes]);

  const addClass = () => {
    const newNode = {
      id: uuidv4(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Clase ${nodes.length + 1}`, attributes: [] },
      type: "custom",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="h-[90vh] w-[90vw] border border-gray-300 rounded-lg">
        <Button onClick={addClass}>Agregar Clase</Button>
      </div>
      <div className="h-[90vh] w-[90vw] border border-gray-300 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
