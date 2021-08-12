import axios from 'axios'

const GETSTOCKSTATS = 'GETSTOCKSTATS'

const initialState = {
  loading: true,
  stockStats: [],
}

const setStockStats = (stockStats) => {
  return {
    type: GETSTOCKSTATS,
    stockStats,
  }
}

export const getStockStats = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get('/api/stockStats')
      dispatch(setStockStats(data))
    } catch (err) {
      console.err(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GETSTOCKSTATS:
      return {...state, loading: false, stockStats: action.stockStats}
    default:
      return state
  }
}
