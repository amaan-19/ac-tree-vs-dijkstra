# A-C Tree Visualization Tool

An interactive web application for visualizing and understanding the **Acyclic-Connected Tree (A-C Tree)** decomposition and its application to faster shortest-path algorithms, based on the research paper "Faster shortest-path algorithms using the acyclic-connected tree" by Stefansson, Biggar, and Johansson (2025).

![A-C Tree Visualization](https://img.shields.io/badge/React-18.2.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

## 🌟 Features

### Core Visualization
- **Interactive Graph Editing**: Create and modify directed weighted graphs with an intuitive interface
- **A-C Tree Decomposition**: Visualize how graphs are decomposed into strongly connected components (SCCs)
- **Step-by-Step Algorithm Execution**: Watch both standard and recursive Dijkstra's algorithms run step by step
- **Multiple Visualization Modes**: Switch between graph view, A-C tree structure, SCC decomposition, and hierarchical views

### Algorithm Comparison
- **Performance Analysis**: Compare operation counts between standard and recursive Dijkstra's algorithms
- **Real-time Metrics**: Track nesting width, component sizes, and algorithm efficiency
- **Interactive Charts**: Visual performance comparisons with detailed breakdowns
- **Complexity Visualization**: See theoretical vs. actual performance differences

### Educational Tools
- **Preset Examples**: Load example graphs that demonstrate key concepts from the paper
- **Animation Controls**: Play, pause, step forward/backward through algorithm execution
- **Detailed Explanations**: Comprehensive legends and tooltips explaining each concept
- **Mobile-Responsive**: Works on desktop and mobile devices

## 📚 Background

The A-C Tree (Acyclic-Connected Tree) is a novel graph decomposition that enables faster shortest-path algorithms for certain classes of directed graphs. The key insight is that graphs with small "nesting width" can benefit from a recursive approach to Dijkstra's algorithm.

### Key Concepts
- **Nesting Width**: A parameter that measures how much a graph can be represented as nested collections
- **A-C Tree Decomposition**: Breaks graphs into strongly connected components arranged in a tree structure
- **Recursive Dijkstra**: A variant that leverages the A-C tree for improved performance: O(E + V log w) vs. O((V + E) log V)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ac-tree-visualization.git
   cd ac-tree-visualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to access the application

### Building for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/                 # React components
│   ├── ACTreeVisualization.jsx      # A-C tree visualization component
│   ├── AlgorithmStepsView.jsx       # Step-by-step algorithm comparison
│   ├── ControlPanel.jsx             # Main control interface
│   ├── GraphCanvas.jsx              # Graph rendering component
│   └── PerformanceCharts.jsx        # Performance analysis charts
├── algorithms/                # Core algorithm implementations
│   ├── ac-tree-algorithms.js        # A-C tree construction & recursive Dijkstra
│   ├── graph-utils.js              # Graph manipulation utilities
│   └── priority-queue.js           # Priority queue implementation
├── App.jsx                    # Main application component
├── index.jsx                  # Application entry point
└── styles.css                 # Global styles
```

## 🎯 Usage Guide

### Creating Graphs
1. **Load Examples**: Start with predefined graphs that showcase different properties
2. **Generate Random**: Create random graphs to experiment with different structures
3. **Manual Editing**: Click on the canvas to add nodes and edges (planned feature)

### Running Algorithms
1. **Select Source**: Click on a node to set it as the source for shortest-path calculation
2. **Run Algorithms**: Execute both standard and recursive Dijkstra simultaneously
3. **Compare Results**: Analyze performance differences and algorithm behavior

### Visualization Modes
- **Graph View**: See the original graph structure with node and edge weights
- **A-C Tree View**: Visualize the decomposition tree and component structure
- **Algorithm Comparison**: Watch both algorithms execute step by step
- **Performance Analysis**: Detailed charts and metrics comparing algorithm efficiency

### Understanding Results
- **Green nodes/components**: Processed by the algorithm
- **Yellow nodes/components**: Currently being processed
- **Blue nodes/components**: In the recursion stack (recursive algorithm only)
- **Operations count**: Lower numbers indicate better performance

## 🔧 Technical Details

### Algorithm Implementation
The visualization implements the following algorithms from the paper:

1. **Tarjan's Algorithm**: For finding strongly connected components
2. **A-C Tree Construction**: Linear-time algorithm for building the decomposition
3. **Standard Dijkstra**: Classical shortest-path algorithm with detailed step tracking
4. **Recursive Dijkstra**: Optimized variant that leverages A-C tree structure

### Performance Characteristics
- **Best Case**: Graphs with low nesting width (w ≪ V) show significant improvement
- **Worst Case**: Dense graphs with high nesting width may perform similarly to standard Dijkstra
- **Complexity**: O(E + V log w) vs. O((V + E) log V) where w is the nesting width

## 📊 Example Results

The tool demonstrates that:
- **DAGs (Directed Acyclic Graphs)**: Often show dramatic improvements (linear time complexity)
- **Sparse Graphs**: Benefit more from the recursive approach
- **Dense Graphs**: May not show significant improvement due to high nesting width

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Submit a pull request

### Areas for Contribution
- Additional graph generation algorithms
- More visualization modes
- Performance optimizations
- Educational content and tutorials
- Mobile interface improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📖 Citation

If you use this visualization tool in your research or education, please cite the original paper:

```bibtex
@article{stefansson2025ac,
  title={Faster shortest-path algorithms using the acyclic-connected tree},
  author={Stefansson, Elis and Biggar, Oliver and Johansson, Karl H.},
  journal={arXiv preprint arXiv:2504.08667v1},
  year={2025},
  note={cs.DS}
}
```

## 🔗 Related Resources

- [Original Paper (arXiv)](https://arxiv.org/abs/2504.08667v1)
- [React Documentation](https://reactjs.org/)
- [Recharts Documentation](https://recharts.org/)
- [Graph Theory Background](https://en.wikipedia.org/wiki/Graph_theory)

## 🐛 Known Issues

- Canvas interaction for manual graph editing is planned but not yet implemented
- Very large graphs (>100 nodes) may experience performance issues
- Mobile touch interactions could be improved

## 📞 Support

For questions about the visualization tool:
- Open an issue on GitHub
- Contact: [your-email@example.com]

For questions about the algorithm or paper:
- Refer to the original research paper
- Contact the paper authors

---

*Built with ❤️ using React and modern web technologies*