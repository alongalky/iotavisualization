import React from 'react';
import PropTypes from 'prop-types';
import './Tangle.css';
import * as d3Scale from 'd3-scale';

const Axis = ({x, endX, y, startVal, endVal, ticks}) => {
  const tickSize = 5;

  const xScale = d3Scale.scaleLinear().domain([startVal, endVal]);
  xScale.range([x, endX]);
  const tickValues = xScale.ticks(ticks);

  return (
    <g fill='none'>
      <text
        stroke='#000'
        fontSize='15'
        textAnchor='middle'
        x={(x+endX)/2}
        y={y - tickSize}>
        Time
      </text>
      <line
        stroke='#000'
        strokeWidth='1'
        x1={x}
        x2={endX}
        y1={y}
        y2={y} />
      {tickValues.map(value =>
        <line
          key={value}
          stroke='#000'
          strokeWidth='2'
          x1={xScale(value)}
          y1={y}
          x2={xScale(value)}
          y2={y + tickSize} />
      )}
      {tickValues.map(value =>
        <text
          key={value}
          fill='#000'
          stroke='#000'
          fontSize='15'
          textAnchor='middle'
          x={xScale(value)}
          y={y + 3.2 * tickSize}>
          {value}
        </text>
      )}}
    </g>
  );
};

Axis.propTypes = {
  x: PropTypes.number.isRequired,
  endX: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  startVal: PropTypes.number.isRequired,
  endVal: PropTypes.number.isRequired,
  ticks: PropTypes.number.isRequired,
};

const Tangle = props =>
  <div>
    <svg width={props.width} height={props.height}>
      <defs>
        <marker
          id='arrowhead'
          viewBox='0 -5 10 10'
          refX={props.nodeRadius+20}
          refY={0}
          markerWidth={5}
          markerHeight={3}
          fill='green'
          orient='auto' >
          <path d='M0,-5L10,0L0,5'/>
        </marker>
      </defs>
      <g>
        {props.links.map(link =>
          <path className='link'
            key={`${link.source.name}->${link.target.name}`}
            d={ `M ${link.source.x} ${link.source.y} ` +
              `L ${link.target.x} ${link.target.y}`}
            stroke='green' strokeWidth='2' markerEnd='url(#arrowhead)'
          /> )}
      </g>
      <g>
        {props.nodes.map(node =>
          <g transform={`translate(${node.x},${node.y})`} key={node.name}>
            <circle className='node' stroke='black' strokeWidth='0.1px'
              fill='white' r={props.nodeRadius} />
            <text
              className='unselectable'
              fill='#666' fontFamily='Helvetica'
              alignmentBaseline='middle' textAnchor='middle'>
              {node.name}
            </text>
          </g>)}
      </g>
      <g>
        <Axis
          x={20}
          endX={props.width - 20}
          y={props.height-20}
          ticks={8}
          startVal={0}
          endVal={props.nodes.length < 2 ? 1 : Math.max(...props.nodes.map(n => n.time))}
          />
      </g>
    </svg>
  </div>;

Tangle.propTypes = {
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  nodeRadius: PropTypes.number.isRequired,
};

export default Tangle;
