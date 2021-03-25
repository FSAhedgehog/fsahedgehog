import axios from 'axios'

const GETSINGLEHEDGEFUND = 'GETSINGLEHEDGEFUND'

const initialState = {loading: true, singleHedgeFund: {}}

const setSingleHedgeFund = (singleHedgeFund) => {
  return {
    type: GETSINGLEHEDGEFUND,
    singleHedgeFund,
  }
}

export const getSingleHedgeFund = (hedgeFund) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/hedgefunds/${hedgeFund}`)
      console.log('THUNK', data)
      dispatch(setSingleHedgeFund(data))
    } catch (err) {
      console.log(err)
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
