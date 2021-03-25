import React from 'react'


const WhatToBuy = () => {
  return (
//insert for and calculate button
        <div className="content">
      <div className="row">
        <div className="col-md-6">
          <div>
            <div className="text-center" >
              <h4> What to buy....</h4>
            </div>
            <div>
              <div >
                <table className="table tablesorter" >
                  <thead className=" text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Ticker</th>
                      <th>Shares</th>
                      <th >Holdings %</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Apple</td>
                      <td>AAPL</td>
                      <td>100</td>
                      <td>10</td>
                      <td >$12,000</td>
                    </tr>
                    <tr>
                      <td>Apple</td>
                      <td>AAPL</td>
                      <td>100</td>
                      <td>10</td>
                      <td>$12,000</td>
                    </tr>
                    <tr>
                      <td>Apple</td>
                      <td>AAPL</td>
                      <td>100</td>
                      <td>10</td>
                      <td>$12,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default WhatToBuy


