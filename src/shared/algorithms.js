export const getDescendants = ({nodes, links, root}) => {
  const stack = [root];
  const visitedNodes = new Set();
  const visitedLinks = new Set();

  while (stack.length > 0) {
    const current = stack.pop();

    const outGoingEdges = links.filter(l => l.source === current);
    for (let link of outGoingEdges) {
      visitedLinks.add(link);
      if (!visitedNodes.has(link.target)) {
        stack.push(link.target);
        visitedNodes.add(link.target);
      }
    }
  }

  return {nodes: visitedNodes, links: visitedLinks};
};

export const getTips = ({nodes, links}) => {
  const tips = nodes.filter(node =>
    !links.some(link => link.target === node));

  return new Set(tips);
};
