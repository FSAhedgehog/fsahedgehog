import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {LineChart} from './LineChart'
import {BarChart, PieChart, StockStats} from '../components'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {EmailSub} from './EmailSub'
import {findAverageReturn} from './utilities'
import ListWhatToBuy from './ListWhatToBuy'

export class Main extends React.Component {
  componentDidMount() {
    this.props.getMySingleHedgeFund()
  }

  render() {
    // let yearOneReturn = findAverageReturn(
    //   this.props.hedgeFunds,
    //   'yearOneReturn'
    // )
    // let yearThreeReturn = findAverageReturn(
    //   this.props.hedgeFunds,
    //   'yearThreeReturn'
    // )
    // let yearFiveReturn = findAverageReturn(
    //   this.props.hedgeFunds,
    //   'yearFiveReturn'
    // )
    // let maxReturn = findAverageReturn(this.props.hedgeFunds, 'maxReturn')
    if (!this.props.loading) {
      return (
        <div>
          <div className="flex-column">
            <div className="flex-row sml-bottom">
              <div className="flex-column">
                <h2 className="flex-row text">Step one: Choose a Hedge Fund</h2>
                {/* <h2>{yearOneReturn}</h2>
                <h2>{yearThreeReturn}</h2>
                <h2>{yearFiveReturn}</h2>
                <h2>{maxReturn}</h2> */}
                <p className="flex-row left right top explainer">
                  Each quarter we get a glimpse into super-investors' portfolios
                  when they release their holdings via a &nbsp;
                  <span>
                    <a href="https://en.wikipedia.org/wiki/Form_13F"> 13F</a>.
                  </span>
                  Here we’ve analyzed that data, to provide you with estimated
                  returns using each portfolio’s strategy. Click on a hedge fund
                  to go deeper.
                </p>
              </div>
            </div>
            <div className="flex-row sml-bottom">
              <AllHedgeFunds />
            </div>
            <div className="flex-row sml-bottom">
              <div className="flex-column">
                <h2 className="flex-row text" id="anchor-name">
                  Step two: View Return and Risk
                </h2>
                <p className="flex-row left right top explainer">
                  Here you can see how mimicking the selected investor's
                  strategy would have compared to the stock market in general
                  (we use the S&P500). Also, check out the average volatility of
                  their current portfolio measured using the{' '}
                  <a href="https://en.wikipedia.org/wiki/Beta_(finance)">
                    beta
                  </a>
                  :
                </p>
              </div>
            </div>
            <div className="flex-row space-around">
              <div className="flex-row space">
                <LineChart
                  thirteenFs={this.props.singleHedgeFund.thirteenFs}
                  hedgeFund={this.props.singleHedgeFund}
                />
              </div>
              <div className="flex-row">
                <BarChart
                  hedgeFunds={this.props.hedgeFunds}
                  singleHedgeFund={this.props.singleHedgeFund}
                />
              </div>
            </div>
            <div className="flex-row sml-bottom paddingThree">
              <h2 className="flex-row text">
                {' '}
                Step three: Consider Current Strategy
              </h2>
              <p className="flex-row left right top explainer">
                Take a look at this investor's current strategy. Keep in mind
                that form 13Fs are filed within 45 days of the end of the
                quarter, so this data is always on a delay. Use our calculator
                to estimate how to invest your money if you copied this
                strategy. If you're new to investing, click &nbsp;
                {/* prettier-ignore */}
                <a href="https://www.nerdwallet.com/article/investing/how-to-invest-in-stocks">here</a>
                &nbsp; to learn more. If you're ready to invest,&nbsp;
                <a href="https://robinhood.com/us/en/">here</a>&nbsp; is a good
                resource that makes investing accessible to anyone.
              </p>
            </div>
            <div className="flex-row space-around">
              <div className="flex-row space">
                <PieChart
                  stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
                />
              </div>
              <div className="flex-row space">
                <ListWhatToBuy
                  stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
                />
              </div>
              <StockStats />
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
    singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
    loading: state.singleHedgeFund.loading,
    hedgeFunds: state.hedgeFunds.hedgeFunds,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMySingleHedgeFund: (id) => dispatch(getSingleHedgeFund(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
