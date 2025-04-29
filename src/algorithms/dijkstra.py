import heapq
from collections import defaultdict


def dijkstras_algorithm(G, source, return_operations=False):

    # initialize distances with infinity for all nodes except source
    distances = {node: float('infinity') for node in G.nodes()}
    distances[source] = 0

    # initialize paths
    paths = {node: [] for node in G.nodes()}
    paths[source] = [source]

    # initialize priority queue [(distance, node)]
    queue = [(0, source)]

    # track visited nodes
    visited = set()

    # initialize operation counters if needed
    operations = defaultdict(int) if return_operations else None

    while queue:

        # get node with minimum distance
        current_distance, current_node = heapq.heappop(queue)
        if return_operations:
            operations['extract_min'] += 1

        # if we've already processed this node, skip it
        if current_node in visited:
            continue

        # mark node as visited
        visited.add(current_node)

        # if current distance is greater than stored distance, skip
        if current_distance > distances[current_node]:
            continue

        # process neighbors
        for neighbor in G.neighbors(current_node):
            weight = G[current_node][neighbor].get('weight', 1)
            distance = current_distance + weight

            # if we find a better path, update
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                paths[neighbor] = paths[current_node] + [neighbor]

                # add to priority queue
                heapq.heappush(queue, (distance, neighbor))
                if return_operations:
                    operations['decrease_key'] += 1


    if return_operations:
        return distances, paths, operations
    else:
        return distances, paths