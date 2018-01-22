export const getDescendants = ({nodes, links, root}) => {
  const stack = [root];
  const visited = new Set();

  while (stack.length > 0) {
    const current = stack.pop();

    const outGoingEdges = links.filter(l => l.source === current);
    for (let edge of outGoingEdges) {
      if (!visited.has(edge.target)) {
        stack.push(edge.target);
        visited.add(edge.target);
      }
    }
  }

  return visited;
};
