# A-C Tree Visualization Tool

A React web app for visualizing the Acyclic-Connected Tree (A-C Tree) decomposition and comparing standard vs. recursive Dijkstra's shortest-path algorithms.

Based on the research paper "Faster shortest-path algorithms using the acyclic-connected tree" by Stefansson, Biggar, and Johansson (2025).

## What it does

- Visualizes directed weighted graphs
- Shows A-C tree decomposition into strongly connected components (SCCs)
- Compares performance of standard Dijkstra vs. recursive Dijkstra algorithms
- Demonstrates when the recursive approach can be more efficient

## Getting Started

```bash
git clone https://github.com/your-username/ac-tree-visualization.git
cd ac-tree-visualization
npm install
npm start
```

Open http://localhost:3000 in your browser.

## Usage

1. Load an example graph or generate a random one
2. Click "Run Algorithms" to compare both approaches
3. Use the view controls to explore different visualizations
4. Check the performance analysis to see operation counts

## Key Concepts

**A-C Tree**: Decomposes graphs into strongly connected components arranged in a tree structure

**Nesting Width**: A parameter that determines how much the recursive algorithm can improve performance

**Performance**: Recursive Dijkstra achieves O(E + V log w) vs. standard O((V + E) log V), where w is the nesting width

## When it helps

Graphs with small nesting width (w ≪ V) show the most improvement. Dense graphs with high nesting width may not benefit.

## Tech Stack

- React 18
- Recharts for performance charts
- Canvas for graph visualization
- Tailwind CSS for styling

## Citation

```bibtex
@article{stefansson2025ac,
  title={Faster shortest-path algorithms using the acyclic-connected tree},
  author={Stefansson, Elis and Biggar, Oliver and Johansson, Karl H.},
  journal={arXiv preprint arXiv:2504.08667v1},
  year={2025}
}
```

## License

MIT
