import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {LineChart} from './LineChart'
import {BarChart, PieChart} from '../components'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {EmailSub} from './EmailSub'
import ListWhatToBuy from './ListWhatToBuy'
import Portfolio from './Portfolio'
import {camelCase} from './utilities'

export class singleHedgeFund extends React.Component {
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getMySingleHedgeFund(id)
  }

  render() {
    // have email sub, line chart, volatility chart, what to buy, portfolio,
    if (!this.props.loading) {
      return (
        <div className="single-hedgefunds-page">
          <div id="hedge-fund-name">
            <h2>{camelCase(this.props.singleHedgeFund.name)}</h2>
          </div>
          <div className="flex-row">
            <div className="">
              <Portfolio
                stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
                thirteenF={this.props.singleHedgeFund.thirteenFs[0]}
              />
            </div>
            <div className="">
              <LineChart
                thirteenFs={this.props.singleHedgeFund.thirteenFs}
                hedgeFund={this.props.singleHedgeFund}
              />
            </div>
          </div>
          <div className="flex-row pie-bar-row">
            <div className="">
              <PieChart
                stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
              />
            </div>
            <div className="">
              <BarChart
                hedgeFunds={this.props.hedgeFunds}
                singleHedgeFund={this.props.singleHedgeFund}
              />
            </div>
          </div>
          <div className="">
            <ListWhatToBuy
              stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
              thirteenF={this.props.singleHedgeFund.thirteenFs[0]}
            />
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
    singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
    loading: state.singleHedgeFund.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMySingleHedgeFund: (id) => dispatch(getSingleHedgeFund(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(singleHedgeFund)
