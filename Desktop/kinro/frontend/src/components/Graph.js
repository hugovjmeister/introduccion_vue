// src/components/Graph.js
import React, { useEffect, useState, useCallback } from "react";
import { ReactFlow, MiniMap, Controls, Background, applyNodeChanges, applyEdgeChanges, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { fetchClasses, createClass, deleteClass, updateClassName, fetchConnections, createConnection, deleteConnection, updateClassPosition } from "../api";
import CustomNode from "./CustomNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";
import ClassContextMenu from "./ClassContextMenu";
import EdgeContextMenu from "./EdgeContextMenu";
import ClassModal from "./ClassModal";
import UploadExcelModal from "./UploadExcelModal";
import { getLayoutedNodesAndEdges } from "../layout";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { floating: FloatingEdge };
const defaultEdgeOptions = {
  type: "floating",
  markerEnd: { type: MarkerType.ArrowClosed, color: "#b1b1b7" },
  style: { strokeWidth: 2 },
};
const connectionLineStyle = { stroke: "#b1b1b7" };

function Graph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [edgeContextMenu, setEdgeContextMenu] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, nodeId: null });
  const [uploadModalState, setUploadModalState] = useState({ isOpen: false, nodeId: null, attributes: [] });
  const [connectionData, setConnectionData] = useState(null);

  const handleEdgeDelete = useCallback(async (edgeId) => {
    try {
      await deleteConnection(edgeId);
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      setEdgeContextMenu(null);
    } catch (error) {
      console.error("Error deleting connection:", error);
      alert("No se pudo eliminar la relación");
    }
  }, []);

  const handleOpenUploadModal = useCallback((nodeId, attributes) => {
    setUploadModalState({ isOpen: true, nodeId, attributes });
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setUploadModalState({ isOpen: false, nodeId: null, attributes: [] });
  }, []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds);
      changes.forEach((change) => {
        if (change.type === "position" && !change.dragging) {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (node) {
            updateClassPosition(node.id, { position_x: node.position.x, position_y: node.position.y })
              .catch((error) => console.error("Error updating position:", error));
          }
        }
      });
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((connection) => {
    setConnectionData({ source: connection.source, target: connection.target });
    setModalState({ isOpen: true, type: "connect", nodeId: null });
  }, []);

  const loadGraph = useCallback(() => {
    Promise.all([fetchClasses(), fetchConnections()])
      .then(([classes, connections]) => {
        const classNodes = classes.map((cls) => ({
          id: cls.id.toString(),
          type: "custom",
          data: {
            label: cls.name,
            attributes: cls.attributes || [],
            onReload: loadGraph,
            onOpenUploadModal: handleOpenUploadModal,
            edges: connections.map((conn) => ({
              id: conn.id.toString(),
              source: conn.source_class.toString(),
              target: conn.target_class.toString(),
              label: conn.relationship_type,
              data: { label: conn.relationship_type },
            })) || [],
            nodes: classes.map((cls) => ({
              id: cls.id.toString(),
              data: { label: cls.name },
            })) || [],
          },
          position: { x: cls.position_x || 0, y: cls.position_y || 0 },
          sourcePosition: "bottom",
          targetPosition: "top",
        }));
        const classEdges = connections.map((conn) => ({
          id: conn.id.toString(),
          source: conn.source_class.toString(),
          target: conn.target_class.toString(),
          type: "floating",
          label: conn.relationship_type,
          data: { label: conn.relationship_type },
        }));
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedNodesAndEdges(classNodes, classEdges, "TB");
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      })
      .catch((error) => {
        console.error("Error loading graph:", error);
        alert("No se pudo cargar el grafo");
      });
  }, [handleOpenUploadModal]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    console.log("Clic derecho en nodo:", { nodeId: node ? node.id : null, x: event.clientX, y: event.clientY });
    setContextMenu(node ? { x: event.clientX, y: event.clientY, nodeId: node.id } : { x: event.clientX, y: event.clientY, nodeId: null });
    setEdgeContextMenu(null);
  }, []);

  const handleEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    console.log("Clic derecho en edge:", { edgeId: edge?.id, x: event.clientX, y: event.clientY });
    setEdgeContextMenu({ x: event.clientX, y: event.clientY, edgeId: edge?.id });
    setContextMenu(null);
  }, []);

  const openModal = useCallback((type, nodeId = null) => {
    console.log("Abriendo modal:", { type, nodeId });
    setModalState({ isOpen: true, type, nodeId });
    setContextMenu(null);
    setEdgeContextMenu(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, type: null, nodeId: null });
    setConnectionData(null);
  }, []);

  const handleClassCreate = useCallback(async (className) => {
    try {
      console.log("Creando clase:", className);
      await createClass({ name: className });
      loadGraph();
      closeModal();
      setContextMenu(null);
    } catch (error) {
      console.error("Error creating class:", error);
      alert(`No se pudo crear la clase: ${error.message}`);
    }
  }, [loadGraph, closeModal]);

  const handleClassEdit = useCallback(async (nodeId, newName) => {
    try {
      await updateClassName(nodeId, { name: newName });
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: newName } } : n
        )
      );
      closeModal();
      setContextMenu(null);
    } catch (error) {
      console.error("Error updating class name:", error);
      alert("No se pudo actualizar el nombre de la clase");
    }
  }, [closeModal]);

  const handleClassDelete = useCallback(async (nodeId) => {
    try {
      await deleteClass(nodeId);
      loadGraph();
      closeModal();
      setContextMenu(null);
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("No se pudo eliminar la clase");
    }
  }, [loadGraph, closeModal]);

  const handleClassDuplicate = useCallback(async (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    try {
      console.log("Duplicando clase:", node.data.label);
      await createClass({ name: `${node.data.label} (Copia)` });
      loadGraph();
      closeModal();
      setContextMenu(null);
    } catch (error) {
      console.error("Error duplicating class:", error);
      alert(`No se pudo duplicar la clase: ${error.message}`);
    }
  }, [nodes, loadGraph, closeModal]);

  const handleConnectionCreate = useCallback(async (relationshipType) => {
    if (!connectionData) return;
    const existingConnection = edges.find(
      (edge) => edge.source === connectionData.source && edge.target === connectionData.target
    );
    if (existingConnection) {
      alert("Ya existe una conexión entre estos nodos. Elimina la existente primero.");
      return;
    }
    try {
      const conn = await createConnection({
        source_class: connectionData.source,
        target_class: connectionData.target,
        relationship_type: relationshipType,
      });
      const newEdge = {
        id: conn.id,
        ...connectionData,
        label: relationshipType,
        type: "floating",
        data: { label: relationshipType },
      };
      setEdges((eds) => [...eds, newEdge]);
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            edges: [...edges, newEdge],
            nodes: nds.map((node) => ({
              id: node.id,
              data: { label: node.data.label },
            })),
          },
        }))
      );
      closeModal();
    } catch (error) {
      alert(`No se pudo crear la relación: ${error.message}`);
    }
  }, [connectionData, closeModal, edges]);

  return (
    <div className="h-screen w-screen bg-gray-50 relative">
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        onPaneContextMenu={handleNodeContextMenu}
        onPaneClick={() => {
          setContextMenu(null);
          setEdgeContextMenu(null);
        }}
        fitView
      >
        <MiniMap zoomable pannable />
        <Controls />
        <Background variant="dots" gap={16} size={1} />
      </ReactFlow>

      {contextMenu && (
        <ClassContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onAddClass={() => openModal("create")}
          onEditClass={() => openModal("edit", contextMenu.nodeId)}
          onDeleteClass={() => handleClassDelete(contextMenu.nodeId)}
          onManageAttributes={() => openModal("attributes", contextMenu.nodeId)}
          onDuplicateClass={() => handleClassDuplicate(contextMenu.nodeId)}
        />
      )}
      {edgeContextMenu && (
        <EdgeContextMenu
          x={edgeContextMenu.x}
          y={edgeContextMenu.y}
          edgeId={edgeContextMenu.edgeId}
          onDelete={() => handleEdgeDelete(edgeContextMenu.edgeId)}
        />
      )}
      {modalState.isOpen && (
        <ClassModal
          type={modalState.type}
          nodeId={modalState.nodeId}
          nodes={nodes}
          onClose={closeModal}
          onCreate={handleClassCreate}
          onEdit={handleClassEdit}
          onDelete={handleClassDelete}
          onConnect={handleConnectionCreate}
          onReload={loadGraph}
        />
      )}
      {uploadModalState.isOpen && (
        <UploadExcelModal
          nodeId={uploadModalState.nodeId}
          attributes={uploadModalState.attributes}
          onClose={handleCloseUploadModal}
          onReload={loadGraph}
        />
      )}
    </div>
  );
}

export default Graph;