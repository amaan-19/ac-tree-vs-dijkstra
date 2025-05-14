import React from 'react';

/**
 * Component for showing algorithm steps side by side
 */
const AlgorithmStepsView = ({
    graph,
    currentStep,
    algorithmSteps
}) => {
    // Handle the case where we don't have steps yet
    if (!algorithmSteps || !algorithmSteps.dijkstra || !algorithmSteps.recursiveDijkstra) {
        return (
            <div className="text-center p-4">
                <p>Run the algorithms to see the steps</p>
            </div>
        );
    }

    // Get current step data from both algorithms
    const dijkstraStep = algorithmSteps.dijkstra[Math.min(currentStep, algorithmSteps.dijkstra.length - 1)];
    const recursiveStep = algorithmSteps.recursiveDijkstra[Math.min(currentStep, algorithmSteps.recursiveDijkstra.length - 1)];

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
                <h3 className="text-lg font-semibold border-b pb-2 mb-2">Dijkstra's Algorithm</h3>
                {dijkstraStep && (
                    <div>
                        <div className="mb-2">
                            <p className="font-medium">Visited Nodes:</p>
                            <p className="bg-gray-100 p-2 rounded">
                                {dijkstraStep.visited.length > 0
                                    ? dijkstraStep.visited.join(', ')
                                    : 'None'}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="font-medium">Current Queue:</p>
                            <p className="bg-gray-100 p-2 rounded">
                                {dijkstraStep.queue.length > 0
                                    ? dijkstraStep.queue.join(', ')
                                    : 'Empty'}
                            </p>
                        </div>

                        <div>
                            <p className="font-medium">Distances:</p>
                            <div className="max-h-60 overflow-y-auto">
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border">Node</th>
                                            <th className="py-2 px-4 border">Distance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {graph.nodes.map(node => (
                                            <tr key={node.id}>
                                                <td className="py-2 px-4 border">{node.label}</td>
                                                <td className="py-2 px-4 border">
                                                    {dijkstraStep.distances[node.id] === Infinity
                                                        ? '∞'
                                                        : dijkstraStep.distances[node.id]}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full md:w-1/2">
                <h3 className="text-lg font-semibold border-b pb-2 mb-2">Recursive Dijkstra's Algorithm</h3>
                {recursiveStep && (
                    <div>
                        <div className="mb-2">
                            <p className="font-medium">Visited Nodes:</p>
                            <p className="bg-gray-100 p-2 rounded">
                                {recursiveStep.visited.length > 0
                                    ? recursiveStep.visited.join(', ')
                                    : 'None'}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="font-medium">Current Component:</p>
                            <p className="bg-gray-100 p-2 rounded">
                                {recursiveStep.currentComponent && recursiveStep.currentComponent.length > 0
                                    ? recursiveStep.currentComponent.join(', ')
                                    : 'None'}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="font-medium">Recursion Stack:</p>
                            <p className="bg-gray-100 p-2 rounded">
                                {recursiveStep.recursionStack && recursiveStep.recursionStack.length > 0
                                    ? recursiveStep.recursionStack.map(comp =>
                                        comp.join(',')).join(' → ')
                                    : 'Empty'}
                            </p>
                        </div>

                        <div>
                            <p className="font-medium">Distances:</p>
                            <div className="max-h-60 overflow-y-auto">
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border">Node</th>
                                            <th className="py-2 px-4 border">Distance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {graph.nodes.map(node => (
                                            <tr key={node.id}>
                                                <td className="py-2 px-4 border">{node.label}</td>
                                                <td className="py-2 px-4 border">
                                                    {recursiveStep.distances[node.id] === Infinity
                                                        ? '∞'
                                                        : recursiveStep.distances[node.id]}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlgorithmStepsView;