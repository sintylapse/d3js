import d3 from 'd3'

export default function d3MainChartRender(data, state, self){

    let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
    .range([state.rangeMin, state.rangeMax])

    let mainScaleY = d3.scale.linear()
    .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
    .range([250, 0])

    let xAxisSize = d3.svg.axis().scale(mainScaleX).tickSize(state.mainHeight)
    let yAxisSize = d3.svg.axis().scale(mainScaleY).ticks(10).orient("right")

    let chartValue = d3.svg.line()
    .interpolate('monotone')
    .x(data => mainScaleX(data.date))
    .y(data => mainScaleY(data.value))

    d3.selectAll('#xAxis').transition().attr('transform', `translate(${state.xPosition}, -20)`).call(xAxisSize)
    d3.selectAll('#yAxis').call(yAxisSize)

    let bisectDate = d3.bisector(data => data.date).right

    d3.selectAll('#main-path-group').on('click', function(){
        let pointer = mainScaleX.invert(d3.mouse(this)[0])

        self.setState({
            selectedX: data[bisectDate(data, pointer)].date,
            selectedY: data[bisectDate(data, pointer)].value
        })

        // #bisect
        self.setState({
            selectedValue: self.state.selectedX,
            entryPoint: bisectDate(data, pointer)
        })
    })
    if (self.state.predictionInitialized) {
        d3.selectAll('#main-path-group').on('click', null)
    }

    // moove chart
    d3.selectAll('#global-group').transition().attr('transform', `translate(${state.xPosition}, 0)`)

    // zoom chart
    d3.selectAll('#main-path').transition().attr('d', chartValue(data))

    d3.selectAll('#prediction-circle').transition().attr({
        transform: `translate(${mainScaleX(state.selectedX)}, ${mainScaleY(state.selectedY)})`,
    })

    d3.selectAll('#prediction-path').transition().attr({d: chartValue(state.predictionPath)})
}
