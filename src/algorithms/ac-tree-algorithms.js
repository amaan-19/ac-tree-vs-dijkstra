/**
 * A-C Tree algorithms implementation
 * Based on "Faster shortest-path algorithms using the acyclic-connected tree"
 * by Stefansson, Biggar, and Johansson (2025)
 */

import { PriorityQueue } from './priority-queue.js';
import {
    getAdjacencyList,
    getReverseAdjacencyList,
    findStronglyConnectedComponents,
    topologicalSort,
    createSubgraph
} from './graph-utils.js';

/**
 * Standard Dijkstra's algorithm with step tracking
 * @param {Object} graph - The graph object
 * @param {number} sourceId - The source node ID
 * @returns {Object} Result containing distances, predecessors, steps, and operation count
 */
export function runDijkstra(graph, sourceId) {
    const adjacencyList = getAdjacencyList(graph);
    const distances = {};
    const predecessors = {};
    const visited = new Set();
    const steps = [];
    let operations = 0;

    // Initialize distances
    graph.nodes.forEach(node => {
        distances[node.id] = node.id === sourceId ? 0 : Infinity;
        predecessors[node.id] = null;
    });

    const pq = new PriorityQueue();
    pq.enqueue(sourceId, 0);

    // Initial step
    steps.push({
        visited: Array.from(visited),
        queue: pq.toArray(),
        distances: { ...distances },
        current: null,
        operation: 'initialization'
    });

    while (!pq.isEmpty()) {
        operations++;
        const currentId = pq.dequeue();

        if (visited.has(currentId)) {
            continue;
        }

        visited.add(currentId);

        // Record step
        steps.push({
            visited: Array.from(visited),
            queue: pq.toArray(),
            distances: { ...distances },
            current: currentId,
            operation: 'visit_node'
        });

        // Process neighbors
        adjacencyList[currentId].forEach(edge => {
            operations++;
            const neighborId = edge.target;
            const newDistance = distances[currentId] + edge.weight;

            if (newDistance < distances[neighborId]) {
                distances[neighborId] = newDistance;
                predecessors[neighborId] = currentId;

                if (!visited.has(neighborId)) {
                    pq.enqueue(neighborId, newDistance);
                }

                // Record relaxation step
                steps.push({
                    visited: Array.from(visited),
                    queue: pq.toArray(),
                    distances: { ...distances },
                    current: currentId,
                    relaxed: neighborId,
                    operation: 'relax_edge'
                });
            }
        });
    }

    return {
        result: { distances, predecessors },
        steps,
        operations
    };
}

/**
 * Constructs the A-C tree decomposition of a graph
 * @param {Object} graph - The graph object
 * @returns {Object} A-C tree structure with nesting width
 */
export function constructACTree(graph) {
    try {
        // Step 1: Find strongly connected components
        const sccs = findStronglyConnectedComponents(graph);

        // Step 2: Create condensation graph (DAG of SCCs)
        const condensationGraph = createCondensationGraph(graph, sccs);

        // Step 3: Topologically sort the SCCs
        const topologicalOrder = topologicalSort(condensationGraph);

        // Step 4: Build A-C tree by processing SCCs in topological order
        const acTree = buildACTreeFromSCCs(graph, sccs, topologicalOrder);

        // Step 5: Calculate nesting width
        const nestingWidth = calculateNestingWidth(acTree);

        return {
            acTree,
            sccs,
            condensationGraph,
            topologicalOrder,
            nestingWidth
        };
    } catch (error) {
        console.warn('A-C tree construction failed, using fallback:', error.message);
        return createFallbackACTree(graph);
    }
}

/**
 * Creates a condensation graph from SCCs
 * @param {Object} graph - Original graph
 * @param {Array} sccs - Strongly connected components
 * @returns {Object} Condensation graph
 */
function createCondensationGraph(graph, sccs) {
    // Map each node to its SCC index
    const nodeToSCC = {};
    sccs.forEach((scc, index) => {
        scc.forEach(nodeId => {
            nodeToSCC[nodeId] = index;
        });
    });

    // Create nodes for each SCC
    const nodes = sccs.map((scc, index) => ({
        id: index,
        label: `SCC${index}`,
        component: scc,
        x: Math.random() * 700 + 50,
        y: Math.random() * 300 + 50
    }));

    // Create edges between SCCs
    const edges = [];
    const addedEdges = new Set();

    graph.edges.forEach(edge => {
        const sourceSCC = nodeToSCC[edge.source];
        const targetSCC = nodeToSCC[edge.target];

        if (sourceSCC !== targetSCC) {
            const edgeKey = `${sourceSCC}-${targetSCC}`;
            if (!addedEdges.has(edgeKey)) {
                edges.push({
                    source: sourceSCC,
                    target: targetSCC,
                    weight: 1
                });
                addedEdges.add(edgeKey);
            }
        }
    });

    return { nodes, edges };
}

/**
 * Builds A-C tree from SCCs in topological order
 * @param {Object} graph - Original graph
 * @param {Array} sccs - Strongly connected components
 * @param {Array} topologicalOrder - Topological order of SCCs
 * @returns {Object} A-C tree
 */
