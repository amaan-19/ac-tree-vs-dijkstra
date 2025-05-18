import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    ScatterPlot,
    Scatter
} from 'recharts';

/**
 * Component for displaying performance analysis charts
 */
const PerformanceCharts = ({ results, graph }) => {
    if (!results || !results.performance) {
        return (
            <div className="text-center p-8 bg-gray-100 rounded">
                <p>No performance data available. Run the algorithms first.</p>
            </div>
        );
    }

    const { performance } = results;

    // Prepare data for charts
    const operationComparisonData = [
        {
            algorithm: 'Standard Dijkstra',
            operations: performance.dijkstraOperations,
            color: '#3b82f6'
        },
        {
            algorithm: 'Recursive Dijkstra',
            operations: performance.recursiveOperations,
            color: '#10b981'
        }
    ];

    // Calculate improvement percentage
    const improvementPercent = performance.dijkstraOperations > 0
        ? ((performance.dijkstraOperations - performance.recursiveOperations) / performance.dijkstraOperations * 100)
        : 0;

    // Theoretical vs Actual complexity data
    const complexityData = [
        {
            type: 'Standard Dijkstra',
            theoretical: 'O((V + E) log V)',
            actual: performance.dijkstraOperations,
            nodes: graph.nodes.length,
            edges: graph.edges.length
        },
        {
            type: 'Recursive Dijkstra',
            theoretical: 'O(E + V log w)',
            actual: performance.recursiveOperations,
            nestingWidth: performance.nestingWidth
        }
    ];

    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Performance metrics summary
    const performanceMetrics = [
        {
            name: 'Operations Saved',
            value: Math.max(0, performance.dijkstraOperations - performance.recursiveOperations),
            color: '#10b981'
        },
        {
            name: 'Improvement',
            value: `${improvementPercent.toFixed(1)}%`,
            color: improvementPercent > 0 ? '#10b981' : '#ef4444'
        },
        {
            name: 'Nesting Width',
            value: performance.nestingWidth,
            color: '#8b5cf6'
        }
    ];

    // Graph characteristics
    const graphCharacteristics = [
        { name: 'Nodes', value: graph.nodes.length },
        { name: 'Edges', value: graph.edges.length },
        { name: 'SCCs', value: results.acTree?.sccs?.length || 'N/A' },
        { name: 'A-C Tree Levels', value: results.acTree?.acTree?.levels || 'N/A' }
    ];

    // Time complexity visualization data
    const timeComplexityData = [];
    for (let n = 10; n <= 100; n += 10) {
        const e = Math.floor(n * 1.5); // Assume edges ~= 1.5 * nodes
        const w = Math.min(n, performance.nestingWidth * (n / graph.nodes.length));

        timeComplexityData.push({
            nodes: n,
            dijkstra: (e + n) * Math.log2(n),
            recursive: e + n * Math.log2(Math.max(1, w)),
            improvement: ((e + n) * Math.log2(n)) - (e + n * Math.log2(Math.max(1, w)))
        });
    }

    return (
        <div className="space-y-8">
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {performanceMetrics.map((metric, index) => (
                    <div key={index} className="bg-white border rounded-lg p-6 text-center shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">{metric.name}</h3>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: metric.color }}
                        >
                            {metric.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Operations Comparison Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Operation Count Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={operationComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="algorithm" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="operations"
                            fill="#3b82f6"
                            name="Number of Operations"
                        >
                            {operationComparisonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        <strong>Interpretation:</strong> Lower bars indicate better performance.
                        {improvementPercent > 0
                            ? ` Recursive Dijkstra achieved ${improvementPercent.toFixed(1)}% fewer operations.`
                            : ' No improvement was achieved in this case.'
                        }
                    </p>
                </div>
            </div>

            {/* Graph Characteristics */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Graph Characteristics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {graphCharacteristics.map((char, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">{char.name}</p>
                            <p className="text-2xl font-bold text-gray-800">{char.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Complexity Comparison */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Theoretical Time Complexity Growth</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeComplexityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="nodes"
                            label={{ value: 'Number of Nodes', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis
                            label={{ value: 'Operations (scaled)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            formatter={(value, name) => [Math.round(value), name]}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="dijkstra"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Standard Dijkstra O((V+E)log V)"
                        />
                        <Line
                            type="monotone"
                            dataKey="recursive"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Recursive Dijkstra O(E + V log w)"
                        />
                        <Line
                            type="monotone"
                            dataKey="improvement"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Performance Difference"
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        <strong>Note:</strong> This chart shows theoretical complexity growth.
                        Real performance depends on graph structure and nesting width.
                        The benefit of recursive Dijkstra increases with larger graphs that have small nesting width.
                    </p>
                </div>
            </div>

            {/* Algorithm Efficiency Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Algorithm Efficiency Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Efficiency Metrics */}
                    <div>
                        <h4 className="text-lg font-medium mb-3">Efficiency Metrics</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                <span>Operations per Node</span>
                                <div className="text-right">
                                    <div className="text-sm text-blue-600">
                                        Standard: {(performance.dijkstraOperations / graph.nodes.length).toFixed(1)}
                                    </div>
                                    <div className="text-sm text-green-600">
                                        Recursive: {(performance.recursiveOperations / graph.nodes.length).toFixed(1)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                <span>Nesting Width Impact</span>
                                <div className="text-right">
                                    <div className="text-sm">
                                        Width: {performance.nestingWidth} / {graph.nodes.length}
                                    </div>
                                    <div className="text-sm text-purple-600">
                                        Ratio: {(performance.nestingWidth / graph.nodes.length * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                <span>SCC Decomposition</span>
                                <div className="text-right">
                                    <div className="text-sm">
                                        {results.acTree?.sccs?.length || 0} components
                                    </div>
                                    <div className="text-sm text-green-600">
                                        Avg size: {results.acTree?.sccs ?
                                            (graph.nodes.length / results.acTree.sccs.length).toFixed(1)
                                            : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Recommendation */}
                    <div>
                        <h4 className="text-lg font-medium mb-3">Performance Recommendation</h4>
                        <div className="p-4 border rounded-lg">
                            {improvementPercent > 10 ? (
                                <div className="text-green-800">
                                    <p className="font-medium text-lg">✅ Recursive Dijkstra Recommended</p>
                                    <p className="text-sm mt-2">
                                        The graph structure benefits significantly from A-C tree decomposition.
                                        Recursive Dijkstra saves {improvementPercent.toFixed(1)}% operations.
                                    </p>
                                </div>
                            ) : improvementPercent > 0 ? (
                                <div className="text-yellow-800">
                                    <p className="font-medium text-lg">⚠️ Marginal Improvement</p>
                                    <p className="text-sm mt-2">
                                        Small improvement ({improvementPercent.toFixed(1)}%).
                                        Standard Dijkstra might be simpler for this graph.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-red-800">
                                    <p className="font-medium text-lg">❌ No Improvement</p>
                                    <p className="text-sm mt-2">
                                        Standard Dijkstra performs better for this graph structure.
                                        High nesting width limits the benefits of decomposition.
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Key factors:</strong></p>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>Nesting width: {performance.nestingWidth} (lower is better)</li>
                                    <li>Graph density: {(graph.edges.length / (graph.nodes.length * (graph.nodes.length - 1))).toFixed(3)}</li>
                                    <li>SCC structure: {results.acTree?.sccs?.length || 0} components</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Complexity Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Algorithm Complexity Details</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-4 py-2 text-left">Algorithm</th>
                                <th className="border border-gray-200 px-4 py-2 text-left">Theoretical Complexity</th>
                                <th className="border border-gray-200 px-4 py-2 text-left">Actual Operations</th>
                                <th className="border border-gray-200 px-4 py-2 text-left">Key Parameters</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2 font-medium">Standard Dijkstra</td>
                                <td className="border border-gray-200 px-4 py-2">O((V + E) log V)</td>
                                <td className="border border-gray-200 px-4 py-2">{performance.dijkstraOperations}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    V = {graph.nodes.length}, E = {graph.edges.length}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2 font-medium">Recursive Dijkstra</td>
                                <td className="border border-gray-200 px-4 py-2">O(E + V log w)</td>
                                <td className="border border-gray-200 px-4 py-2">{performance.recursiveOperations}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    w = {performance.nestingWidth} (nesting width)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        <strong>Understanding the results:</strong> The recursive algorithm's advantage comes from
                        the logarithmic factor being applied to the nesting width (w) instead of the total number
                        of vertices (V). When w ≪ V, significant speedups are possible.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCharts;