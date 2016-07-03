import d3 from 'd3'
import $ from 'jquery'
import data from './data.js'


const mainWidth = 1000,
	mainHeight = 250,
	passComponent = this // PASSING THE COMPONENT

let bisectsAhead = []

let chartOptions = {
	rangeMin: -600,
	rangeMax: 1550,
	xPosition: 0,
	chartScale: 1,
	selectedX: 0,
	selectedY: 0
}

// domain - реальные размеры от 0 до max
// range - рамки в которые нужно запихнуть domain
let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
	.range([chartOptions.rangeMin, chartOptions.rangeMax])
let mainScaleY = d3.scale.linear()
		.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
		.range([250, 0])
let bisectDate = d3.bisector(data => data.date).right

let tooltip = d3.select('.d3Render').append('div')
.attr('class', 'tooltip')

let svg = d3.select('.d3Render').append('svg')
.attr({
	width: mainWidth,
	height: mainHeight
})

let focusGroup = svg.append('g').attr('class', 'focusGroup')
let focus = focusGroup.append('circle').attr({
	r: 4,
	'stroke-width': 2,
	stroke: 'red',
	fill: 'none'
})
let strokeAhead = focusGroup.append('path').attr({
	stroke: 'red',
	'stroke-width': 2,
	fill: 'none',
	class: 'stroke-ahead'
})

let chartValue = d3.svg.line()
.interpolate('monotone')
.x(data => mainScaleX(data.date))
.y(data => mainScaleY(data.value))

let xAxisSize = d3.svg.axis().scale(mainScaleX).tickSize(mainHeight)
let yAxisSize = d3.svg.axis().scale(mainScaleY).ticks(10).orient("right")

// CHART CALLBACKS IS OVER HERE
let strokeGroup = svg.append('g').attr({
	'class': 'main-path',
	'pointer-events': 'all'
})
.on('mousemove', function(){
	tooltip.transition().style({
		left: (d3.event.pageX + 20) + "px",
		top: (d3.event.pageY - 40) + "px",
		display: 'block',
		opacity: 1
	})
	.text(mainScaleX.invert(d3.mouse(this)[0]).toFixed(2))
})
.on('mouseout', function(){
	tooltip.transition().delay(500).style({
		opacity: 0,
	})
	.each('end', function(){
		tooltip.style('display', 'none').text('')
	})
})
.on('click', function(){
	let pointer = mainScaleX.invert(d3.mouse(this)[0])

	chartOptions.selectedX = data[bisectDate(data, pointer)].date
	chartOptions.selectedY = data[bisectDate(data, pointer)].value

	bisectsAhead = []
	for (let i = bisectDate(data, pointer); i < bisectDate(data, pointer) + 30; i++){
		bisectsAhead.push(data[i])
	}

	strokeAhead.attr({
		d: chartValue(bisectsAhead)
	})
	console.log(strokeAhead)
	focus.attr({
		transform: `translate(${mainScaleX(chartOptions.selectedX)}, ${mainScaleY(chartOptions.selectedY)})`
	})

	passComponent.setState({
		selectedValue: chartOptions.selectedX
	})
})
//										END


let stroke = strokeGroup.append('path')
	.attr({
		d: chartValue(data),
		stroke: 'mediumslateblue',
		transform: `translate(${chartOptions.xPosition}, 0)`,
		'stroke-width': 1,
		fill: 'none',
		class: 'area'
	})

let xAxis = svg.append("g")
	.attr({
		class: 'xAxis',
		transform: `translate(${chartOptions.xPosition}, -20)`,
		fill: 'none'
	})
	.call(xAxisSize)

let yAxis = svg.append("g")
	.attr({
		class: 'yAxis',
		transform: `translate(${mainWidth - 50}, 0)`,
		fill: 'none'
	})
		.call(yAxisSize)

let overlay = svg.append('rect').attr({
	width: mainWidth,
	height: mainHeight,
	class: 'overlay',
	fill: 'none'
})

// HANDLERS

d3.selectAll('._zoomChart').on('click', function(){
	let dataZoom = d3.select(this).attr('data-zoom')

	if(dataZoom === 'increment'){
		chartOptions.rangeMin -= 100
		chartOptions.rangeMax += 100
	} else if (dataZoom === 'decrement'){
		chartOptions.rangeMin += 100
		chartOptions.rangeMax -= 100
	}

	mainScaleX.range([chartOptions.rangeMin, chartOptions.rangeMax])

	stroke.transition().attr('d', chartValue(data))
	xAxis.transition().call(xAxisSize)
	focus.transition().attr({
		transform: `translate(${mainScaleX(chartOptions.selectedX)}, ${mainScaleY(chartOptions.selectedY)})`
	})
	strokeAhead.transition().attr('d', chartValue(bisectsAhead))
})

d3.selectAll('._mooveChart').on('click', function(){
	let dataMoove = d3.select(this).attr('data-moove')

	dataMoove === 'right' ? chartOptions.xPosition -= 50 : dataMoove === 'left' ? chartOptions.xPosition += 50 : null
	strokeGroup.transition().attr('transform', `translate(${chartOptions.xPosition}, 0)`)
	xAxis.transition().attr("transform", `translate(${chartOptions.xPosition}, -20)`)
	focusGroup.transition().attr('transform', `translate(${chartOptions.xPosition}, 0)`)
})
