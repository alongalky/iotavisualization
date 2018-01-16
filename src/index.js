const d3 = require('d3');

const svg = d3.select('svg');
const height = +svg.attr('height');

// Test Data
const nodes = [
  {
    id: '1',
    time: 0,
  },
  {
    id: '2',
    time: 1,
  },
  {
    id: '3',
    time: 3,
  },
  {
    id: '4',
    time: 3,
  },
];

const links = [
  {
    source: '2',
    target: '1',
  },
  {
    source: '3',
    target: '1',
  },
  {
    source: '4',
    target: '1',
  },
  {
    source: '4',
    target: '2',
  },
];

const simulation = d3.forceSimulation()
  .force('repulsion', d3.forceManyBody(-30))
  .force('pin_y_to_center', d3.forceY().y(d => height / 2).strength(0.1))
  .force('pin_x_to_time', d3.forceX().x(d => {
    return 50 + d.time * 30;
  }).strength(1))
  .force('link', d3.forceLink().id(d => d.id))
  .nodes(nodes)
  .on('tick', ticked);

simulation.force('link')
  .links(links);

const path = svg.append('g')
  .selectAll('path')
  .data(links)
  .enter().append('svg:path')
  .attr('class', d => 'link')
  .attr('stroke', 'green')
  .attr('stroke-width', '3')
  .attr('marker-end', function(d) {
    return 'url(#arrowhead)';
  });

svg.append('svg:defs').selectAll('marker')
  .data(['arrowhead'])
  .enter().append('svg:marker')
  .attr('id', String)
  .attr('viewBox', '0 -5 10 10')
  .attr('refX', 10)
  .attr('refY', 0)
  .attr('markerWidth', 5)
  .attr('markerHeight', 3)
  .attr('orient', 'auto')
  .append('svg:path')
  .attr('d', 'M0,-5L10,0L0,5');

let node = svg.selectAll('.node')
  .data(nodes)
  .enter().append('g')
  .attr('class', 'node');

node.append('circle')
  .attr('r', 5);

node.append('text').text(d => d.id);

function ticked() {
  path.attr('d', d => `M ${d.source.x} ${d.source.y} `+
    `L ${d.target.x} ${d.target.y}`);
  node.attr('transform', d => `translate(${d.x},${d.y})`);
};
