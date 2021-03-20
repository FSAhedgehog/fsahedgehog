import React from 'react'

import {Navbar} from './components'
import Main from './components/Main'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <Main />
    </div>
  )
}

export default App
