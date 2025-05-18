import React, { useState } from 'react';
import GraphCanvas from './components/GraphCanvas';
import ControlPanel from './components/ControlPanel';
import AlgorithmStepsView from './components/AlgorithmStepsView';
import ACTreeVisualization from './components/ACTreeVisualization';
import PerformanceCharts from './components/PerformanceCharts';
import { generateRandomGraph, generateExampleGraph } from './algorithms/graph-utils';
import { runDijkstra, runRecursiveDijkstra, constructACTree } from './algorithms/ac-tree-algorithms';

function App() {
    // Graph state
    const [graph, setGraph] = useState(() => generateExampleGraph());
    const [selectedNode, setSelectedNode] = useState(null);

    // Visualization state
    const [viewMode, setViewMode] = useState('graph');
    const [acTree, setACTree] = useState(null);
    const [algorithmResults, setAlgorithmResults] = useState(null);
    const [algorithmSteps, setAlgorithmSteps] = useState(null);

    // Animation state
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [maxSteps, setMaxSteps] = useState(0);

    // Graph manipulation functions
    const handleGenerateRandomGraph = () => {
        const newGraph = generateRandomGraph();
        setGraph(newGraph);
        resetVisualization();
    };

    const handleLoadExampleGraph = () => {
        const newGraph = generateExampleGraph();
        setGraph(newGraph);
        resetVisualization();
    };

    const resetVisualization = () => {
        setAlgorithmResults(null);
        setAlgorithmSteps(null);
        setACTree(null);
        setCurrentStep(0);
        setMaxSteps(0);
        setIsRunning(false);
    };

    // Algorithm execution
    const runAlgorithms = async () => {
        if (graph.nodes.length === 0) {
            alert('Please create a graph first');
            return;
        }

        // Find a source node (first node if none selected)
        const sourceId = selectedNode || graph.nodes[0].id;

        try {
            // Run standard Dijkstra
            const dijkstraResult = runDijkstra(graph, sourceId);

            // Construct A-C tree
            const acTreeResult = constructACTree(graph);

            // Run recursive Dijkstra
            const recursiveResult = runRecursiveDijkstra(graph, sourceId, acTreeResult);

            // Store results
            setAlgorithmResults({
                dijkstra: dijkstraResult.result,
                recursive: recursiveResult.result,
                performance: {
                    dijkstraOperations: dijkstraResult.operations,
                    recursiveOperations: recursiveResult.operations,
                    nestingWidth: acTreeResult.nestingWidth
                }
            });

            // Store steps for visualization
            setAlgorithmSteps({
                dijkstra: dijkstraResult.steps,
                recursiveDijkstra: recursiveResult.steps
            });

            setACTree(acTreeResult);
            setMaxSteps(Math.max(dijkstraResult.steps.length, recursiveResult.steps.length));
            setCurrentStep(0);

        } catch (error) {
            console.error('Error running algorithms:', error);
            alert('Error running algorithms: ' + error.message);
        }
    };

    // Animation controls
    const toggleAnimation = () => {
        setIsRunning(!isRunning);
    };

    const resetAnimation = () => {
        setCurrentStep(0);
        setIsRunning(false);
    };

    const stepForward = () => {
        if (currentStep < maxSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const stepBackward = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Auto-advance animation
    React.useEffect(() => {
        if (isRunning && currentStep < maxSteps - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 1000); // 1 second delay

            return () => clearTimeout(timer);
        } else if (currentStep >= maxSteps - 1) {
            setIsRunning(false);
        }
    }, [isRunning, currentStep, maxSteps]);

    // Render different views
    const renderContent = () => {
        switch (viewMode) {
            case 'graph':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Graph Visualization</h2>
                        <GraphCanvas
                            graph={graph}
                            selected={selectedNode}
                            onNodeClick={setSelectedNode}
                            isEditable={true}
                        />
                        <div className="mt-4 text-sm text-gray-600">
                            <p>Click on a node to select it as the source for shortest path algorithms.</p>
                            <p>Selected source: {selectedNode || 'None (will use first node)'}</p>
                        </div>
                    </div>
                );

            case 'acTree':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">A-C Tree Visualization</h2>
                        {acTree ? (
                            <ACTreeVisualization
                                acTree={acTree}
                                graph={graph}
                                currentStep={currentStep}
                                algorithmSteps={algorithmSteps}
                            />
                        ) : (
                            <div className="text-center p-8 bg-gray-100 rounded">
                                <p>Run the algorithms to see the A-C tree visualization</p>
                            </div>
                        )}
                    </div>
                );

            case 'comparison':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Algorithm Step Comparison</h2>
                        <AlgorithmStepsView
                            graph={graph}
                            currentStep={currentStep}
                            algorithmSteps={algorithmSteps}
                        />
                    </div>
                );

            case 'performance':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
                        {algorithmResults ? (
                            <PerformanceCharts
                                results={algorithmResults}
                                graph={graph}
                            />
                        ) : (
                            <div className="text-center p-8 bg-gray-100 rounded">
                                <p>Run the algorithms to see performance analysis</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-blue-600 text-white p-4">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">A-C Tree Visualization Tool</h1>
                    <p className="text-blue-100">
                        Exploring faster shortest-path algorithms using acyclic-connected trees
                    </p>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <ControlPanel
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    isRunning={isRunning}
                    toggleAnimation={toggleAnimation}
                    resetAnimation={resetAnimation}
                    stepForward={stepForward}
                    stepBackward={stepBackward}
                    currentStep={currentStep}
                    maxSteps={maxSteps}
                    runAlgorithm={runAlgorithms}
                    generateRandomGraph={handleGenerateRandomGraph}
                    loadExampleGraph={handleLoadExampleGraph}
                />

                <div className="bg-white rounded-lg shadow p-6">
                    {renderContent()}
                </div>

                {algorithmResults && (
                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Algorithm Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded">
                                <h4 className="font-medium">Standard Dijkstra</h4>
                                <p className="text-sm text-gray-600">
                                    Operations: {algorithmResults.performance.dijkstraOperations}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded">
                                <h4 className="font-medium">Recursive Dijkstra</h4>
                                <p className="text-sm text-gray-600">
                                    Operations: {algorithmResults.performance.recursiveOperations}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded">
                                <h4 className="font-medium">Nesting Width</h4>
                                <p className="text-sm text-gray-600">
                                    Width: {algorithmResults.performance.nestingWidth}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gray-200 p-4 mt-8">
                <div className="container mx-auto text-center text-gray-600">
                    <p>
                        Based on "Faster shortest-path algorithms using the acyclic-connected tree"
                        by Stefansson, Biggar, and Johansson (2025)
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;