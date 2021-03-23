import axios from 'axios'

const GETSINGLEHEDGEFUND = 'GETSINGLEHEDGEFUND'

const initialState = {loading: true, singleHedgeFund: {}}

const setSingleHedgeFund = (hedgeFund) => {
  return {
    type: GETSINGLEHEDGEFUND,
    hedgeFund,
  }
}

export const getSingleHedgeFund = (hedgeFund) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/hedgefunds/${hedgeFund.id}`)
      dispatch(setSingleHedgeFund(data))
    } catch (err) {
      console.err(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GETSINGLEHEDGEFUND:
      return {...state, loading: false, singleHedgeFund: action.singleHedgeFund}
    default:
      return state
  }
}
