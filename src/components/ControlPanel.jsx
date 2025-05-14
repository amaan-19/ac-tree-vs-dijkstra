import React from 'react';

/**
 * Component for controlling algorithm visualization
 */
const ControlPanel = ({
    viewMode,
    setViewMode,
    isRunning,
    toggleAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    currentStep,
    maxSteps,
    runAlgorithm,
    generateRandomGraph,
    loadExampleGraph
}) => {
    return (
        <div className="mb-4 bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Visualization Controls</h2>

            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded ${viewMode === 'graph' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('graph')}
                    >
                        Graph View
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${viewMode === 'acTree' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('acTree')}
                    >
                        A-C Tree View
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${viewMode === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('comparison')}
                    >
                        Algorithm Comparison
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${viewMode === 'performance' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('performance')}
                    >
                        Performance Analysis
                    </button>
                </div>
            </div>

            {(viewMode === 'comparison' || viewMode === 'acTree') && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={toggleAnimation}
                            disabled={!runAlgorithm}
                        >
                            {isRunning ? 'Pause' : 'Play'}
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            onClick={resetAnimation}
                            disabled={!runAlgorithm}
                        >
                            Reset
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={stepBackward}
                            disabled={currentStep <= 0 || !runAlgorithm}
                        >
                            Step Back
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={stepForward}
                            disabled={currentStep >= maxSteps - 1 || !runAlgorithm}
                        >
                            Step Forward
                        </button>
                        {runAlgorithm && (
                            <div className="ml-4">
                                <span className="text-gray-700">Step: {currentStep + 1} / {maxSteps}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={runAlgorithm}
                >
                    Run Algorithms
                </button>
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                    onClick={generateRandomGraph}
                >
                    Generate Random Graph
                </button>
                <button
                    className="px-4 py-2 bg-yellow-600 text-white rounded"
                    onClick={loadExampleGraph}
                >
                    Load Example Graph
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;