import * as React from 'react'
import { render } from 'react-dom'

import { App } from './app'
import './styles/index.css'

render(
  // @ts-expect-error // @types/react-dom are broken in version 17.0.0.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementsByClassName('💉')[0]
)
