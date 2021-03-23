import axios from 'axios'

const GETHEDGEFUNDS = 'GETHEDGEFUNDS'

const initialState = {
  loading: true,
  hedgefunds: {},
}

const setHedgefunds = (hedgefunds) => {
  return {
    type: GETHEDGEFUNDS,
    hedgefunds,
  }
}

export const fetchAllHedgeFunds = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get('/api/hedgefunds')
      dispatch(setHedgefunds(data))
    } catch (err) {
      console.err(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GETHEDGEFUNDS:
      return {...state, loading: false, hedgefunds: action.hedgefunds}
    default:
      return state
  }
}
