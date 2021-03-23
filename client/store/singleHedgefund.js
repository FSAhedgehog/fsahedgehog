import axios from 'axios'

const GETSINGLEHEDGEFUND = 'GETSINGLEHEDGEFUND'

const initialState = {loading: true, singleHedgefund: {}}

const setSingleHedgefund = (hedgefund) => {
  return {
    type: GETSINGLEHEDGEFUND,
    hedgefund,
  }
}

export const getSingleHedgefund = (hedgefund) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/hedgefunds/${hedgefund.id}`)
      dispatch(setSingleHedgefund(data))
    } catch (err) {
      console.err(err)
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GETSINGLEHEDGEFUND:
      return {...state, loading: false, singleHedgefund: action.singleHedgefund}
    default:
      return state
  }
}
