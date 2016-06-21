import d3 from 'd3'
import $ from 'jquery'

(function(){
	let mainGroup = d3.select('.d3Render')
	.append('g')
	.attr('class', 'generated-paragraphs')

	// RANDOM GRAPHIC

	let randomlyChart = [];
	let dispersion = 100;

	for(let i = 0; i <= 100; i++){
		let newObj = {
			date: i * 10,
			value: Math.floor(Math.random() * dispersion)
		}
		randomlyChart[i] = newObj;
	}
	let rangeLast = randomlyChart[randomlyChart.length - 1].date



	let mainWidth = 1000,
		mainHeight = 250

	let chartValue = d3.svg.area()
		.interpolate('monotone')
		.x(data => mainScaleX(data.date))
		.y0(mainHeight)
		.y1(data => mainScaleY(data.value))



	// domain - реальные размеры от 0 до max
	// range - рамки в которые нужно запихнуть domain
	window.rangeMin = 0
	window.rangeMax = 950

	let mainScaleX = d3.scale.linear().domain([0, rangeLast]).range([window.rangeMin, window.rangeMax])
	let mainScaleY = d3.scale.linear().domain([0, dispersion]).range([200, 0])
	let fillScale = d3.scale.category20()

	let xAxis = d3.svg.axis().scale(mainScaleX).tickSize(mainHeight)

	let canvas = d3.select('.d3Render').append('svg')
	.attr({
		width: mainWidth,
		height: mainHeight
	})

	const buttons = d3.select('.d3Render').append('div').attr({class: 'buttons'})

	buttons.append('button')
	.attr({
		class: 'incrementStrokeWidth'
	})
	.text('Увеличить ширину черты')
	.on('click', incrementStrokeWidth)

	buttons.append('button')
	.attr({
		class: 'decrementStrokeWidth'
	})
	.text('Уменьшить ширину черты')
	.on('click', decrementStrokeWidth)


	canvas.selectAll().data(randomlyChart).enter()
	.append('text').text(data => data.value)
	.attr({
		fill: 'red',
		x: data => mainScaleX(data.date),
		y: 20,
		fill: data => fillScale(data.date)
	})

	let stroke = canvas.append('path')
		.attr({
			d: chartValue(randomlyChart),
			stroke: '#ff3131',
			'stroke-width': 1,
			fill: 'mediumslateblue'
		})

	canvas.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, -20)")
		.call(xAxis)
		.attr({
			fill: 'none'
		})

	console.log(stroke[0]);
	console.log('stroke ^^');

	let strokeWidth = 1;

	function incrementStrokeWidth(){
		window.rangeMin -= 100
		window.rangeMax += 100

		let chartValueSecond = d3.svg.area()
		.interpolate('monotone')
		.x(data => mainScaleXSecond(data.date))
		.y0(mainHeight)
		.y1(data => mainScaleY(data.value))

		let mainScaleXSecond = d3.scale.linear().domain([0, rangeLast]).range([window.rangeMin, window.rangeMax])

		stroke.transition().attr({
			d: chartValueSecond(randomlyChart),
			fill: fillScale(strokeWidth)
		})
	}

	function decrementStrokeWidth(){
		window.rangeMin += 100
		window.rangeMax -= 100

		let chartValueSecond = d3.svg.area()
		.interpolate('monotone')
		.x(data => mainScaleXSecond(data.date))
		.y0(mainHeight)
		.y1(data => mainScaleY(data.value))

		let mainScaleXSecond = d3.scale.linear().domain([0, rangeLast]).range([window.rangeMin, window.rangeMax])

		stroke.transition().attr({
			d: chartValueSecond(randomlyChart),
			fill: fillScale(strokeWidth)
		})
	}

// GLOBAL END
}())




// 																EXAMPLE


// // Set the dimensions of the canvas / graph
// var margin = {top: 30, right: 20, bottom: 30, left: 50},
//     width = 600 - margin.left - margin.right,
//     height = 570 - margin.top - margin.bottom;

// // Parse the date / time
// var parseDate = d3.time.format("%Y-%m-%d").parse;

// // Set the ranges
// var x = d3.time.scale().range([0, width]);
// var y = d3.scale.linear().range([height, 0]);

// // Define the axes
// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom").ticks(5);

// var yAxis = d3.svg.axis().scale(y)
//     .orient("left").ticks(5);

// // Define the line
// var valueline = d3.svg.area()
// 	.interpolate('monotone')
//   .x(function(d) { return x(d.date); })
//   .y0(height)
//   .y1(function(d) { return y(d.close); });

// // Adds the svg canvas
// var svg = d3.select(".d3RenderExample")
//     .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform",
//               "translate(" + margin.left + "," + margin.top + ")");

// // Get the data
// d3.csv("data.csv", function(error, data) {
//     data.forEach(function(d) {
//         d.date = parseDate(d.date);
//         d.close = +d.close;
//     });

//     // Scale the range of the data
//     x.domain(d3.extent(data, function(d) { return d.date; }));
//     y.domain([0, d3.max(data, function(d) { return d.close; })]);

//     // Add the valueline path.
//     svg.append("path")
// 				.attr("class", "line")
// 				.attr("d", valueline(data))
// 				.attr('fill', 'black')

//     // Add the X Axis
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

//     // Add the Y Axis
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);

// });



// let canvas = d3.select('.d3Render').insert('svg')
// .attr({
// 	width: 1500,
// 	height: 1500
// })

// let loadedData = [10, 50, 80]
// let radius = 300
// let perimeter = Math.PI * 2

// let colorScale = d3.scale.ordinal()
// .range(['red', 'blue', 'orange'])

// let group = canvas.append('g').attr('transform', 'translate(300, 300)')

// let arc = d3.svg.arc()
// .innerRadius(200)
// .outerRadius(radius)

// var pie = d3.layout.pie()
// .value(data => data)

// let arcs = group.selectAll('.arc')
// .data(pie(loadedData))
// .enter()
// .append('g')
// .attr({
// 	'class': 'arc',
// 	fill: data => colorScale(data.data)
// 	// 'fill': (data, i) => '#' + Math.round(Math.random() * 1000)
// })

// arcs.append('path')
// .attr('d', arc)

// arcs.append('text')
// .attr('transform', data => `translate(${arc.centroid(data)})`)
// .text(data => {
// 	console.log(data)
// 	return data.data
// })
// .attr({
// 	'fill': 'black',
// 	'text-anchor': 'middle',
// 	'font-size': '20px'
// })



// $('.d3Render').after('<button class="_simpleHandler">Симпл хендлер</button>')

// $('._simpleHandler').on('click', function(){
// 	pathRendered.transition().attr('transform', 'translate(40, 50)')
// })


// d3.json('../data.json', function(loadedData){

// 	var canvas = d3.select('.d3Render').insert('svg')
// 		.attr({
// 			height: 500,
// 			width: 600
// 		})

// 	let rectGroup = canvas.append('g')
// 	rectGroup.selectAll('rect')
// 	.data(loadedData)
// 	.enter()
// 	.append('rect')
// 	.attr({
// 		width: data => data.age * 10,
// 		height: 10,
// 		y: (data, i) => i * 100,
// 		fill: 'blue'
// 	})

// 	rectGroup.attr({
// 		transform: 'rotate(-90), translate(-200, 0)',
// 	})

// 	let textGroup = canvas.append('g')
// 	textGroup.selectAll('text')
// 	.data(loadedData)
// 	.enter()
// 	.append('text')
// 	.text(data => data.name)
// 	.attr({
// 		x: (data, i) => i * 100,
// 		y: 200,
// 		transform: 'translate(0, 30)'
// 	})


// })
