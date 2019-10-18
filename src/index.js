import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const getKey = () => {
  const now = new Date()

  return `${now.getFullYear()}-${now.getMonth() + 1}` // js things
}

const getUserData = () =>
  fetch(`/api/userData?when=${getKey()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())

ReactDOM.render(
  <App getUserData={getUserData} />,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
