import React from 'react';
import {render} from 'react-dom';
import reducer from './reducer';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {TangleContainer} from './containers/TangleContainer';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <div>
      <TangleContainer />
      <svg width="800" height="500"></svg>
    </div>
  </Provider>,
  document.getElementById('container')
);