// src/components/FloatingEdge.js
import React from "react";
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/react";

function FloatingEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#fff",
            padding: "5px",
            borderRadius: "3px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            color: "#666",
            pointerEvents: "none", // Evita interferir con eventos de clic
          }}
        >
          {data?.label || "Sin etiqueta"}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;