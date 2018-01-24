import {choose, isTip, randomWalk, weightedRandomWalk, calculateWeights} from './algorithms';

export const uniformRandom = ({nodes, links}) => {
  const candidates = nodes.filter(node => isTip({links, node}));

  return candidates.length === 0 ? [] : [choose(candidates), choose(candidates)];
};

export const unWeightedMCMC = ({nodes, links}) => {
  if (nodes.length === 0) {
    return [];
  }

  const start = nodes[0]; // Start in genesis

  return [
    randomWalk({links, start}),
    randomWalk({links, start}),
  ];
};

export const weightedMCMC = ({nodes, links, alpha}) => {
  if (nodes.length === 0) {
    return [];
  }

  const start = nodes[0]; // Start in genesis

  calculateWeights({nodes, links});

  return [
    weightedRandomWalk({links, start, alpha}),
    weightedRandomWalk({links, start, alpha}),
  ];
};
