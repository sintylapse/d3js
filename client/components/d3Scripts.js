import d3 from 'd3'
import $ from 'jquery'


(function(){

	const mainWidth = 1000,
		mainHeight = 250,
		dispersion = 100

	let chartOptions = {
		rangeMin: 0,
		rangeMax: 950,
		xPosition: 0
	}

	// RANDOM GRAPHIC
	let randomlyChart = [];
	for(let i = 0; i <= 100; i++){
		let newObj = {
			date: i * 10,
			value: Math.floor(Math.random() * dispersion)
		}
		randomlyChart[i] = newObj;
	}
	const rangeLast = randomlyChart[randomlyChart.length - 1].date


	// domain - реальные размеры от 0 до max
	// range - рамки в которые нужно запихнуть domain
	let mainScaleX = d3.scale.linear().domain([0, rangeLast]).range([chartOptions.rangeMin, chartOptions.rangeMax])
	let mainScaleY = d3.scale.linear().domain([0, dispersion]).range([200, 0])

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

	let xAxis = d3.svg.axis().scale(mainScaleX).tickSize(mainHeight)

	let stroke = canvas.append('path')
		.attr({
			d: chartValue(randomlyChart),
			stroke: '#ff3131',
			transform: `translate(${chartOptions.xPosition}, 0)`,
			'stroke-width': 1,
			fill: 'mediumslateblue',
			class: 'area'
		})

	let isAxis = canvas.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(${chartOptions.xPosition}, -20)`)
		.call(xAxis)
		.attr({
			fill: 'none',
			class: 'xAxis'
		})

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

		stroke.transition().attr('d', chartValue(randomlyChart))
		isAxis.transition().call(xAxis)
	})

	d3.selectAll('._mooveChart').on('click', function(){
		let dataMoove = d3.select(this).attr('data-moove')

		dataMoove === 'right' ? chartOptions.xPosition += 20 : dataMoove === 'left' ? chartOptions.xPosition -= 20 : null
		stroke.transition().attr("transform", `translate(${chartOptions.xPosition}, 0)`)
		isAxis.transition().attr("transform", `translate(${chartOptions.xPosition}, -20)`)
	})



// GLOBAL END
}())
