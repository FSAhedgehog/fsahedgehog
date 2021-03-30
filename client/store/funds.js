import axios from 'axios'

const GETHEDGEFUNDS = 'GETHEDGEFUNDS'

const initialState = {
  loading: true,
  hedgeFunds: [],
}

const setHedgeFunds = (hedgeFunds) => {
  return {
    type: GETHEDGEFUNDS,
    hedgeFunds,
  }
}

export const getHedgeFunds = () => {
  return async (dispatch) => {
    try {
      console.log('in GET HEDGEFUNDS')
      const {data} = await axios.get('/api/hedgefunds')
      dispatch(setHedgeFunds(data))
    } catch (err) {
      console.err(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GETHEDGEFUNDS:
      return {...state, loading: false, hedgeFunds: action.hedgeFunds}
    default:
      return state
  }
}
