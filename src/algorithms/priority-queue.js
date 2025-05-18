/**
 * Priority Queue implementation using a min-heap
 * Used for Dijkstra's algorithm implementation
 */
export class PriorityQueue {
    constructor(compareFn = (a, b) => a.priority - b.priority) {
        this.heap = [];
        this.compare = compareFn;
        this._size = 0;
    }

    /**
     * Gets the parent index of a node
     */
    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    /**
     * Gets the left child index of a node
     */
    leftChild(index) {
        return 2 * index + 1;
    }

    /**
     * Gets the right child index of a node
     */
    rightChild(index) {
        return 2 * index + 2;
    }

    /**
     * Swaps two elements in the heap
     */
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    /**
     * Inserts an element into the priority queue
     * @param {*} element - The element to insert
     * @param {number} priority - The priority of the element (lower = higher priority)
     */
    enqueue(element, priority) {
        const node = { element, priority };
        this.heap.push(node);
        this._size++;
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * Removes and returns the element with the highest priority (lowest priority value)
     * @returns {*} The element with highest priority, or null if queue is empty
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }

        const root = this.heap[0];
        const last = this.heap.pop();
        this._size--;

        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.heapifyDown(0);
        }

        return root.element;
    }

    /**
     * Returns the element with highest priority without removing it
     * @returns {*} The element with highest priority, or null if queue is empty
     */
    peek() {
        return this.isEmpty() ? null : this.heap[0].element;
    }

    /**
     * Checks if the priority queue is empty
     * @returns {boolean} True if empty, false otherwise
     */
    isEmpty() {
        return this._size === 0;
    }

    /**
     * Gets the size of the priority queue
     * @returns {number} The number of elements in the queue
     */
    size() {
        return this._size;
    }

    /**
     * Restores heap property by moving element up
     * @param {number} index - Index of the element to heapify up
     */
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.parent(index);

            if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
                break;
            }

            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    /**
     * Restores heap property by moving element down
     * @param {number} index - Index of the element to heapify down
     */
    heapifyDown(index) {
        while (this.leftChild(index) < this.heap.length) {
            const leftChild = this.leftChild(index);
            const rightChild = this.rightChild(index);
            let smallest = index;

            if (this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest === index) {
                break;
            }

            this.swap(index, smallest);
            index = smallest;
        }
    }

    /**
     * Updates the priority of an element (decrease-key operation)
     * @param {*} element - The element to update
     * @param {number} newPriority - The new priority
     * @returns {boolean} True if element was found and updated, false otherwise
     */
    updatePriority(element, newPriority) {
        for (let i = 0; i < this.heap.length; i++) {
            if (this.heap[i].element === element) {
                const oldPriority = this.heap[i].priority;
                this.heap[i].priority = newPriority;

                if (newPriority < oldPriority) {
                    this.heapifyUp(i);
                } else if (newPriority > oldPriority) {
                    this.heapifyDown(i);
                }

                return true;
            }
        }
        return false;
    }

    /**
     * Checks if an element exists in the queue
     * @param {*} element - The element to search for
     * @returns {boolean} True if element exists, false otherwise
     */
    contains(element) {
        return this.heap.some(node => node.element === element);
    }

    /**
     * Gets the priority of an element
     * @param {*} element - The element to get priority for
     * @returns {number|null} The priority of the element, or null if not found
     */
    getPriority(element) {
        const node = this.heap.find(node => node.element === element);
        return node ? node.priority : null;
    }

    /**
     * Removes all elements from the queue
     */
    clear() {
        this.heap = [];
        this._size = 0;
    }

    /**
     * Returns an array of all elements in the queue (not in priority order)
     * @returns {Array} Array of elements in the queue
     */
    toArray() {
        return this.heap.map(node => node.element);
    }

    /**
     * Returns a string representation of the queue
     * @returns {string} String representation
     */
    toString() {
        return this.heap.map(node => `${node.element}(${node.priority})`).join(', ');
    }
}

/**
 * Convenience function to create a min-heap priority queue for Dijkstra's algorithm
 * Elements are expected to be objects with a 'distance' property
 */
export function createDijkstraQueue() {
    return new PriorityQueue((a, b) => a.priority - b.priority);
}

/**
 * Convenience function to create a priority queue with custom comparison
 * @param {Function} compareFn - Custom comparison function
 */
export function createCustomQueue(compareFn) {
    return new PriorityQueue(compareFn);
}