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
          In the tangle, each transaction is a node in
          a <a href='https://en.wikipedia.org/wiki/Directed_acyclic_graph'>DAG</a>.
          When joining, a transaction chooses 2 previous transactions to approve.
        </p>
        <p>
          In the tangle, each transaction is a node in
          a <a href='https://en.wikipedia.org/wiki/Directed_acyclic_graph'>DAG</a>.
          When joining, a transaction chooses 2 previous transactions to approve. An edge
          from <i>a</i> to <i>b</i> means that <i>a</i> approves <i>b</i>.
        </p>
      </div>
    </div>
  </Provider>,
  document.getElementById('container')
);
