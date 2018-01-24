import {getDescendants, getTips, getApprovers, randomWalk} from '../../src/shared/algorithms';

// convert links from names to pointers
const graphify = ({nodes, links}) => {
  for (let link of links) {
    link.source = nodes.find(n => n.name === link.source);
    link.target = nodes.find(n => n.name === link.target);
  }
};

const initNodes = n => [...Array(n).keys()].map(i => ({name: i}));

describe('Algorithms', () => {
  describe('getDescendants', () => {
    it('Returns empty set when node has no parents', () => {
      const nodes = initNodes(1);
      const links = [];

      const descendants = getDescendants({nodes, links, root: nodes[0]});

      expect(descendants.nodes.size).toEqual(0);
      expect(descendants.links.size).toEqual(0);
    });
    it('Returns only parent in two node graph', () => {
      const nodes = initNodes(2);
      const links = [{source: 0, target: 1}];
      graphify({nodes, links});

      const descendants = getDescendants({nodes, links, root: nodes[0]});

      expect(descendants.nodes.size).toEqual(1);
      expect(descendants.nodes.has(nodes[1])).toBeTruthy();
      expect(descendants.links.size).toEqual(1);
      expect(descendants.links.has(links[0])).toBeTruthy();
    });
    it('Returns both parents in a three node graph', () => {
      const nodes = initNodes(3);
      const links = [{source: 0, target: 1}, {source: 0, target: 2}];
      graphify({nodes, links});

      const descendants = getDescendants({nodes, links, root: nodes[0]});

      expect(descendants.nodes.size).toEqual(2);
      expect(descendants.nodes.has(nodes[1])).toBeTruthy();
      expect(descendants.nodes.has(nodes[2])).toBeTruthy();
      expect(descendants.links.size).toEqual(2);
      expect(descendants.links.has(links[0])).toBeTruthy();
      expect(descendants.links.has(links[1])).toBeTruthy();
    });
    it('Returns only descendants in a chain', () => {
      const nodes = initNodes(5);
      const links = [
        {source: 0, target: 1},
        {source: 1, target: 2},
        {source: 2, target: 3},
        {source: 3, target: 4},
      ];
      graphify({nodes, links});

      const descendants = getDescendants({nodes, links, root: nodes[2]});
      expect(descendants.nodes.size).toEqual(2);
      expect(descendants.nodes.has(nodes[3])).toBeTruthy();
      expect(descendants.nodes.has(nodes[4])).toBeTruthy();
      expect(descendants.links.size).toEqual(2);
      expect(descendants.links.has(links[2])).toBeTruthy();
      expect(descendants.links.has(links[3])).toBeTruthy();
    });
  });
  describe('getTips', () => {
    it('returns nothing for empty graph', () => {
      const nodes = [];
      const links = [];

      const tips = getTips({nodes, links});

      expect(tips.size).toEqual(0);
    });
    it('returns tip for singleton', () => {
      const nodes = initNodes(1);
      const links = [];

      const tips = getTips({nodes, links});

      expect(tips.size).toEqual(1);
    });
    it('returns nothing for 2-clique', () => {
      const nodes = initNodes(2);
      const links = [
        {source: 0, target: 1},
        {source: 1, target: 0},
      ];
      graphify({nodes, links});

      const tips = getTips({nodes, links});

      expect(tips.size).toEqual(0);
    });
    it('returns 2 tips for 3 node graph', () => {
      const nodes = initNodes(3);
      const links = [
        {source: 1, target: 0},
        {source: 2, target: 0},
      ];
      graphify({nodes, links});

      const tips = getTips({nodes, links});

      expect(tips.size).toEqual(2);
      expect(tips.has(nodes[1])).toBeTruthy();
      expect(tips.has(nodes[2])).toBeTruthy();
    });
  });
  describe('getApprovers', () => {
    it('returns no approvers for 1 node graph', () => {
      const nodes = initNodes(1);
      const links = [];
      graphify({nodes, links});

      const approvers = getApprovers({links, node: nodes[0]});

      expect(approvers).toHaveLength(0);
    });
    it('returns correct approvers in 3 node graph', () => {
      const nodes = initNodes(3);
      const links = [
        {source: 1, target: 0},
        {source: 2, target: 0},
      ];
      graphify({nodes, links});

      const approvers = getApprovers({links, node: nodes[0]});

      expect(approvers).toHaveLength(2);
      expect(approvers).toContain(nodes[1]);
      expect(approvers).toContain(nodes[2]);
    });
    it('returns correct approvers in 3 node chain', () => {
      const nodes = initNodes(3);
      const links = [
        {source: 1, target: 0},
        {source: 2, target: 1},
      ];
      graphify({nodes, links});

      const approvers = getApprovers({links, node: nodes[0]});

      expect(approvers).toHaveLength(1);
      expect(approvers).toContain(nodes[1]);
    });
  });
  describe('randomWalk', () => {
    it('stays on branch, single possible outcome', () => {
      const nodes = initNodes(4);
      const links = [
        {source: 1, target: 0},
        {source: 2, target: 1},
        {source: 3, target: 0},
      ];
      graphify({nodes, links});

      const tip = randomWalk({links, start: nodes[1]});

      expect(tip).toEqual(nodes[2]);
    });
    it('stays on branch, two possible outcomes', () => {
      const nodes = initNodes(5);
      const links = [
        {source: 1, target: 0},
        {source: 2, target: 1},
        {source: 3, target: 0},
        {source: 4, target: 1},
      ];
      graphify({nodes, links});

      const tip = randomWalk({links, start: nodes[1]});

      expect([nodes[2], nodes[4]].find(x => x === tip)).toBeTruthy();
    });
  });
});
