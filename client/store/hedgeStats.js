import axios from 'axios'

const GETHEDGESTATS = 'GETHEDGESTATS'

const initialState = {
  loading: true,
  hedgeStats: [],
}

const setHedgeStats = (hedgeStats) => {
  return {
    type: GETHEDGESTATS,
    hedgeStats,
  }
}

export const getHedgeStats = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get('/api/hedgeStats')
      dispatch(setHedgeStats(data))
    } catch (err) {
      console.err(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GETHEDGESTATS:
      return {...state, loading: false, hedgeStats: action.hedgeStats}
    default:
      return state
  }
}