function buildACTreeFromSCCs(graph, sccs, topologicalOrder) {
    const acTreeNodes = [];
    const acTreeEdges = [];

    // Create A-C tree nodes for each SCC
    topologicalOrder.forEach((sccIndex, level) => {
        const scc = sccs[sccIndex];

        acTreeNodes.push({
            id: sccIndex,
            label: `SCC${sccIndex}`,
            component: scc,
            level: level,
            isLeaf: scc.length === 1,
            x: 100 + level * 150,
            y: 100 + sccIndex * 60
        });
    });

    // Create parent-child relationships based on dependencies
    const adjacencyList = getAdjacencyList(graph);

    topologicalOrder.forEach(currentSCC => {
        const children = new Set();

        // Find direct children (SCCs that this SCC has edges to)
        sccs[currentSCC].forEach(nodeId => {
            adjacencyList[nodeId].forEach(edge => {
                sccs.forEach((otherSCC, otherIndex) => {
                    if (otherIndex !== currentSCC &&
                        otherSCC.includes(edge.target)) {
                        children.add(otherIndex);
                    }
                });
            });
        });

        // Add edges to children
        children.forEach(childSCC => {
            acTreeEdges.push({
                source: currentSCC,
                target: childSCC,
                weight: 1
            });
        });
    });

    return {
        nodes: acTreeNodes,
        edges: acTreeEdges,
        levels: Math.max(...acTreeNodes.map(n => n.level)) + 1
    };
}

/**
 * Calculates the nesting width of the A-C tree
 * @param {Object} acTree - A-C tree structure
 * @returns {number} Nesting width
 */
function calculateNestingWidth(acTree) {
    const levelCounts = {};

    acTree.nodes.forEach(node => {
        const level = node.level || 0;
        levelCounts[level] = (levelCounts[level] || 0) + node.component.length;
    });

    return Math.max(...Object.values(levelCounts), 1);
}

/**
 * Creates a fallback A-C tree when construction fails
 * @param {Object} graph - Original graph
 * @returns {Object} Simple A-C tree
 */
function createFallbackACTree(graph) {
    // Treat each node as its own component
    const acTree = {
        nodes: graph.nodes.map((node, index) => ({
            id: index,
            label: node.label,
            component: [node.id],
            level: 0,
            isLeaf: true,
            x: node.x,
            y: node.y
        })),
        edges: [],
        levels: 1
    };

    return {
        acTree,
        sccs: graph.nodes.map(node => [node.id]),
        condensationGraph: graph,
        topologicalOrder: graph.nodes.map((_, index) => index),
        nestingWidth: graph.nodes.length
    };
}

/**
 * Recursive Dijkstra's algorithm using A-C tree decomposition
 * @param {Object} graph - The graph object
 * @param {number} sourceId - The source node ID
 * @param {Object} acTreeResult - A-C tree construction result
 * @returns {Object} Result containing distances, predecessors, steps, and operation count
 */
export function runRecursiveDijkstra(graph, sourceId, acTreeResult) {
    const { sccs, topologicalOrder } = acTreeResult;
    const adjacencyList = getAdjacencyList(graph);
    const distances = {};
    const predecessors = {};
    const steps = [];
    let operations = 0;

    // Initialize distances
    graph.nodes.forEach(node => {
        distances[node.id] = node.id === sourceId ? 0 : Infinity;
        predecessors[node.id] = null;
    });

    // Find which SCC contains the source
    let sourceSCCIndex = -1;
    sccs.forEach((scc, index) => {
        if (scc.includes(sourceId)) {
            sourceSCCIndex = index;
        }
    });

    if (sourceSCCIndex === -1) {
        throw new Error('Source node not found in any SCC');
    }

    // Process SCCs in topological order starting from source SCC
    const processedSCCs = new Set();
    const recursionStack = [];

    function recursiveDijkstraHelper(sccIndex, currentDistances) {
        operations++;
        const scc = sccs[sccIndex];

        // Add to recursion stack for visualization
        recursionStack.push(scc);

        // Record step
        steps.push({
            visited: Array.from(processedSCCs).flatMap(i => sccs[i]),
            currentComponent: scc,
            recursionStack: recursionStack.map(comp => [...comp]),
            distances: { ...currentDistances },
            operation: 'enter_component'
        });

        // Run Dijkstra within this SCC
        const subgraph = createSubgraph(graph, scc);
        const localResult = runDijkstraInSubgraph(subgraph, currentDistances, scc);

        // Update distances with local results
        Object.keys(localResult.distances).forEach(nodeId => {
            const id = parseInt(nodeId);
            if (localResult.distances[id] < currentDistances[id]) {
                currentDistances[id] = localResult.distances[id];
                predecessors[id] = localResult.predecessors[id];
            }
        });

        operations += localResult.operations;
        processedSCCs.add(sccIndex);

        // Record completion step
        steps.push({
            visited: Array.from(processedSCCs).flatMap(i => sccs[i]),
            currentComponent: scc,
            recursionStack: recursionStack.map(comp => [...comp]),
            distances: { ...currentDistances },
            operation: 'complete_component'
        });

        // Find outgoing edges to other SCCs
        const outgoingSCCs = new Set();
        scc.forEach(nodeId => {
            adjacencyList[nodeId].forEach(edge => {
                sccs.forEach((otherSCC, otherIndex) => {
                    if (otherIndex !== sccIndex &&
                        otherSCC.includes(edge.target) &&
                        !processedSCCs.has(otherIndex)) {

                        // Update distance to entry points in other SCCs
                        const newDistance = currentDistances[nodeId] + edge.weight;
                        if (newDistance < currentDistances[edge.target]) {
                            currentDistances[edge.target] = newDistance;
                            predecessors[edge.target] = nodeId;
                        }

                        outgoingSCCs.add(otherIndex);
                    }
                });
            });
        });

        // Recursively process reachable SCCs
        outgoingSCCs.forEach(targetSCCIndex => {
            if (topologicalOrder.indexOf(targetSCCIndex) > topologicalOrder.indexOf(sccIndex)) {
                recursiveDijkstraHelper(targetSCCIndex, currentDistances);
            }
        });

        // Remove from recursion stack
        recursionStack.pop();
    }

    // Start the recursive algorithm
    const workingDistances = { ...distances };
    recursiveDijkstraHelper(sourceSCCIndex, workingDistances);

    // Copy final distances
    Object.keys(workingDistances).forEach(nodeId => {
        distances[parseInt(nodeId)] = workingDistances[nodeId];
    });

    return {
        result: { distances, predecessors },
        steps,
        operations
    };
}

