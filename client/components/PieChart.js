import React from 'react'
import {VictoryPie, VictoryTheme, VictoryContainer} from 'victory'

export class PieChart extends React.Component {
  constructor() {
    super()
    this.renderStocks = this.renderStocks.bind(this)
  }
  renderStocks() {
    const {stocks} = this.props
    const returnArray = [{x: 'Other', y: 0}]

    for (let i = 0; i < stocks.length; i++) {
      let newObject = {
        x: stocks[i].ticker,
        y: stocks[i].percentageOfPortfolio * 100,
      }

      if (newObject.y < 4) {
        returnArray[0].y += newObject.y
      } else {
        returnArray.push(newObject)
      }
    }
    if (returnArray[0].y === 0) {
      returnArray.splice(0, 1)
    }
    return returnArray
  }
  render() {
    const pieStocks = this.renderStocks()
    const font = "'Poppins', sans-serif"
    return (
      <div className="pie-chart">
        <h2 className="text-center pie-title">Portfolio Breakdown</h2>
        <VictoryPie
          containerComponent={<VictoryContainer responsive={false} />}
          data={pieStocks}
          labels={({datum}) => `${datum.x}\n ${datum.y.toFixed(2)}%`}
          padding={75}
          colorScale={[
            'rgb(167, 154, 255)',
            'rgb(147, 225, 255)',
            // 'rgb(255, 233, 154)',
            '#59ea94',
          ]}
          theme={VictoryTheme.material}
          style={{
            title: {fontSize: 20},
            labels: {fontFamily: font, padding: 30},
          }}
          animate={{easing: 'exp'}}
        />
      </div>
    )
  }
}
