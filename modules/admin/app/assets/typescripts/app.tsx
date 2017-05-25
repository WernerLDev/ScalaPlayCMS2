import * as  React from 'react'
import * as  ReactDOM from 'react-dom'
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main'

injectTapEventPlugin();

ReactDOM.render(
  <Main />,
  document.getElementById('react-app')
);