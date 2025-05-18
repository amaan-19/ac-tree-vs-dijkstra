import React, { useRef, useEffect, useState } from 'react';

/**
 * Component for visualizing the A-C Tree structure and algorithm execution
 */
const ACTreeVisualization = ({ acTree, graph, currentStep, algorithmSteps }) => {
    const canvasRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [viewMode, setViewMode] = useState('tree'); // 'tree', 'sccs', 'decomposition'

    // Get current step information for highlighting
    const getCurrentStepInfo = () => {
        if (!algorithmSteps || !algorithmSteps.recursiveDijkstra || currentStep < 0) {
            return { currentComponent: [], visited: [], recursionStack: [] };
        }

        const steps = algorithmSteps.recursiveDijkstra;
        const step = steps[Math.min(currentStep, steps.length - 1)];

        return {
            currentComponent: step.currentComponent || [],
            visited: step.visited || [],
            recursionStack: step.recursionStack || []
        };
    };

    const stepInfo = getCurrentStepInfo();

    // Draw the A-C tree visualization
    useEffect(() => {
        if (!canvasRef.current || !acTree) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (viewMode === 'tree') {
            drawACTree(ctx, width, height);
        } else if (viewMode === 'sccs') {
            drawSCCDecomposition(ctx, width, height);
        } else if (viewMode === 'decomposition') {
            drawHierarchicalDecomposition(ctx, width, height);
        }
    }, [acTree, viewMode, currentStep, stepInfo]);

    // Check if we have the necessary data - AFTER all hooks
    if (!acTree || !acTree.acTree) {
        return (
            <div className="text-center p-8 bg-gray-100 rounded">
                <p>No A-C tree data available. Run the algorithms first.</p>
            </div>
        );
    }

    // Draw the A-C tree structure
    const drawACTree = (ctx, width, height) => {
        if (!acTree.acTree || !acTree.acTree.nodes) return;

        const nodes = acTree.acTree.nodes;
        const edges = acTree.acTree.edges;

        // Calculate layout positions for tree visualization
        const levels = Math.max(...nodes.map(n => n.level || 0)) + 1;
        const levelWidth = width / levels;
        const nodePositions = {};

        // Group nodes by level
        const nodesByLevel = {};
        nodes.forEach(node => {
            const level = node.level || 0;
            if (!nodesByLevel[level]) nodesByLevel[level] = [];
            nodesByLevel[level].push(node);
        });

        // Position nodes
        Object.keys(nodesByLevel).forEach(level => {
            const levelNodes = nodesByLevel[level];
            const levelHeight = height / (levelNodes.length + 1);

            levelNodes.forEach((node, index) => {
                nodePositions[node.id] = {
                    x: levelWidth * (parseInt(level) + 0.5),
                    y: levelHeight * (index + 1)
                };
            });
        });

        // Draw edges first
        edges.forEach(edge => {
            const source = nodePositions[edge.source];
            const target = nodePositions[edge.target];

            if (source && target) {
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = '#888';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw arrow
                const angle = Math.atan2(target.y - source.y, target.x - source.x);
                const arrowSize = 10;
                ctx.beginPath();
                ctx.moveTo(
                    target.x - arrowSize * Math.cos(angle - Math.PI / 6),
                    target.y - arrowSize * Math.sin(angle - Math.PI / 6)
                );
                ctx.lineTo(target.x, target.y);
                ctx.lineTo(
                    target.x - arrowSize * Math.cos(angle + Math.PI / 6),
                    target.y - arrowSize * Math.sin(angle + Math.PI / 6)
                );
                ctx.fillStyle = '#888';
                ctx.fill();
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            const pos = nodePositions[node.id];
            if (!pos) return;

            // Determine node color based on current algorithm state
            let fillColor = '#fff';
            let strokeColor = '#000';
            let strokeWidth = 2;

            if (stepInfo.currentComponent.some(nodeId => node.component.includes(nodeId))) {
                fillColor = '#fbbf24'; // Yellow for current component
                strokeColor = '#f59e0b';
                strokeWidth = 3;
            } else if (stepInfo.visited.some(nodeId => node.component.includes(nodeId))) {
                fillColor = '#86efac'; // Green for visited
                strokeColor = '#10b981';
            } else if (stepInfo.recursionStack.some(stack =>
                stack.some(nodeId => node.component.includes(nodeId)))) {
                fillColor = '#c7d2fe'; // Blue for in recursion stack
                strokeColor = '#6366f1';
            }

            if (selectedNode === node.id) {
                strokeColor = '#ef4444';
                strokeWidth = 4;
            }

            // Draw node circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();

            // Draw node label
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, pos.x, pos.y - 5);

            // Draw component nodes
            ctx.font = '10px Arial';
            ctx.fillText(
                `{${node.component.map(id => graph.nodes.find(n => n.id === id)?.label || id).join(',')}}`,
                pos.x, pos.y + 10
            );
        });
    };

    // Draw SCC decomposition view
    const drawSCCDecomposition = (ctx, width, height) => {
        if (!acTree.sccs) return;

        const sccs = acTree.sccs;
        const colors = ['#fecaca', '#fed7aa', '#fef3c7', '#d1fae5', '#dbeafe', '#e0e7ff', '#f3e8ff'];

        // Calculate positions for SCCs
        const cols = Math.ceil(Math.sqrt(sccs.length));
        const cellWidth = width / cols;
        const cellHeight = height / Math.ceil(sccs.length / cols);

        sccs.forEach((scc, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * cellWidth + cellWidth / 2;
            const y = row * cellHeight + cellHeight / 2;

            // Determine color based on algorithm state
            let fillColor = colors[index % colors.length];
            let strokeColor = '#000';
            let strokeWidth = 2;

            if (stepInfo.currentComponent.some(nodeId => scc.includes(nodeId))) {
                strokeColor = '#f59e0b';
                strokeWidth = 4;
            } else if (stepInfo.visited.some(nodeId => scc.includes(nodeId))) {
                strokeColor = '#10b981';
                strokeWidth = 3;
            }

            // Draw SCC boundary
            ctx.beginPath();
            ctx.roundRect(x - cellWidth / 3, y - cellHeight / 3, cellWidth * 2 / 3, cellHeight * 2 / 3, 10);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();

            // Draw SCC label
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`SCC ${index}`, x, y - 20);

            // Draw nodes in SCC
            ctx.font = '12px Arial';
            const nodeLabels = scc.map(nodeId =>
                graph.nodes.find(n => n.id === nodeId)?.label || nodeId
            ).join(', ');
            ctx.fillText(`{${nodeLabels}}`, x, y + 10);

            // Draw size
            ctx.font = '10px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText(`Size: ${scc.length}`, x, y + 25);
        });
    };

    // Draw hierarchical decomposition view
    const drawHierarchicalDecomposition = (ctx, width, height) => {
        if (!acTree.acTree || !acTree.topologicalOrder) return;

        const levels = acTree.acTree.levels || 1;
        const topOrder = acTree.topologicalOrder;

        // Draw background levels
        for (let level = 0; level < levels; level++) {
            const x = (width / levels) * level;
            const w = width / levels;

            ctx.fillStyle = level % 2 === 0 ? '#f9fafb' : '#f3f4f6';
            ctx.fillRect(x, 0, w, height);

            // Level label
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Level ${level}`, x + w / 2, 30);
        }

        // Draw nesting width indicator
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Nesting Width: ${acTree.nestingWidth}`, width / 2, height - 20);

        // Draw topological order
        ctx.fillStyle = '#1f2937';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        const orderText = `Topological Order: ${topOrder.map(i => `SCC${i}`).join(' → ')}`;
        ctx.fillText(orderText, 20, height - 50);

        // Draw components by level
        const nodesByLevel = {};
        acTree.acTree.nodes.forEach(node => {
            const level = node.level || 0;
            if (!nodesByLevel[level]) nodesByLevel[level] = [];
            nodesByLevel[level].push(node);
        });

        Object.keys(nodesByLevel).forEach(level => {
            const levelNodes = nodesByLevel[level];
            const levelX = (width / levels) * parseInt(level);
            const levelWidth = width / levels;
            const nodeHeight = (height - 100) / levelNodes.length;

            levelNodes.forEach((node, index) => {
                const y = 70 + index * nodeHeight + nodeHeight / 2;
                const x = levelX + levelWidth / 2;

                // Determine color based on algorithm state
                let fillColor = '#fff';
                let strokeColor = '#000';

                if (stepInfo.currentComponent.some(nodeId => node.component.includes(nodeId))) {
                    fillColor = '#fbbf24';
                    strokeColor = '#f59e0b';
                } else if (stepInfo.visited.some(nodeId => node.component.includes(nodeId))) {
                    fillColor = '#86efac';
                    strokeColor = '#10b981';
                }

                // Draw component box
                ctx.beginPath();
                ctx.roundRect(x - 60, y - 25, 120, 50, 8);
                ctx.fillStyle = fillColor;
                ctx.fill();
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw component info
                ctx.fillStyle = '#000';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.label, x, y - 8);

                ctx.font = '10px Arial';
                const nodeLabels = node.component.map(nodeId =>
                    graph.nodes.find(n => n.id === nodeId)?.label || nodeId
                ).join(',');
                ctx.fillText(`{${nodeLabels}}`, x, y + 8);
            });
        });
    };

    // Handle canvas clicks
    const handleCanvasClick = (event) => {
        if (viewMode !== 'tree') return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if any A-C tree node was clicked (simplified click detection)
        // In a real implementation, you'd store node positions and check distances
        setSelectedNode(selectedNode === null ? 0 : null);
    };

    return (
        <div className="space-y-4">
            {/* View Mode Controls */}
            <div className="flex flex-wrap gap-2 justify-center">
                <button
                    className={`px-4 py-2 rounded ${viewMode === 'tree' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setViewMode('tree')}
                >
                    A-C Tree Structure
                </button>
                <button
                    className={`px-4 py-2 rounded ${viewMode === 'sccs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setViewMode('sccs')}
                >
                    SCC Decomposition
                </button>
                <button
                    className={`px-4 py-2 rounded ${viewMode === 'decomposition' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setViewMode('decomposition')}
                >
                    Hierarchical View
                </button>
            </div>

            {/* Canvas for visualization */}
            <div className="border border-gray-300 rounded">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="bg-white cursor-pointer"
                    onClick={handleCanvasClick}
                />
            </div>

            {/* Legend */}
            <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Legend:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-white border-2 border-black rounded mr-2"></div>
                        <span>Unvisited Component</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-300 border-2 border-yellow-600 rounded mr-2"></div>
                        <span>Current Component</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-300 border-2 border-green-600 rounded mr-2"></div>
                        <span>Processed Component</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded mr-2"></div>
                        <span>In Recursion Stack</span>
                    </div>
                </div>
            </div>

            {/* A-C Tree Information Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded p-4">
                    <h4 className="font-semibold mb-2">A-C Tree Properties</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Number of Components:</span>
                            <span className="font-mono">{acTree.sccs?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tree Levels:</span>
                            <span className="font-mono">{acTree.acTree?.levels || 1}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Nesting Width:</span>
                            <span className="font-mono font-bold text-purple-600">{acTree.nestingWidth}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Average Component Size:</span>
                            <span className="font-mono">
                                {acTree.sccs ? (graph.nodes.length / acTree.sccs.length).toFixed(1) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded p-4">
                    <h4 className="font-semibold mb-2">Algorithm State</h4>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="font-medium">Current Component:</span>
                            <div className="mt-1 p-2 bg-yellow-50 rounded text-xs font-mono">
                                {stepInfo.currentComponent.length > 0
                                    ? `{${stepInfo.currentComponent.map(id =>
                                        graph.nodes.find(n => n.id === id)?.label || id
                                    ).join(', ')}}`
                                    : 'None'
                                }
                            </div>
                        </div>
                        <div>
                            <span className="font-medium">Recursion Depth:</span>
                            <span className="font-mono ml-2">{stepInfo.recursionStack.length}</span>
                        </div>
                        <div>
                            <span className="font-medium">Visited Nodes:</span>
                            <div className="mt-1 p-2 bg-green-50 rounded text-xs font-mono">
                                {stepInfo.visited.length > 0
                                    ? stepInfo.visited.map(id =>
                                        graph.nodes.find(n => n.id === id)?.label || id
                                    ).join(', ')
                                    : 'None'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Component Information */}
            {viewMode === 'sccs' && (
                <div className="bg-white border rounded p-4">
                    <h4 className="font-semibold mb-2">Strongly Connected Components</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">SCC</th>
                                    <th className="text-left py-2 px-3">Nodes</th>
                                    <th className="text-left py-2 px-3">Size</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {acTree.sccs?.map((scc, index) => {
                                    const isCurrentComponent = stepInfo.currentComponent.some(nodeId => scc.includes(nodeId));
                                    const isVisited = stepInfo.visited.some(nodeId => scc.includes(nodeId));

                                    let status = 'Unvisited';
                                    let statusColor = 'text-gray-600';

                                    if (isCurrentComponent) {
                                        status = 'Processing';
                                        statusColor = 'text-yellow-600';
                                    } else if (isVisited) {
                                        status = 'Completed';
                                        statusColor = 'text-green-600';
                                    }

                                    return (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-2 px-3 font-mono">SCC{index}</td>
                                            <td className="py-2 px-3 font-mono">
                                                {scc.map(nodeId =>
                                                    graph.nodes.find(n => n.id === nodeId)?.label || nodeId
                                                ).join(', ')}
                                            </td>
                                            <td className="py-2 px-3">{scc.length}</td>
                                            <td className={`py-2 px-3 font-medium ${statusColor}`}>{status}</td>
                                        </tr>
                                    );
                                }) || []}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ACTreeVisualization;