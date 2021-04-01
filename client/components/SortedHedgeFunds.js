import React from 'react'
import {camelCase} from './utilities'

const SortedHedgeFunds = (props) => {
  console.log('PROPS', props)
  const {
    currentHedgeFunds,
    renderPageNumbers,
    moveHedgeHogToState,
    clickHedgeFund,
    updateSort,
  } = props
  return (
    <div className="flex-column">
      <div className="sml-bottom flex-row">
        <select name="sort" id="return" onChange={updateSort} className="sort">
          <option id="none" value="none" defaultValue="none">
            Sort by: Return %
          </option>
          <option id="1Year" value="1Year">
            Sort by: 1 Year Return
          </option>
          <option id="3Year" value="3Year">
            Sort by: 3 Year Return
          </option>
          <option id="5Year" value="5Year">
            Sort by: 5 Year Return
          </option>
        </select>
      </div>
      <div className="hedgeFundsContainer">
        {currentHedgeFunds.map((hedgeFund) => {
          return (
            <div
              key={hedgeFund.id}
              onClick={() => clickHedgeFund(hedgeFund.id)}
              className="singleHedgeFundContainer"
            >
              <div className="hedgeFundName">
                <p>{camelCase(hedgeFund.name)}</p>
                <div>{moveHedgeHogToState(hedgeFund.id)}</div>
              </div>
              <div className="hedgeFundReturnsContainer">
                <div className="singleReturnContainer">
                  <div className="yearReturnLabel">
                    <p>1 Yr</p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>
                      {`${(hedgeFund.yearOneReturn * 100 - 100).toFixed(1)}%`}
                    </p>
                  </div>
                </div>
                <div className="singleReturnContainer">
                  <div className="yearReturnLabel">
                    <p>3 Yrs</p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>
                      {`${(hedgeFund.yearThreeReturn * 100 - 100).toFixed(1)}%`}
                    </p>
                  </div>
                </div>
                <div className="singleReturnContainer">
                  <div className="yearReturnLabel">
                    <p>5 Yrs</p>
                  </div>
                  <div className="yearReturnNumber">
                    <p>
                      {`${(hedgeFund.yearFiveReturn * 100 - 100).toFixed(1)}%`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="pages-container">
        <div id="page-numbers">{renderPageNumbers} </div>
      </div>
    </div>
  )
}

export default SortedHedgeFunds
