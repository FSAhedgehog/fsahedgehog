import React from 'react'
import {VictoryPie, VictoryTheme, VictoryContainer} from 'victory'

const sampleData = [
  {x: '1', y: 5},
  {x: '2', y: 5},
  {x: '3', y: 5},
  {x: '4', y: 5},
  {x: '5', y: 5},
  {x: '6', y: 5},
  {x: '7', y: 5},
  {x: '8', y: 5},
  {x: '9', y: 5},
  {x: '10', y: 5},
  {x: '11', y: 5},
  {x: '12', y: 5},
  {x: '13', y: 5},
  {x: '14', y: 5},
  {x: '15', y: 5},
  {x: '16', y: 5},
  {x: '17', y: 5},
  {x: '18', y: 5},
  {x: '19', y: 5},
  {x: '20', y: 5},
]

export class PieChart extends React.Component {
  constructor() {
    super()
    this.renderStocks = this.renderStocks.bind(this)
  }
  renderStocks() {
    const {stocks} = this.props
    const returnArray = []
    for (let i = 0; i < stocks.length; i++) {
      let newObject = {
        x: stocks[i].ticker,
        y: stocks[i].percentageOfPortfolio * 100,
      }
      if (newObject.y < 1.5) {
        newObject.x = ''
      }
      returnArray.push(newObject)
    }
    return returnArray
  }
  render() {
    const pieStocks = this.renderStocks()
    return (
      <VictoryPie
        containerComponent={<VictoryContainer responsive={false} />}
        data={pieStocks}
        labels={({datum}) => `${datum.x}`}
        padding={100}
        colorScale={['#8affc1', '#907AD6', '#DABFFF']}
        theme={VictoryTheme.material}
        style={{labels: {padding: 30}}}
      />
    )
  }
}
