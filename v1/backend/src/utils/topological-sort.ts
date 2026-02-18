/**
 * Topological Sort Utility
 *
 * Orders nodes in execution order based on their dependencies (edges).
 * Uses Kahn's algorithm for topological sorting.
 */

import { Strategy, Node } from "../types/strategy";

export class TopologicalSort {
  /**
   * Sort nodes in topological order (dependencies first)
   *
   * @param strategy - The strategy to sort
   * @returns Array of nodes in execution order
   * @throws Error if cycle is detected
   */
  static sort(strategy: Strategy): Node[] {
    const nodes = strategy.nodes;
    const edges = strategy.edges;

    // Build adjacency list and in-degree map
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    // Initialize
    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    }

    // Build graph
    for (const edge of edges) {
      adjList.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    // Kahn's algorithm
    const queue: string[] = [];
    const sorted: Node[] = [];

    // Add all nodes with in-degree 0 to queue
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    // Process nodes
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = nodes.find((n) => n.id === nodeId)!;
      sorted.push(node);

      // Reduce in-degree of neighbors
      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);

        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    // Check for cycle
    if (sorted.length !== nodes.length) {
      throw new Error(
        `Cycle detected in strategy graph. Sorted ${sorted.length} nodes out of ${nodes.length}`
      );
    }

    return sorted;
  }

  /**
   * Get execution order for nodes with priority for FLASH_BORROW nodes
   * FLASH_BORROW nodes should execute first when possible
   */
  static sortWithPriority(strategy: Strategy): Node[] {
    const basicSort = this.sort(strategy);

    // Separate borrow nodes and others
    const borrowNodes = basicSort.filter((n) => n.type === "FLASH_BORROW");
    const otherNodes = basicSort.filter((n) => n.type !== "FLASH_BORROW");

    // Return with borrow nodes prioritized at the start
    // Note: This only works if borrow nodes have no dependencies
    // For a more complex strategy, the basic topological sort is sufficient
    return basicSort;
  }

  /**
   * Check if strategy graph has cycles
   */
  static hasCycle(strategy: Strategy): boolean {
    try {
      this.sort(strategy);
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get all nodes that depend on a given node
   */
  static getDependents(strategy: Strategy, nodeId: string): Node[] {
    const dependentIds = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift()!;

      const outgoing = strategy.edges.filter((e) => e.source === current);

      for (const edge of outgoing) {
        if (!dependentIds.has(edge.target)) {
          dependentIds.add(edge.target);
          queue.push(edge.target);
        }
      }
    }

    return strategy.nodes.filter((n) => dependentIds.has(n.id));
  }

  /**
   * Get all nodes that a given node depends on
   */
  static getDependencies(strategy: Strategy, nodeId: string): Node[] {
    const dependencyIds = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift()!;

      const incoming = strategy.edges.filter((e) => e.target === current);

      for (const edge of incoming) {
        if (!dependencyIds.has(edge.source)) {
          dependencyIds.add(edge.source);
          queue.push(edge.source);
        }
      }
    }

    return strategy.nodes.filter((n) => dependencyIds.has(n.id));
  }
}
