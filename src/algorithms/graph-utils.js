/**
 * Core graph utilities for the A-C tree visualization
 */

/**
 * Creates a graph data structure
 */
export function createGraph(nodes = [], edges = []) {
    return {
        nodes: nodes.map(node => ({
            id: node.id,
            label: node.label || node.id.toString(),
            x: node.x || 0,
            y: node.y || 0
        })),
        edges: edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            weight: edge.weight || 1
        }))
    };
}

/**
 * Validates a graph structure
 */
export function validateGraph(graph) {
    const nodeIds = new Set(graph.nodes.map(n => n.id));

    // Check that all edges reference valid nodes
    for (const edge of graph.edges) {
        if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
            throw new Error(`Invalid edge: ${edge.source} -> ${edge.target}`);
        }
        if (edge.weight <= 0) {
            throw new Error(`Invalid edge weight: ${edge.weight}`);
        }
    }

    return true;
}

/**
 * Generates a random directed graph
 */
export function generateRandomGraph(nodeCount = 8, edgeProbability = 0.3) {
    const nodes = [];
    const edges = [];

    // Create nodes with random positions
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: i,
            label: String.fromCharCode(65 + i), // A, B, C, etc.
            x: Math.random() * 700 + 50, // Random x between 50-750
            y: Math.random() * 300 + 50  // Random y between 50-350
        });
    }

    // Create random edges
    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
            if (i !== j && Math.random() < edgeProbability) {
                edges.push({
                    source: i,
                    target: j,
                    weight: Math.floor(Math.random() * 10) + 1
                });
            }
        }
    }

    return createGraph(nodes, edges);
}

/**
 * Generates a predefined example graph from the paper
 */
export function generateExampleGraph() {
    const nodes = [
        { id: 0, label: 'A', x: 100, y: 100 },
        { id: 1, label: 'B', x: 250, y: 100 },
        { id: 2, label: 'C', x: 400, y: 100 },
        { id: 3, label: 'D', x: 550, y: 100 },
        { id: 4, label: 'E', x: 175, y: 250 },
        { id: 5, label: 'F', x: 325, y: 250 },
        { id: 6, label: 'G', x: 475, y: 250 }
    ];

    const edges = [
        { source: 0, target: 1, weight: 4 },
        { source: 0, target: 4, weight: 2 },
        { source: 1, target: 2, weight: 3 },
        { source: 1, target: 4, weight: 1 },
        { source: 1, target: 5, weight: 6 },
        { source: 2, target: 3, weight: 2 },
        { source: 2, target: 6, weight: 4 },
        { source: 4, target: 5, weight: 3 },
        { source: 5, target: 6, weight: 1 },
        { source: 5, target: 2, weight: 5 },
        { source: 6, target: 3, weight: 1 }
    ];

    return createGraph(nodes, edges);
}

/**
 * Gets the adjacency list representation of a graph
 */
export function getAdjacencyList(graph) {
    const adjacencyList = {};

    // Initialize empty lists for all nodes
    graph.nodes.forEach(node => {
        adjacencyList[node.id] = [];
    });

    // Add edges to adjacency list
    graph.edges.forEach(edge => {
        adjacencyList[edge.source].push({
            target: edge.target,
            weight: edge.weight
        });
    });

    return adjacencyList;
}

/**
 * Gets the reverse adjacency list (incoming edges)
 */
export function getReverseAdjacencyList(graph) {
    const reverseList = {};

    // Initialize empty lists for all nodes
    graph.nodes.forEach(node => {
        reverseList[node.id] = [];
    });

    // Add reverse edges
    graph.edges.forEach(edge => {
        reverseList[edge.target].push({
            source: edge.source,
            weight: edge.weight
        });
    });

    return reverseList;
}

/**
 * Performs topological sort on the graph
 */
