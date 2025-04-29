import networkx as nx
import random


def generate_random_graph(n_nodes=10, edge_probability=0.3, weight_range=(1, 10)):
    G = nx.DiGraph()

    # add nodes
    G.add_nodes_from(range(n_nodes))

    # add random edges
    for i in range(n_nodes):
        for j in range(n_nodes):
            if i != j and random.random() < edge_probability:
                weight = random.randint(weight_range[0], weight_range[1])
                G.add_edge(i, j, weight=weight)

    # ensure graph is connected
    while not nx.is_weakly_connected(G):
        # Add edges until connected
        i, j = random.sample(range(n_nodes), 2)
        if not G.has_edge(i, j):
            weight = random.randint(weight_range[0], weight_range[1])
            G.add_edge(i, j, weight=weight)

    return G


def generate_dag(n_nodes=10, edge_probability=0.3, weight_range=(1, 10)):
    G = nx.DiGraph()

    # add nodes
    G.add_nodes_from(range(n_nodes))

    # add edges only from lower to higher indices to ensure acyclicity
    for i in range(n_nodes):
        for j in range(i + 1, n_nodes):
            if random.random() < edge_probability:
                weight = random.randint(weight_range[0], weight_range[1])
                G.add_edge(i, j, weight=weight)

    return G


def generate_hierarchical_graph(n_components=3, component_size=3,
                                connection_probability=0.2, weight_range=(1, 10)):
    G = nx.DiGraph()

    # create nodes
    n_nodes = n_components * component_size
    G.add_nodes_from(range(n_nodes))

    # create strongly connected components
    for c in range(n_components):
        start_idx = c * component_size
        end_idx = start_idx + component_size

        # make each component strongly connected
        for i in range(start_idx, end_idx):
            for j in range(start_idx, end_idx):
                if i != j:
                    weight = random.randint(weight_range[0], weight_range[1])
                    G.add_edge(i, j, weight=weight)

    # add connections between components (in a DAG-like manner)
    for c1 in range(n_components):
        start_idx1 = c1 * component_size
        end_idx1 = start_idx1 + component_size

        for c2 in range(c1 + 1, n_components):
            start_idx2 = c2 * component_size
            end_idx2 = start_idx2 + component_size

            # add edges from c1 to c2 with probability
            if random.random() < connection_probability:
                # select a random node from c1 and c2
                i = random.randint(start_idx1, end_idx1 - 1)
                j = random.randint(start_idx2, end_idx2 - 1)

                weight = random.randint(weight_range[0], weight_range[1])
                G.add_edge(i, j, weight=weight)

    return G