/**
 * Runs Dijkstra within a subgraph (SCC)
 * @param {Object} subgraph - The subgraph to process
 * @param {Object} initialDistances - Initial distances from outside the subgraph
 * @param {Array} sccNodes - Nodes in this SCC
 * @returns {Object} Local distances and predecessors
 */
function runDijkstraInSubgraph(subgraph, initialDistances, sccNodes) {
    const adjacencyList = getAdjacencyList(subgraph);
    const distances = {};
    const predecessors = {};
    const visited = new Set();
    let operations = 0;

    // Initialize distances for subgraph
    subgraph.nodes.forEach(node => {
        distances[node.id] = initialDistances[node.id] || Infinity;
        predecessors[node.id] = null;
    });

    // Find entry points (nodes with finite initial distance)
    const entryPoints = sccNodes.filter(nodeId =>
        initialDistances[nodeId] !== undefined &&
        initialDistances[nodeId] < Infinity
    );

    if (entryPoints.length === 0) {
        return { distances, predecessors, operations };
    }

    const pq = new PriorityQueue();
    entryPoints.forEach(nodeId => {
        pq.enqueue(nodeId, distances[nodeId]);
    });

    while (!pq.isEmpty()) {
        operations++;
        const currentId = pq.dequeue();

        if (visited.has(currentId)) {
            continue;
        }

        visited.add(currentId);

        // Process neighbors within subgraph
        if (adjacencyList[currentId]) {
            adjacencyList[currentId].forEach(edge => {
                operations++;
                const neighborId = edge.target;
                const newDistance = distances[currentId] + edge.weight;

                if (newDistance < distances[neighborId]) {
                    distances[neighborId] = newDistance;
                    predecessors[neighborId] = currentId;

                    if (!visited.has(neighborId)) {
                        pq.enqueue(neighborId, newDistance);
                    }
                }
            });
        }
    }

    return { distances, predecessors, operations };
}

/**
 * Gets the shortest path from source to target
 * @param {Object} result - Result from Dijkstra's algorithm
 * @param {number} sourceId - Source node ID
 * @param {number} targetId - Target node ID
 * @returns {Array} Array of node IDs representing the shortest path
 */
export function getShortestPath(result, sourceId, targetId) {
    const { predecessors } = result;
    const path = [];
    let current = targetId;

    while (current !== null) {
        path.unshift(current);
        current = predecessors[current];
    }

    // Return empty array if no path exists
    if (path[0] !== sourceId) {
        return [];
    }

    return path;
}

/**
 * Compares the performance of both algorithms
 * @param {Object} dijkstraResult - Standard Dijkstra result
 * @param {Object} recursiveResult - Recursive Dijkstra result
 * @param {Object} acTreeResult - A-C tree construction result
 * @returns {Object} Performance comparison
 */
export function compareAlgorithmPerformance(dijkstraResult, recursiveResult, acTreeResult) {
    return {
        standardOperations: dijkstraResult.operations,
        recursiveOperations: recursiveResult.operations,
        improvement: dijkstraResult.operations > 0
            ? (dijkstraResult.operations - recursiveResult.operations) / dijkstraResult.operations
            : 0,
        nestingWidth: acTreeResult.nestingWidth,
        sccs: acTreeResult.sccs.length,
        levels: acTreeResult.acTree.levels
    };
}
