import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import singleHedgeFund from './oneFund'
import hedgeFunds from './funds'
import stockStats from './stockStats'
import hedgeStats from './hedgeStats'

const reducer = combineReducers({
  singleHedgeFund,
  hedgeFunds,
  stockStats,
  hedgeStats,
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
