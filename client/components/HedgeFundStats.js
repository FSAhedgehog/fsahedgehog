import React from 'react'
// import AllHedgeFunds from './AllHedgeFunds'
import {connect} from 'react-redux'
// import {findAverageReturn} from './utilities'
// import {getHedgeFunds} from '../store/funds'

export class HedgeFundStats extends React.Component {
  render() {
    if (!this.props.loading) {
      return (
        <div id="fundStatsWholeComponent">
          <div className="hedgeFundTitle">
            <h2 className="title">Hedge Funds</h2>
            <div className="hedgeFundStatsContainer">
              <div className="hedgeFundStatsBox">
                <div className="singleStatContainer">
                  <div className="yearReturnLabel">
                    <p>Average # of Stocks</p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>{`${this.props.hedgeStats.avgNumberOfStocks}`}</p>
                  </div>
                </div>
                <div className="singleStatContainer">
                  <div className="yearReturnLabel">
                    <p>Average 1 Year Return </p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>{`${(
                      this.props.hedgeStats.avgOneYearReturn * 100 -
                      100
                    ).toFixed(0)}%`}</p>
                  </div>
                </div>
                <div className="singleStatContainer">
                  <div className="yearReturnLabel">
                    <p>Average 3 Year Return </p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>{`${(
                      this.props.hedgeStats.avgThreeYearReturn * 100 -
                      100
                    ).toFixed(0)}%`}</p>
                  </div>
                </div>
                <div className="singleStatContainer">
                  <div className="yearReturnLabel">
                    <p>Average 5 Year Return </p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>{`${(
                      this.props.hedgeStats.avgFiveYearReturn * 100 -
                      100
                    ).toFixed(0)}%`}</p>
                  </div>
                </div>
                <div className="singleStatContainer">
                  <div className="yearReturnLabel">
                    <p>Average Total Return </p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>{`${(
                      this.props.hedgeStats.avgMaxReturn * 100 -
                      100
                    ).toFixed(0)}%`}</p>
                  </div>
                </div>
                <div className="singleStatContainer">
                  <div className="yearReturnLabel">
                    <p>Average Beta</p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>{`${this.props.hedgeStats.avgBeta.toFixed(2)}`}</p>
                  </div>
                </div>
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

//                     <div className="flex-column">
//   <div className="flex-row sml-bottom">
//     <div>
//       Average Number of Stocks{' '}
//       {this.props.hedgeStats.avgNumberOfStocks}
//     </div>
//     <div>Average Beta {this.props.hedgeStats.avgBeta}</div>
//     <div>
//       Average One Year Return {this.props.hedgeStats.avgOneYearReturn}
//     </div>
//     <div>
//       Average Three Year Return
//       {this.props.hedgeStats.avgThreeYearReturn}
//     </div>
//     <div>
//       Average Five Year Return
//       {this.props.hedgeStats.avgFiveYearReturn}
//     </div>
//     <div>
//       Average Max Return
//       {this.props.hedgeStats.avgMaxReturn}
//     </div>
//     <div>
//       Average Portfolio Size
//       {this.props.hedgeStats.avgPortfolioAmount}
//     </div>
//   </div>
// </div>
