import * as tipSelections from '../../src/shared/tip-selection';
import {uniformRandom, unWeightedMCMC, weightedMCMC} from '../../src/shared/tip-selection';

const initNodes = n => [...Array(n).keys()].map(i => ({name: i}));

// convert links from names to pointers
const graphify = ({nodes, links}) => {
  for (let link of links) {
    link.source = nodes.find(n => n.name === link.source);
    link.target = nodes.find(n => n.name === link.target);
  }
};

describe('Tip selection algorithms', () => {
  describe('Global tests for all algorithms', () => {
    let tipSelectionAlgorithm;

    Object.keys(tipSelections).map(name => {
      describe(name, () => {
        beforeAll(() => {
          tipSelectionAlgorithm = tipSelections[name];
        });
        it('returns empty array in 0 node graph', () => {
          const nodes = [];
          const links = [];

          const tips = tipSelectionAlgorithm({nodes, links});

          expect(tips).toHaveLength(0);
        });
        it('returns empty array in a 2-clique', () => {
          const nodes = initNodes(2);
          const links = [
            {source: 0, target: 1},
            {source: 1, target: 0},
          ];
          graphify({nodes, links});

          const tips = uniformRandom({nodes, links});

          expect(tips).toHaveLength(0);
        });
        it('returns only option (twice) in a chain of length 2', () => {
          const nodes = initNodes(2);

          const links = [
            {source: 1, target: 0},
          ];
          graphify({nodes, links});

          const tips = uniformRandom({nodes, links});

          expect(tips).toHaveLength(2);
          expect(tips[0]).toEqual(nodes[1]);
          expect(tips[1]).toEqual(nodes[1]);
        });
      });
    });
  });
  describe('MCMC', () => {
    describe('Common tests', () => {
      [{
        name: 'unWeightedMCMC',
        algo: unWeightedMCMC,
      },
      {
        name: 'weightedMCMC',
        algo: weightedMCMC,
      }].map(algo => {
        describe(algo.name, () => {
          it('doesn\'t reach disconnected component', () => {
            const nodes = initNodes(2);
            const links = [];
            graphify({nodes, links});

            const tips = algo.algo({nodes, links, start: nodes[0]});

            expect(tips).toHaveLength(2);
            expect(tips[0]).toEqual(nodes[0]);
            expect(tips[1]).toEqual(nodes[0]);
          });
          it('Stays on genesis branch when given two disconnected components', () => {
            const nodes = initNodes(5);
            const links = [
              {source: 1, target: 0},
              {source: 2, target: 1},
              {source: 4, target: 3},
            ];
            graphify({nodes, links});

            const tips = algo.algo({nodes, links});

            expect(tips).toHaveLength(2);
            expect(tips[0]).toEqual(nodes[2]);
            expect(tips[1]).toEqual(nodes[2]);
          });
        });
      });
    });
  });
});
