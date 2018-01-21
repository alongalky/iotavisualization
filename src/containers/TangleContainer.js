import React from 'react';
import Tangle from '../components/Tangle';
import {connect} from 'react-redux';
import * as d3 from 'd3';
import {generateTangle} from '../shared/generateData';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const mapStateToProps = (state, ownProps) => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({});

const xFromTime = time => 20 + time * 30;
const nodeRadius = 15;
const width = 700;
const height = 450;
const nodeCountMin = 1;
const nodeCountMax = 300;
const nodeCountDefault = 20;
const lambdaMin = 0.1;
const lambdaMax = 50;
const lambdaDefault = 1.5;

class TangleContainer extends React.Component {
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
        <Tangle links={this.state.links} nodes={this.state.nodes}
          nodeCount={6}
          width={width}
          height={height}
          nodeRadius={nodeRadius}
        />
        <div style={{width: width*0.8, marginLeft: 20}}>
          <center>Number of transactions</center>
          <Slider
            min={nodeCountMin}
            max={nodeCountMax}
            defaultValue={nodeCountDefault}
            marks={{[nodeCountMin]: `${nodeCountMin}`, [nodeCountMax]: `${nodeCountMax}`}}
            onChange={nodeCount => {
              this.setState(Object.assign(this.state, {nodeCount}));
              this.startNewTangle();
            }} />
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
            }} />
        </div>
      </div>
    );
  }
}

const TangleContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(TangleContainer);

export default TangleContainerConnected;
