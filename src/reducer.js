import {combineReducers} from 'redux';

const tangleReducer = (state = {}, action) => state;

const appReducer = combineReducers({
  tangle: tangleReducer,
});

export default appReducer;
