import React from 'react';
import * as d3 from 'd3';

const width = 800;
const height = 500;
const xFromTime = time => 50 + time * 30;
const nodeRadius = 15;

const fakeNodes = [
  {
    name: '0',
    time: 0,
    fx: xFromTime(0),
    fy: height/2,
  },
  {
    name: '1',
    time: 2,
    x: 200,
    y: 200,
  },
];
const fakeLinks = [
  {
    source: '1',
    target: '0',
    // source: fakeNodes[0],
    // target: fakeNodes[1],
  },
];

class Tangle extends React.Component {
  constructor(props) {
    super();
    this.state = {
      nodes: fakeNodes,
      links: fakeLinks,
    };

    this.force = d3.forceSimulation(this.state.nodes)
      .force('attraction', d3.forceManyBody().strength(-30))
      .force('no_collision', d3.forceCollide().radius(30).strength(1).iterations(20))
      .force('pin_y_to_center', d3.forceY().y(d => height / 2).strength(0.01))
      .force('pin_x_to_time', d3.forceX().x(d => xFromTime(d.time)).strength(1))
      .force('link', d3.forceLink().links(this.state.links).strength(0.5).distance(20)); // strength in [0,1]

    this.force.on('tick', () => {
      this.force.nodes(this.state.nodes);
      this.setState({
        links: this.state.links,
        nodes: this.state.nodes,
      });
    });
  }
  componentDidMount() {
    setTimeout(() => {
      const newNode = {
        name: '2',
        time: 4,
        x: 150, y: 50,
      };
      this.setState({
        links: [...this.state.links, {
          source: newNode,
          target: this.state.nodes[0],
        }],
        nodes: [...this.state.nodes, newNode],
      });
      this.force.alpha(1).restart();
    }, 1000);
  }
  componentWillUnmount() {
    this.force.stop();
  }
  render() {
    return (
      <svg width={width} height={height}>
        <defs>
          <marker
              id='arrowhead'
              viewBox='0 -5 10 10'
              refX={nodeRadius+20}
              refY={0}
              markerWidth={5}
              markerHeight={3}
              fill='green'
              orient='auto' >
            <path d='M0,-5L10,0L0,5'/>
          </marker>
        </defs>
        <g>
          {this.state.links.map(link =>
            <path className='link'
              key={`${link.source.name}->${link.target.name}`}
              d={ `M ${link.source.x} ${link.source.y} ` +
              `L ${link.target.x} ${link.target.y}`}
              stroke='green' strokeWidth='2' markerEnd='url(#arrowhead)'
              /> )}
        </g>
        <g>
          {this.state.nodes.map(node =>
            <g transform={`translate(${node.x},${node.y})`} key={node.name}>
              <circle className='node' stroke='black' strokeWidth='0.1px'
                fill='white' r={nodeRadius} />
              <text
                fill='#666' fontFamily='Helvetica'
                alignmentBaseline='middle' textAnchor='middle'>
                {node.name}
              </text>
            </g>)}
        </g>
      </svg>
    );
  }
}

export default Tangle;
