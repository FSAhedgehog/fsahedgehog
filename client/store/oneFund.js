import axios from 'axios'

const GET_SINGLE_HEDGE_FUND = 'GET_SINGLE_HEDGE_FUND'

const initialState = {loading: true, singleHedgeFund: {}}

const setSingleHedgeFund = (singleHedgeFund) => {
  return {
    type: GET_SINGLE_HEDGE_FUND,
    singleHedgeFund,
  }
}

export const getSingleHedgeFund = (hedgeFund = 1) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/hedgefunds/${hedgeFund}`)

      console.log('DATA IN SINGLE HEDGE————', data.thirteenFs)
      dispatch(setSingleHedgeFund(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SINGLE_HEDGE_FUND:
      return {...state, loading: false, singleHedgeFund: action.singleHedgeFund}
    default:
      return state
  }
}
