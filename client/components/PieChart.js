import React from 'react'
import {VictoryPie, VictoryTheme} from 'victory'

const sampleData = [
  {x: 'STOCK1', y: 33},
  {x: 'STOCK2', y: 33},
  {x: 'STOCK3', y: 33},
]

export class PieChart extends React.Component {
  render() {
    return (
      <VictoryPie
        data={sampleData}
        labels={({datum}) => `${datum.x}: ${datum.y}%`}
        padding={100}
        theme={VictoryTheme.material}
      />
    )
  }
}
