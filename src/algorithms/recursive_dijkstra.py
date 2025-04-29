import heapq
from collections import defaultdict


def recursive_dijkstra(G, source, ac_tree, return_operations=False):
    # initialize
    distances = {node: float('infinity') for node in G.nodes()}
    distances[source] = 0

    paths = {node: [] for node in G.nodes()}
    paths[source] = [source]

    # initialize operation counters if needed
    operations = defaultdict(int) if return_operations else None

    # create priority queues for each component
    component_queues = {}
    for node in G.nodes():
        component_queues[node] = []

    # start recursive processing from the source
    _process_node(G, source, ac_tree, distances, paths, component_queues, operations)

    if return_operations:
        return distances, paths, operations
    else:
        return distances, paths


def _process_node(G, node, ac_tree, distances, paths, component_queues, operations):
    # process components in topological order
    for component in ac_tree.get(node, []):
        _process_component(G, component, ac_tree, distances, paths, component_queues, operations)

    # process outgoing edges from the current node
    for neighbor in G.neighbors(node):
        weight = G[node][neighbor].get('weight', 1)
        distance = distances[node] + weight

        if distance < distances[neighbor]:
            distances[neighbor] = distance
            paths[neighbor] = paths[node] + [neighbor]

            # find the component containing the neighbor
            for parent, components in ac_tree.items():
                for component in components:
                    if neighbor in component:
                        # add to the component's queue
                        heapq.heappush(component_queues[parent], (distance, neighbor))
                        if operations is not None:
                            operations['decrease_key'] += 1
                        break


def _process_component(G, component, ac_tree, distances, paths, component_queues, operations):
    # get a representative node from the component to find its parent
    rep_node = next(iter(component))
    parent = None

    # find the parent of this component
    for p, components in ac_tree.items():
        if any(rep_node in c for c in components):
            parent = p
            break

    if parent is None:
        return

    queue = component_queues[parent]

    while queue:
        # extract the minimum distance node
        current_distance, current_node = heapq.heappop(queue)
        if operations is not None:
            operations['extract_min'] += 1

        # if the extracted distance is worse than what we already have, skip
        if current_distance > distances[current_node]:
            continue

        # process the node recursively
        _process_node(G, current_node, ac_tree, distances, paths, component_queues, operations)