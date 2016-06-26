import d3 from 'd3'
import $ from 'jquery'
import data from './data.js'

(function(){

	const mainWidth = 1000,
		mainHeight = 250

	let chartOptions = {
		rangeMin: 0,
		rangeMax: 950,
		xPosition: 0
	}

	// domain - реальные размеры от 0 до max
	// range - рамки в которые нужно запихнуть domain
	let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
		.range([chartOptions.rangeMin, chartOptions.rangeMax])
	let mainScaleY = d3.scale.linear()
			.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
			.range([250, 0])

	let canvas = d3.select('.d3Render').append('svg')
	.attr({
		width: mainWidth,
		height: mainHeight
	})

	let chartValue = d3.svg.area()
	.interpolate('monotone')
	.x(data => mainScaleX(data.date))
	.y0(mainHeight)
	.y1(data => mainScaleY(data.value))

	let xAxisSize = d3.svg.axis().scale(mainScaleX).tickSize(mainHeight)
	let yAxisSize = d3.svg.axis().scale(mainScaleY).ticks(10).orient("right")

	let stroke = canvas.append('path')
		.attr({
			d: chartValue(data),
			stroke: '#ff3131',
			transform: `translate(${chartOptions.xPosition}, 0)`,
			'stroke-width': 1,
			fill: 'mediumslateblue',
			class: 'area'
		})

	let xAxis = canvas.append("g")
		.attr({
			class: 'xAxis',
			transform: `translate(${chartOptions.xPosition}, -20)`,
			fill: 'none'
		})
		.call(xAxisSize)

		let yAxis = canvas.append("g")
			.attr({
				class: 'yAxis',
				transform: `translate(${mainWidth - 100}, 0)`,
				fill: 'none'
			})
			.call(yAxisSize)

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

		dataMoove === 'right' ? chartOptions.xPosition -= 20 : dataMoove === 'left' ? chartOptions.xPosition += 20 : null
		stroke.transition().attr("transform", `translate(${chartOptions.xPosition}, 0)`)
		xAxis.transition().attr("transform", `translate(${chartOptions.xPosition}, -20)`)
	})



// GLOBAL END
}())
