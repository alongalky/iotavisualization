import React from 'react';
import PropTypes from 'prop-types';
import Tangle from '../components/Tangle';
import {connect} from 'react-redux';
import * as d3Force from 'd3-force';
import {generateTangle} from '../shared/generateData';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import {getDescendants, getTips} from '../shared/algorithms';

const mapStateToProps = (state, ownProps) => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({});

const nodeRadius = 15;
const leftMargin = 20;
const rightMargin = 20;
const bottomMargin = 200;

const nodeCountMin = 1;
const nodeCountMax = 300;
const nodeCountDefault = 20;
const lambdaMin = 0.1;
const lambdaMax = 50;
const lambdaDefault = 1.5;

const Handle = Slider.Handle;
const sliderHandle = props => {
  const {value, dragging, index, ...restProps} = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

sliderHandle.propTypes = {
  value: PropTypes.number.isRequired,
  dragging: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

class TangleContainer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      nodes: [],
      links: [],
      nodeCount: nodeCountDefault,
      lambda: lambdaDefault,
      width: 300, // default values
      height: 300,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.force = d3Force.forceSimulation();

    this.force.on('tick', () => {
      this.force.nodes(this.state.nodes);

      // restrict nodes to window area
      for (let node of this.state.nodes) {
        node.y = Math.max(nodeRadius, Math.min(this.state.height - nodeRadius, node.y));
      }

      this.setState({
        links: this.state.links,
        nodes: this.state.nodes,
      });
    });
  }
  componentWillUnmount() {
    this.force.stop();
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  componentDidMount() {
    this.startNewTangle();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth - leftMargin - rightMargin,
      height: window.innerHeight - bottomMargin,
    }, () => {
      this.recalculateFixedPositions();
      this.force
        .force('no_collision', d3Force.forceCollide().radius(nodeRadius * 2).strength(0.01).iterations(15))
        .force('pin_y_to_center', d3Force.forceY().y(d => this.state.height / 2).strength(0.1))
        .force('pin_x_to_time', d3Force.forceX().x(d => this.xFromTime(d.time)).strength(1))
        .force('link', d3Force.forceLink().links(this.state.links).strength(0.5).distance(nodeRadius*3)); // strength in [0,1]

      this.force.restart().alpha(1);
    });
  }
  startNewTangle() {
    const tangle = generateTangle({
      nodeCount: this.state.nodeCount,
      lambda: this.state.lambda,
    });

    const {width, height} = this.state;

    for (let node of tangle.nodes) {
      node.y = height/4 + Math.random()*(height/2),
      node.x = width/2; // required to avoid annoying errors
    }

    this.force.stop();

    this.setState({
      nodes: tangle.nodes,
      links: tangle.links,
    }, () => {
      // Set all nodes' x by time value after state has been set
      this.recalculateFixedPositions();
    });

    this.force.restart().alpha(1);
  }
  recalculateFixedPositions() {
    // Set genesis's y to center
    const genesisNode = this.state.nodes[0];
    genesisNode.fx = this.setState.height / 2;

    for (let node of this.state.nodes) {
      node.fx = this.xFromTime(node.time);
    }
  }
  xFromTime(time) {
    const margin = 20;

    // Avoid edge cases with 0 or 1 nodes
    if (this.state.nodes.length < 2) {
      return margin;
    }

    const maxTime = this.state.nodes[this.state.nodes.length-1].time;

    // Rescale nodes' x to cover [margin, width-margin]
    return margin + (this.state.width - 2*margin)*(time/maxTime);
  }
  mouseEntersNodeHandler(e) {
    const name = e.target.getAttribute('name');
    this.setState({
      hoveredNode: this.state.nodes.find(node => node.name === name),
    });
  }
  mouseLeavesNodeHandler(e) {
    this.setState({
      hoveredNode: undefined,
    });
  }
  getApprovedNodes(root) {
    if (!root) {
      return new Set();
    }

    return getDescendants({
      nodes: this.state.nodes,
      links: this.state.links,
      root,
    });
  }
  render() {
    const {width, height} = this.state;
    return (
      <div>
        <Tangle links={this.state.links} nodes={this.state.nodes}
          nodeCount={6}
          width={width}
          height={height}
          nodeRadius={nodeRadius}
          mouseEntersNodeHandler={this.mouseEntersNodeHandler.bind(this)}
          mouseLeavesNodeHandler={this.mouseLeavesNodeHandler.bind(this)}
          approvedNodes={this.getApprovedNodes(this.state.hoveredNode)}
          tips={getTips({
            nodes: this.state.nodes,
            links: this.state.links,
          })}
        />
        <div style={{width: width*0.8, marginLeft: 20, marginTop: 10}}>
          <center>Number of transactions</center>
          <Slider
            min={nodeCountMin}
            max={nodeCountMax}
            defaultValue={nodeCountDefault}
            marks={{[nodeCountMin]: `${nodeCountMin}`, [nodeCountMax]: `${nodeCountMax}`}}
            handle={sliderHandle}
            onChange={nodeCount => {
              this.setState(Object.assign(this.state, {nodeCount}));
              this.startNewTangle();
            }} />
        </div>
        <div style={{width: width*0.8, marginLeft: 20, marginTop: 10}}>
          <center>Transaction rate (λ)</center>
          <Slider
            min={lambdaMin}
            max={lambdaMax}
            step={0.2}
            defaultValue={lambdaDefault}
            marks={{[lambdaMin]: `${lambdaMin}`, [lambdaMax]: `${lambdaMax}`}}
            handle={sliderHandle}
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
