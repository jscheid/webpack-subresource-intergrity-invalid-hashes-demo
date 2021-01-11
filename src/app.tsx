import * as React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

let IndexPage = React.lazy(async () => import('./pages/index' /* webpackChunkName: 'pages-index', webpackPrefetch: true, webpackPreload: true */))
let OfflineAppointmentPage = React.lazy(async () => import('./pages/appointments/offline' /* webpackChunkName: 'pages-appointments-offline', webpackPrefetch: true, webpackPreload: true */))
let OnlineAppointmentPage = React.lazy(async () => import('./pages/appointments/online' /* webpackChunkName: 'pages-appointments-online' */))

export let App: React.FunctionComponent = () => {
  return (
    <>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to='/'>Index</Link>
            </li>
            <li>
              <Link to='/offline'>Offline</Link>
            </li>
            <li>
              <Link to='/online'>Online</Link>
            </li>
          </ul>
        </nav>
        <React.Suspense fallback={<h1>Loading...</h1>}>
          <Switch>
            <Route exact path='/' component={IndexPage} />
            <Route path='/offline' component={OfflineAppointmentPage} />
            <Route path='/online' component={OnlineAppointmentPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </>
  )
}
