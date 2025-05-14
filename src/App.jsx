import React, { useState } from 'react';
import ACTreeVisualization from './components/ACTreeVisualization';
import './styles.css';

function App() {
    return (
        <div className="App">
            <header className="bg-blue-700 text-white p-4 shadow-md">
                <h1 className="text-2xl font-bold">A-C Tree Visualization Tool</h1>
                <p className="text-sm">Based on "Faster shortest-path algorithms using the acyclic-connected tree" (Stefansson, Biggar, Johansson, 2025)</p>
            </header>

            <main className="container mx-auto p-4">
                <ACTreeVisualization />
            </main>

            <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
                <p>© 2025 A-C Tree Visualization Tool</p>
                <p>
                    <a
                        href="https://github.com/yourusername/ac-tree-visualization"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on GitHub
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;