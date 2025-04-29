import networkx as nx
import matplotlib as mpl
import matplotlib.pyplot as plt


def print_graph(G):
    seed = 69420  # seed random number generators for reproducibility hehe
    pos = nx.spring_layout(G, seed=seed)  # fancy built-in algorithm to position nodes
    M = G.number_of_edges() # number of edges
    edge_colors = range(2, M + 2)

    nodes = nx.draw_networkx_nodes(G, pos, node_color="indigo")
    edges = nx.draw_networkx_edges(
        G,
        pos,
        arrowstyle="->",
        arrowsize=10,
        edge_color=edge_colors,
        width=2,
    )

    pc = mpl.collections.PatchCollection(edges)
    pc.set_array(edge_colors)

    ax = plt.gca()
    ax.set_axis_off()
    plt.colorbar(pc, ax=ax)
    plt.show()
