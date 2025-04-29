import networkx as nx
import matplotlib.pyplot as plt
from src.algorithms.dijkstra import dijkstras_algorithm
from src.algorithms.ac_tree import construct_ac_tree
from src.algorithms.recursive_dijkstra import recursive_dijkstra
from src.graph.generator import generate_random_graph, generate_hierarchical_graph
from src.visualization.comparison_viz import visualize_comparison
from src.utils.timing import measure_execution_time


def main():
    # create sample graph
    print("Generating sample graph...")
    G = generate_hierarchical_graph(n_components=5, component_size=3, connection_probability=0.3)
    source = 0

    print(f"Graph has {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")

    # run traditional dijkstra's
    print("\nRunning traditional Dijkstra's algorithm...")
    dijkstra_time, (distances_dijkstra, paths_dijkstra, operations_dijkstra) = measure_execution_time(
        dijkstras_algorithm, G, source, return_operations=True
    )

    # construct a-c tree
    print("\nConstructing A-C Tree...")
    ac_tree_time, ac_tree = measure_execution_time(construct_ac_tree, G, source)

    # run recursive dijkstra's algorithm
    print("\nRunning Recursive Dijkstra's algorithm...")
    recursive_time, (distances_recursive, paths_recursvie, operations_recursive) = measure_execution_time(
        recursive_dijkstra, G, source, ac_tree, return_operations=True
    )

    # compare results to ensure correctness
    assert distances_dijkstra == distances_recursive, "Algorithms produced different distances!"

    # display timing results
    print("\nPerformance Comparison:")
    print(f"Dijkstra's Algorithm: {dijkstra_time:.6f} seconds")
    print(f"A-C Tree Construction: {ac_tree_time:.6f} seconds")
    print(f"Recursive Dijkstra's: {recursive_time:.6f} seconds")
    print(f"Total A-C Tree Approach: {ac_tree_time + recursive_time:.6f} seconds")

    # display operation counts
    print("\nOperation Counts:")
    print(f"Dijkstra's Algorithm: {operations_dijkstra['extract_min']} extract-min, "
          f"{operations_dijkstra['decrease_key']} decrease-key operations")
    print(f"Recursive Dijkstra's: {operations_recursive['extract_min']} extract-min, "
          f"{operations_recursive['decrease_key']} decrease-key operations")

    # visualize comparison
    visualize_comparison(G, source, ac_tree,
                         distances_dijkstra, paths_dijkstra,
                         distances_recursive, paths_recursvie,
                         operations_dijkstra, operations_recursive)

    print("\nVisualization complete. Close plot windows to exit.")
    plt.show()


if __name__ == "__main__":
    main()
