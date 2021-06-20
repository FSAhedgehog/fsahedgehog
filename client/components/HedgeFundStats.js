import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {connect} from 'react-redux'
import {findAverageReturn} from './utilities'
import {getHedgeFunds} from '../store/funds'

export class HedgeFundStats extends React.Component {
  render() {
    if (!this.props.loading) {
      return (
        <div>
          <div className="flex-column">
            <div className="flex-row sml-bottom">
              <div>
                Average Number of Stocks{' '}
                {this.props.hedgeStats.avgNumberOfStocks}
              </div>
              <div>Average Beta {this.props.hedgeStats.avgBeta}</div>
              <div>
                Average One Year Return {this.props.hedgeStats.avgOneYearReturn}
              </div>
              <div>
                Average Three Year Return
                {this.props.hedgeStats.avgThreeYearReturn}
              </div>
              <div>
                Average Five Year Return
                {this.props.hedgeStats.avgFiveYearReturn}
              </div>
              <div>
                Average Max Return
                {this.props.hedgeStats.avgMaxReturn}
              </div>
              <div>
                Average Portfolio Size
                {this.props.hedgeStats.avgPortfolioAmount}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading</div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    hedgeStats: state.hedgeStats.hedgeStats[0],
    loading: state.hedgeStats.loading,
  }
}

export default connect(mapStateToProps)(HedgeFundStats)