import networkx as nx
from collections import defaultdict, deque


def construct_dominator_tree(G, source):
    # ensure we're working with a DiGraph
    if not isinstance(G, nx.DiGraph):
        G = nx.DiGraph(G)

        # find all reachable nodes using BFS
        reachable = set()
        queue = deque([source])
        while queue:
            node = queue.popleft()
            if node not in reachable:
                reachable.add(node)
                queue.extend(neighbor for neighbor in G.successors(node)
                             if neighbor not in reachable)

        # create subgraph of reachable nodes
        G_reachable = G.subgraph(reachable)

        # computing the post-order of the DFS
        post_order = list(nx.dfs_postorder_nodes(G_reachable, source=source))
        post_order_map = {node: idx for idx, node in enumerate(post_order)}

        # initialize dominators. each node is dominated by all nodes.
        doms = {node: set(reachable) for node in reachable}
        doms[source] = {source}  # the source only dominates itself

        changed = True
        while changed:
            changed = False
            # process nodes in reverse post-order (except the source)
            for node in reversed(post_order[:-1]):  # Skip the source
                # Compute new dominators for the node
                new_doms = set(reachable)  # Start with all nodes

                # intersect with the dominators of each predecessor
                for pred in G_reachable.predecessors(node):
                    new_doms &= doms[pred]

                # a node always dominates itself
                new_doms.add(node)

                # if dominators changed, continue the algorithm
                if new_doms != doms[node]:
                    doms[node] = new_doms
                    changed = True

        # construct immediate dominator tree
        idom = {}  # immediate dominator for each node
        for node in reachable:
            if node == source:
                continue

            # find the immediate dominator (closest dominator in the post-order)
            node_doms = list(doms[node] - {node})
            if node_doms:
                idom[node] = max(node_doms, key=lambda x: post_order_map[x])

        # create the dominator tree
        dominator_tree = nx.DiGraph()
        dominator_tree.add_node(source)

        for node in reachable:
            if node != source:
                dominator_tree.add_node(node)
                dominator_tree.add_edge(idom[node], node)

        return dominator_tree
