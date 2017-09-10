import "babel-polyfill"
import * as  React from 'react'
import * as  ReactDOM from 'react-dom'
import Main from './Main'
import SetupWizard from './SetupWizard/SetupWizard'
import * as Monadic from './MonadForms/MonadForms'





export let renderAdmin = () => {
  ReactDOM.render(
    <Main />,
    document.getElementById('react-app')
  );
} 


export let renderReactTest = () => {
  ReactDOM.render(
    <Monadic.ReactForms />,
    document.getElementById('react-app')
  );
}

export let renderSetupWizard = () => {
  ReactDOM.render(
    <SetupWizard />,
    document.getElementById('react-app')
  );
}