const d3 = require('d3');
const svg = d3.select('svg');
const height = +svg.attr('height');

// Test Data
const nodes = [
  {
    name: '1',
    time: 0,
    fx: 50,
    fy: height/2,
  },
  {
    name: '2',
    time: 1,
  },
];

const links = [
  {
    source: nodes[1],
    target: nodes[0],
  },
];

const chooseFromFirstN = (arr, n) => arr[Math.floor(Math.random() * n)];

setInterval(() => {
  if (nodes.length >= 30) return;

  const name = (nodes.length + 1).toString();
  const time = nodes.length + Math.random() - 0.5;

  const newNode = {
    name,
    time,
    fx: xFromTime(time),
    y: height/2,
  };

  simulation
    .alpha(1)
    .restart();

  nodes.push(newNode);

  links.push({
    source: newNode,
    target: chooseFromFirstN(nodes, Math.max(1, nodes.length-4)),
  });
  links.push({
    source: newNode,
    target: chooseFromFirstN(nodes, Math.max(1, nodes.length-4)),
  });
  redraw();
}, 1000);

const ticked = () => {
  svg.selectAll('path.link')
    .attr('d', d => {
      return `M ${d.source.x} ${d.source.y} ` +
      `L ${d.target.x} ${d.target.y}`;
    });
  svg.selectAll('g.node')
    .attr('transform', d => {
      return `translate(${d.x},${d.y})`;
    });
};

const xFromTime = time => 50 + time * 30;

const simulation = d3.forceSimulation()
  .force('repulsion', d3.forceManyBody().strength(-30))
  .force('no_collision', d3.forceCollide().radius(30).strength(1).iterations(20))
  .force('pin_y_to_center', d3.forceY().y(d => height / 2).strength(-0.1))
  .force('pin_x_to_time', d3.forceX().x(d => xFromTime(d.time)).strength(1));

// Trying it out:
simulation.force('link',
  d3.forceLink().links(links).strength(0.5)); // strength in [0,1]

simulation.on('tick', ticked);

svg.append('defs').selectAll('marker')
  .data(['arrowhead'])
  .enter() .append('marker')
    .attr('id', String)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

const linksCanvas = svg.append('g');
const nodesCanvas = svg.append('g');

const redraw = () => {
  simulation.nodes(nodes);

  const path = linksCanvas
    .selectAll('path.link')
    .data(links)
    .enter().append('path');

  path.attr('class', 'link')
    .attr('stroke', 'green')
    .attr('stroke-width', '2')
    .attr('marker-end', 'url(#arrowhead)');

  const node = nodesCanvas
    .selectAll('.node')
    .data(nodes)
    .enter().append('g');

  node
    .attr('class', 'node')
    .append('circle')
      .attr('r', 5);

  node.append('text').text(d => d.name);
};

redraw();
