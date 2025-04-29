import networkx as nx
from collections import defaultdict
from src.algorithms.dominator import construct_dominator_tree


def construct_ac_tree(G, source):

    # construct the dominator tree
    dom_tree = construct_dominator_tree(G, source)

    # for each node in the dominator tree, compute its graph G_a
    ac_tree = {}

    for node in dom_tree.nodes():
        # get descendants of the node in the dominator tree
        descendants = set(nx.descendants(dom_tree, node)) | {node}

        # get children of the node in the dominator tree
        children = list(dom_tree.successors(node))

        if not children:
            # leaf node, no components
            ac_tree[node] = []
            continue

        # create graph G_a with children as nodes
        G_a = nx.DiGraph()
        G_a.add_nodes_from(children)

        # add edges to G_a if there's a path in G[D(a)]
        # for each pair of distinct children
        for i, child1 in enumerate(children):
            # get descendants of child1 in dominator tree
            desc1 = set(nx.descendants(dom_tree, child1)) | {child1}

            for child2 in children[i + 1:]:
                if child1 == child2:
                    continue

                # get descendants of child2 in dominator tree
                desc2 = set(nx.descendants(dom_tree, child2)) | {child2}

                # check if there's an edge from desc1 to desc2 in G
                edge_exists = False
                for u in desc1:
                    for v in desc2:
                        if G.has_edge(u, v):
                            G_a.add_edge(child1, child2)
                            edge_exists = True
                            break
                    if edge_exists:
                        break

                # check for edge in reverse direction
                edge_exists = False
                for u in desc2:
                    for v in desc1:
                        if G.has_edge(u, v):
                            G_a.add_edge(child2, child1)
                            edge_exists = True
                            break
                    if edge_exists:
                        break

        # find strongly connected components in G_a
        sccs = list(nx.strongly_connected_components(G_a))

        # create a condensation graph for topological sorting
        scc_graph = nx.DiGraph()
        scc_map = {}  # map nodes to their SCC

        for i, scc in enumerate(sccs):
            scc_graph.add_node(i)
            for node in scc:
                scc_map[node] = i

        # add edges between SCCs
        for u, v in G_a.edges():
            u_scc = scc_map[u]
            v_scc = scc_map[v]
            if u_scc != v_scc:
                scc_graph.add_edge(u_scc, v_scc)

        # get topological order of SCCs
        try:
            topo_order = list(nx.topological_sort(scc_graph))
            ordered_sccs = [sccs[i] for i in topo_order]
            ac_tree[node] = ordered_sccs
        except nx.NetworkXUnfeasible:
            # no valid topological order (shouldn't happen by construction)
            ac_tree[node] = sccs

    return ac_tree