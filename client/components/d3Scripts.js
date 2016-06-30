import d3 from 'd3'
import $ from 'jquery'
import data from './data.js'

(function(){

	const mainWidth = 1000,
		mainHeight = 250

	let chartOptions = {
		rangeMin: -600,
		rangeMax: 1550,
		xPosition: 0,
		chartScale: 1
	}

	// domain - реальные размеры от 0 до max
	// range - рамки в которые нужно запихнуть domain
	let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
		.range([chartOptions.rangeMin, chartOptions.rangeMax])
	let mainScaleY = d3.scale.linear()
			.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
			.range([250, 0])

	const tooltip = d3.select('.d3Render')

	let svg = d3.select('.d3Render').append('svg')
	.attr({
		width: mainWidth,
		height: mainHeight
	})

	let chartValue = d3.svg.line()
	.interpolate('monotone')
	.x(data => mainScaleX(data.date))
	.y(data => mainScaleY(data.value))

	// let chartValue = d3.svg.area()
	// .interpolate('monotone')
	// .x(data => mainScaleX(data.date))
	// .y0(mainHeight)
	// .y1(data => mainScaleY(data.value))

	let xAxisSize = d3.svg.axis().scale(mainScaleX).tickSize(mainHeight)
	let yAxisSize = d3.svg.axis().scale(mainScaleY).ticks(10).orient("right")

	let strokeGroup = svg.append('g').attr('class', 'main-path')
	.on('mousemove', function(e){
		console.log('-----')
		console.log(d3.event.pageX)
		console.log(d3.event.pageY)
		console.log(mainScaleX.invert(d3.mouse(this)[0]))
	})

	let stroke = strokeGroup.append('path')
		.attr({
			d: chartValue(data),
			stroke: 'mediumslateblue',
			transform: `translate(${chartOptions.xPosition}, 0)`,
			'stroke-width': 1,
			fill: 'none',
			class: 'area',
			'pointer-events': 'all'
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
	// .on('mousemove', function(e){
	// 	console.log('-----')
	// 	console.log(mainScaleX.invert(d3.mouse(this)[0]))
	// })

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

	})

	d3.selectAll('._mooveChart').on('click', function(){
		let dataMoove = d3.select(this).attr('data-moove')

		dataMoove === 'right' ? chartOptions.xPosition -= 50 : dataMoove === 'left' ? chartOptions.xPosition += 50 : null
		strokeGroup.transition().attr('transform', `translate(${chartOptions.xPosition}, 0)`)
		xAxis.transition().attr("transform", `translate(${chartOptions.xPosition}, -20)`)
	})



// GLOBAL END
}())
