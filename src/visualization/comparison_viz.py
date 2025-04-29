import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import numpy as np


def visualize_graph(G, ax, pos=None, title="Graph"):
    if pos is None:
        pos = nx.spring_layout(G, seed=42)

    nx.draw_networkx_nodes(G, pos, ax=ax, node_size=500, node_color='lightblue')
    nx.draw_networkx_labels(G, pos, ax=ax)

    # Draw edges with weights
    edge_labels = {(u, v): d.get('weight', 1) for u, v, d in G.edges(data=True)}
    nx.draw_networkx_edges(G, pos, ax=ax, arrows=True)
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, ax=ax)

    ax.set_title(title)
    ax.axis('off')

    return pos


def visualize_tree(T, ax, pos=None, title="Tree"):
    if pos is None:
        pos = nx.spring_layout(T, seed=42)

    nx.draw_networkx_nodes(T, pos, ax=ax, node_size=500, node_color='lightgreen')
    nx.draw_networkx_labels(T, pos, ax=ax)
    nx.draw_networkx_edges(T, pos, ax=ax, arrows=True)

    ax.set_title(title)
    ax.axis('off')

    return pos


def visualize_ac_tree(G, ac_tree, ax, pos=None, title="A-C Tree"):
    # create a graph from the ac_tree structure for visualization
    AC = nx.DiGraph()

    # add all nodes
    AC.add_nodes_from(G.nodes())

    # add edges based on the AC tree structure
    for node, components in ac_tree.items():
        for component in components:
            for child in component:
                AC.add_edge(node, child)

    if pos is None:
        pos = nx.spring_layout(AC, seed=42)

    # color nodes based on their level in the AC tree
    node_colors = []
    for node in AC.nodes():
        # count how many parents the node has
        level = 0
        current = node
        while current in AC.nodes() and AC.in_degree(current) > 0:
            level += 1
            current = list(AC.predecessors(current))[0]

        # use a color gradient based on level
        color = plt.cm.viridis(level / (max(1, AC.number_of_nodes() // 2)))
        node_colors.append(color)

    nx.draw_networkx_nodes(AC, pos, ax=ax, node_size=500, node_color=node_colors)
    nx.draw_networkx_labels(AC, pos, ax=ax)
    nx.draw_networkx_edges(AC, pos, ax=ax, arrows=True)

    # highlight the strongly connected components
    for node, components in ac_tree.items():
        for i, component in enumerate(components):
            if len(component) > 1:
                # draw a boundary around the component
                component_pos = {n: pos[n] for n in component}
                x, y = zip(*[component_pos[n] for n in component])
                hull = ax.scatter(x, y, s=2000, alpha=0.2,
                                  c=plt.cm.tab10(i % 10), edgecolors='none')
                # add a label for the component
                center_x = sum(x) / len(x)
                center_y = sum(y) / len(y)
                ax.text(center_x, center_y, f"SCC {i + 1}",
                        ha='center', va='center', fontsize=8)

    ax.set_title(title)
    ax.axis('off')

    return pos


def visualize_heap_comparisons(operations_dijkstra, operations_recursive, ax, title="Heap Operations"):
    # extract operation counts
    ops_types = ['extract_min', 'decrease_key']
    dijkstra_counts = [operations_dijkstra.get(op, 0) for op in ops_types]
    recursive_counts = [operations_recursive.get(op, 0) for op in ops_types]

    x = np.arange(len(ops_types))
    width = 0.35

    ax.bar(x - width / 2, dijkstra_counts, width, label="Dijkstra's")
    ax.bar(x + width / 2, recursive_counts, width, label="Recursive Dijkstra's")

    ax.set_xticks(x)
    ax.set_xticklabels(ops_types)
    ax.set_ylabel('Number of Operations')
    ax.set_title(title)
    ax.legend()

    # add text with exact values
    for i, v in enumerate(dijkstra_counts):
        ax.text(i - width / 2, v + 0.5, str(v), ha='center')

    for i, v in enumerate(recursive_counts):
        ax.text(i + width / 2, v + 0.5, str(v), ha='center')


def visualize_comparison(G, source, ac_tree,
                         distances_dijkstra, paths_dijkstra,
                         distances_recursive, paths_recursive,
                         operations_dijkstra, operations_recursive):
    # create figure with multiple subplots
    fig, axs = plt.subplots(2, 2, figsize=(15, 12))
    fig.subplots_adjust(hspace=0.3, wspace=0.3)

    # original Graph
    pos = visualize_graph(G, axs[0, 0], title="Original Graph")

    # dominator Tree
    dom_tree = nx.DiGraph()
    for node, components in ac_tree.items():
        for component in components:
            for child in component:
                dom_tree.add_edge(node, child)

    visualize_tree(dom_tree, axs[0, 1], pos=pos, title="Dominator Tree")

    # a-c Tree Visualization
    visualize_ac_tree(G, ac_tree, axs[1, 0], pos=pos, title="A-C Tree")

    # heap Operations Comparison
    visualize_heap_comparisons(operations_dijkstra, operations_recursive, axs[1, 1])

    # add overall title
    fig.suptitle("Comparison: Dijkstra's vs. A-C Tree-based Algorithm", fontsize=16)

    plt.tight_layout()
    plt.subplots_adjust(top=0.9)