import React, { useRef, useEffect } from 'react';

/**
 * Component for rendering a graph on a canvas
 */
const GraphCanvas = ({
    graph,
    highlightedNodes = [],
    colorMap = {},
    selected = null,
    onNodeClick = null,
    isEditable = false
}) => {
    const canvasRef = useRef(null);

    // Draw the graph whenever it changes
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw edges
        graph.edges.forEach(edge => {
            const source = graph.nodes.find(n => n.id === edge.source);
            const target = graph.nodes.find(n => n.id === edge.target);

            if (source && target) {
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = '#888';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw arrow head
                const angle = Math.atan2(target.y - source.y, target.x - source.x);
                const arrowSize = 8;

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

                // Draw weight
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                ctx.fillText(edge.weight.toString(), midX, midY);
            }
        });

        // Draw nodes
        graph.nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);

            // Apply custom coloring if available
            if (colorMap[node.id]) {
                ctx.fillStyle = colorMap[node.id];
            } else if (highlightedNodes.includes(node.id)) {
                ctx.fillStyle = '#a8d5ba'; // Light green for highlighted nodes
            } else if (selected === node.id) {
                ctx.fillStyle = '#f8961e'; // Orange for selected node
            } else {
                ctx.fillStyle = '#fff';
            }

            ctx.strokeStyle = selected === node.id ? '#f00' : '#000';
            ctx.lineWidth = selected === node.id ? 2 : 1;
            ctx.stroke();
            ctx.fill();

            // Draw node label
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);
        });
    }, [graph, highlightedNodes, colorMap, selected]);

    // Handle node clicks
    const handleCanvasClick = (event) => {
        if (!isEditable && !onNodeClick) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if a node was clicked
        for (const node of graph.nodes) {
            const dx = node.x - x;
            const dy = node.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 15) { // Node radius is 15
                if (onNodeClick) {
                    onNodeClick(node.id);
                }
                break;
            }
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border border-gray-300 bg-white"
            onClick={handleCanvasClick}
        />
    );
};

export default GraphCanvas;