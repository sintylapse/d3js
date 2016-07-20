import d3 from 'd3'

export default function d3LogChartsRender(data, state, logItemId){

    let mainScaleX = d3.scale.linear().domain([data[0].date, data[data.length - 1].date])
    .range([0, state.mainWidth])
    let mainScaleY = d3.scale.linear()
    .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
    .range([state.mainHeight, 0])

    let chartValue = d3.svg.line()
    .interpolate('monotone')
    .x(data => mainScaleX(data.date))
    .y(data => mainScaleY(data.value))

    logItemId = `#chart-log-${logItemId}`
    d3.select(logItemId).attr('d', chartValue(data))
}
