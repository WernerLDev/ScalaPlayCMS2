import * as  React from 'react'
import * as  ReactDOM from 'react-dom'
import Main from './Main'
import { createStore } from 'redux'
import reducer from './reducers/index'
import * as Actions from './actions/ActionCreators'

let store = createStore(reducer)
store.dispatch(Actions.addTab("testasdfasf", () => (<p>test</p>)))
store.dispatch(Actions.addTab("Another tab", () => (<p>test</p>)))

console.log(store.getState());

ReactDOM.render(
  <Main />,
  document.getElementById('react-app')
);


