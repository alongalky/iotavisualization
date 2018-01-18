const jStat = require('jStat').jStat;

const choose = arr => arr[Math.floor(Math.random() * arr.length)];

export const generateTangle = ({nodeCount, lambda = 1.5, h=1}) => {
  const isTip = (links, node, time) => {
    return !links
      .filter(link => link.source.time < time)
      .some(link => link.target === node);
  };

  jStat.exponential.sample(lambda);
  const genesis = {
    name: '0',
    time: 0,
  };

  let nodes = [genesis];
  let time = h;
  while (nodes.length < nodeCount) {
    const delay = jStat.exponential.sample(lambda);
    time += delay;
    nodes.push({
      name: `${nodes.length}`,
      time,
      x: 300,
      y: 200,
    });
  }

  const links = [];
  for (let node of nodes) {
    const candidates = nodes
      .filter(candidate => candidate.time < node.time - h)
      .filter(candidate => isTip(links, candidate, node.time - h));

    if (candidates.length > 0) {
      const first = choose(candidates);
      const second = choose(candidates);

      links.push({source: node, target: first});
      if (second.name !== first.name) {
        links.push({source: node, target: second});
      }
    }
  };

  return {
    nodes,
    links,
  };
};
