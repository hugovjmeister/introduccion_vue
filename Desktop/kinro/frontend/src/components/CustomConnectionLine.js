// src/components/CustomConnectionLine.js
import React from "react";
import { getBezierPath } from "@xyflow/react";

function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionLineStyle,
  markerEnd,
}) {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        d={edgePath}
        className="react-flow__edge-path"
        style={connectionLineStyle}
        markerEnd={markerEnd}
      />
    </g>
  );
}

export default CustomConnectionLine;