export function topologicalSort(graph) {
    const adjacencyList = getAdjacencyList(graph);
    const inDegree = {};
    const result = [];
    const queue = [];

    // Initialize in-degrees
    graph.nodes.forEach(node => {
        inDegree[node.id] = 0;
    });

    // Calculate in-degrees
    graph.edges.forEach(edge => {
        inDegree[edge.target]++;
    });

    // Find nodes with zero in-degree
    graph.nodes.forEach(node => {
        if (inDegree[node.id] === 0) {
            queue.push(node.id);
        }
    });

    // Process nodes
    while (queue.length > 0) {
        const nodeId = queue.shift();
        result.push(nodeId);

        // Reduce in-degree of adjacent nodes
        adjacencyList[nodeId].forEach(edge => {
            inDegree[edge.target]--;
            if (inDegree[edge.target] === 0) {
                queue.push(edge.target);
            }
        });
    }

    // Check for cycles
    if (result.length !== graph.nodes.length) {
        throw new Error('Graph contains cycles');
    }

    return result;
}

/**
 * Finds strongly connected components using Tarjan's algorithm
 */
export function findStronglyConnectedComponents(graph) {
    const adjacencyList = getAdjacencyList(graph);
    const indices = {};
    const lowLinks = {};
    const onStack = {};
    const stack = [];
    const components = [];
    let index = 0;

    // Initialize all nodes as unvisited
    graph.nodes.forEach(node => {
        indices[node.id] = -1;
    });

    function strongConnect(nodeId) {
        indices[nodeId] = index;
        lowLinks[nodeId] = index;
        index++;
        stack.push(nodeId);
        onStack[nodeId] = true;

        // Consider successors
        adjacencyList[nodeId].forEach(edge => {
            const targetId = edge.target;

            if (indices[targetId] === -1) {
                // Successor has not yet been visited; recurse
                strongConnect(targetId);
                lowLinks[nodeId] = Math.min(lowLinks[nodeId], lowLinks[targetId]);
            } else if (onStack[targetId]) {
                // Successor is in stack and hence in the current SCC
                lowLinks[nodeId] = Math.min(lowLinks[nodeId], indices[targetId]);
            }
        });

        // If nodeId is a root node, pop the stack and generate an SCC
        if (lowLinks[nodeId] === indices[nodeId]) {
            const component = [];
            let poppedNode;

            do {
                poppedNode = stack.pop();
                onStack[poppedNode] = false;
                component.push(poppedNode);
            } while (poppedNode !== nodeId);

            components.push(component);
        }
    }

    // Run the algorithm for all unvisited nodes
    graph.nodes.forEach(node => {
        if (indices[node.id] === -1) {
            strongConnect(node.id);
        }
    });

    return components;
}

/**
 * Creates a subgraph containing only the specified nodes
 */
export function createSubgraph(graph, nodeIds) {
    const nodeIdSet = new Set(nodeIds);

    const nodes = graph.nodes.filter(node => nodeIdSet.has(node.id));
    const edges = graph.edges.filter(edge =>
        nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target)
    );

    return createGraph(nodes, edges);
}

/**
 * Applies force-directed layout to position nodes
 */
export function applyForceDirectedLayout(graph, iterations = 100) {
    const nodes = [...graph.nodes];
    const edges = graph.edges;

    // Constants for the force simulation
    const repulsion = 1000;
    const attraction = 0.1;
    const damping = 0.9;

    for (let iter = 0; iter < iterations; iter++) {
        const forces = {};

        // Initialize forces
        nodes.forEach(node => {
            forces[node.id] = { x: 0, y: 0 };
        });

        // Repulsive forces between all nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];

                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                const force = repulsion / (distance * distance);
                const fx = force * dx / distance;
                const fy = force * dy / distance;

                forces[node1.id].x -= fx;
                forces[node1.id].y -= fy;
                forces[node2.id].x += fx;
                forces[node2.id].y += fy;
            }
        }

        // Attractive forces for connected nodes
        edges.forEach(edge => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);

            if (source && target) {
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                const force = attraction * distance;
                const fx = force * dx / distance;
                const fy = force * dy / distance;

                forces[source.id].x += fx;
                forces[source.id].y += fy;
                forces[target.id].x -= fx;
                forces[target.id].y -= fy;
            }
        });

        // Apply forces
        nodes.forEach(node => {
            node.x += forces[node.id].x * damping;
            node.y += forces[node.id].y * damping;

            // Keep nodes within bounds
            node.x = Math.max(50, Math.min(750, node.x));
            node.y = Math.max(50, Math.min(350, node.y));
        });
    }

    return createGraph(nodes, edges);
}