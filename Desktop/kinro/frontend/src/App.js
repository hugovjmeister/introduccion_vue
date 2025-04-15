// src/App.js
import React from "react";
import Graph from "./components/Graph";
import { Toaster } from "react-hot-toast";
import "./App.css"; // Importamos un archivo CSS para los estilos


// Componente ErrorBoundary para capturar errores en los hijos
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Algo salió mal</h1>
          <p>{this.state.error?.message || "Error desconocido"}</p>
          <button onClick={() => window.location.reload()}>
            Recargar la página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <div className="app-container">
        <Graph />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px",
            },
            success: {
              style: {
                background: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;