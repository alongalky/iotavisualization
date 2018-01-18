import React from 'react';
import * as d3 from 'd3';
import {generateTangle} from '../shared/generateData';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const width = 800;
const height = 450;
const xFromTime = time => 20 + time * 30;
const nodeRadius = 15;
const nodeCountDefault = 20;
const nodeCountMin = 1;
const nodeCountMax = 50;
const lambdaDefault = 1.5;
const lambdaMin = 0.2;
const lambdaMax = 5;


class Tangle extends React.Component {
  constructor(props) {
    super();

    this.state = {
      nodes: [],
      links: [],
      nodeCount: nodeCountDefault,
      lambda: lambdaDefault,
    };

    this.force = d3.forceSimulation()
      .force('attraction', d3.forceManyBody().strength(0.1))
      .force('no_collision', d3.forceCollide().radius(nodeRadius * 2).strength(0.01).iterations(20))
      .force('pin_y_to_center', d3.forceY().y(d => height / 2).strength(0.01))
      .force('pin_x_to_time', d3.forceX().x(d => xFromTime(d.time)).strength(1))
      .force('link', d3.forceLink().links(this.state.links).strength(0.5).distance(nodeRadius*3)); // strength in [0,1]

    this.force.on('tick', () => {
      this.force.nodes(this.state.nodes);
      this.setState({
        links: this.state.links,
        nodes: this.state.nodes,
      });
    });
  }
  componentWillUnmount() {
    this.force.stop();
  }
  componentDidMount() {
    this.startNewTangle();
  }
  startNewTangle() {
    const tangle = generateTangle({
      nodeCount: this.state.nodeCount,
      lambda: this.state.lambda,
    });
    // Set genesis's y to center
    tangle.nodes[0].fy = height/2;

    // Set all nodes' x by time value
    for (let node of tangle.nodes) {
      node.fx = xFromTime(node.time);
      node.y = height/2;
      node.x = width/2; // required to avoid annoying errors
    }

    this.force.stop();

    this.setState({
      nodes: tangle.nodes,
      links: tangle.links,
    });

    this.force.restart().alpha(1);
  }
  render() {
    return (
      <div>
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
                  className='unselectable'
                  fill='#666' fontFamily='Helvetica'
                  alignmentBaseline='middle' textAnchor='middle'>
                  {node.name}
                </text>
              </g>)}
          </g>
        </svg>
        <div style={{width: width*0.8, marginLeft: 20}}>
          <center>Number of transactions</center>
          <Slider
            min={nodeCountMin}
            max={nodeCountMax}
            defaultValue={nodeCountDefault}
            marks={[...Array(nodeCountMax+1).keys()]
              .reduce((result, item) => {
                return Object.assign({}, result,
                  {
                    [item]: `${item}`,
                  });
              })}
            onChange={nodeCount => {
              this.setState(Object.assign(this.state, {nodeCount}));
              this.startNewTangle();
            }}
            />
        </div>
        <div style={{width: width*0.8, marginLeft: 20, marginTop: 30}}>
          <center>Transaction rate (λ)</center>
          <Slider
            min={lambdaMin}
            max={lambdaMax}
            step={0.2}
            defaultValue={lambdaDefault}
            marks={{[lambdaMin]: `${lambdaMin}`, [lambdaMax]: `${lambdaMax}`}}
            onChange={lambda => {
              this.setState(Object.assign(this.state, {lambda}));
              this.startNewTangle();
            }}
            />
        </div>
      </div>
    );
  }
}

export default Tangle;
