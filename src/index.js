import React from 'react';
import {render} from 'react-dom';
import reducer from './reducer';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import TangleContainer from './containers/TangleContainer';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <div>
      <div style={{display: 'inline-block'}}>
        <TangleContainer />
      </div>
      <div style={{
        width: '80%',
        paddingLeft: '20px',
        paddingTop: '20px',
        textAlign: 'justify'}}>
        <h2>Iota Tangle visualization</h2>
        <p>
          This demo shows the tangle structure behind Iota, as described in
          the <a href='https://iota.org/IOTA_Whitepaper.pdf'>white paper</a>.
        </p>
        <p>
          The source code can be found on <a href="https://github.com/alongalky/iotavisualization/">github</a>.
        </p>
      </div>
    </div>
  </Provider>,
  document.getElementById('container')
);
