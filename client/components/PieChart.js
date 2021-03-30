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

      if (newObject.y < 5) {
        returnArray[0].y += newObject.y
      } else {
        returnArray.push(newObject)
      }
    }

    return returnArray
  }
  render() {
    const pieStocks = this.renderStocks()
    return (
      <div>
        <h6 className="text-center">Percentage of Portfolio</h6>

        <VictoryPie
          containerComponent={<VictoryContainer responsive={false} />}
          data={pieStocks}
          labels={({datum}) => `${datum.x}\n${datum.y.toFixed(2)}%`}
          padding={100}
          colorScale={['#8affc1', '#907AD6', '#DABFFF', '#9D61FF']}
          theme={VictoryTheme.material}
          style={{labels: {padding: 30}}}
          animate={{easing: 'exp'}}
        />
      </div>
    )
  }
}
