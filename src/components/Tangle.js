import React from 'react';
import PropTypes from 'prop-types';
import './Tangle.css';

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
