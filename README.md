# A-C Tree Visualization Tool

This repository contains a visualization tool for the paper "Faster shortest-path algorithms using the acyclic-connected tree" by Elis Stefansson, Oliver Biggar, and Karl H. Johansson (2025).

## Overview

The A-C Tree Visualization Tool demonstrates how the acyclic-connected tree (A-C tree) decomposition can be used to create faster shortest-path algorithms for certain classes of graphs. This visualization tool allows you to:

1. Explore the A-C tree decomposition of directed graphs
2. Compare the performance of standard Dijkstra's algorithm with the Recursive Dijkstra's algorithm
3. Visualize the step-by-step execution of both algorithms
4. Understand how the nesting width affects algorithm performance

## Paper Summary

The paper introduces a fixed-parameter linear algorithm for the single-source shortest path problem (SSSP) on directed graphs. The parameter is the "nesting width," which measures how much a graph can be represented as a nested collection of graphs.

Key contributions:
- Introduction of the acyclic-connected tree (A-C tree) decomposition
- Proof that the A-C tree width equals the nesting width of a graph
- Linear-time algorithm for constructing the A-C tree
- A variant of Dijkstra's algorithm with time complexity O(e + n log w), where w is the nesting width

The algorithm provides asymptotic improvement over standard Dijkstra's algorithm for graphs with small nesting width, reducing to linear time for directed acyclic graphs (DAGs) and other graphs with bounded width.

## Project Structure

```
ac-tree-visualization/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ACTreeVisualization.jsx       # Main visualization component
│   │   ├── GraphCanvas.jsx               # Graph rendering component
│   │   ├── ControlPanel.jsx              # Algorithm control UI
│   │   ├── PerformanceCharts.jsx         # Performance comparison charts
│   │   └── AlgorithmStepsView.jsx        # Step-by-step algorithm execution view
│   ├── algorithms/
│   │   ├── ac-tree-algorithm.js          # Core A-C tree implementation
│   │   ├── graph-utils.js                # Graph manipulation utilities
│   │   └── priority-queue.js             # Priority queue implementation
│   ├── App.jsx                           # Main application component
│   ├── index.jsx                         # Application entry point
│   └── styles.css                        # Global styles
├── package.json
├── README.md
└── LICENSE
```

## Installation and Usage

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ac-tree-visualization.git
   cd ac-tree-visualization
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Features

- **Interactive Graph Editing**: Create and modify directed graphs with weighted edges
- **A-C Tree Visualization**: View the A-C tree decomposition of your graph
- **Algorithm Comparison**: Compare the performance of standard Dijkstra's and Recursive Dijkstra's algorithms
- **Step-by-Step Execution**: Walk through each algorithm step by step to understand how they work
- **Performance Analysis**: See how the nesting width affects algorithm performance
- **Preset Examples**: Load example graphs from the paper to explore key concepts

## Implementation Details

The core algorithm implementations follow the paper closely:

1. **Dominator Tree Computation**: Implements the linear-time algorithm for computing the dominator tree
2. **A-C Tree Construction**: Builds the A-C tree by finding strongly connected components in topological order
3. **Recursive Dijkstra's Algorithm**: Implements the optimization described in the paper

## License

MIT

## Citation

If you use this visualization tool in your research, please cite the original paper:

```
Stefansson, E., Biggar, O., & Johansson, K. H. (2025). Faster shortest-path algorithms using the acyclic-connected tree. arXiv:2504.08667v1 [cs.DS].
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
