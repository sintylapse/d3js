import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import $ from 'jquery'
import data from './data.js'


class EditForm extends React.Component{

	render(){
		function justFunc(){
			console.log('justFunc')
		}
		return(
			<div className='editForm'>
				Выбранное значение:<span class="selectedPosition">{this.props.selectedValue}</span>
				<br/>Начать?<br/>
				<div>
					<button className="confirm" onClick={justFunc}>Вверх</button>
					<button className="reject">Вниз</button>
				</div>
			</div>
		)
	}
}

class Comp1 extends React.Component{


	constructor(props) {
    	super(props);
	    this.state = {
	    	textColor: "red",
			selectedValue: 0,
			rangeMin: -600,
			rangeMax: 1550,
			xPosition: 0,
			selectedX: 0,
			selectedY: 0,
			mainWidth: 1000,
		   	mainHeight: 250,
			// lat 2 actually are not states ^^
			bisectsAhead: []
	    };
	}







	componentDidMount(){

		// const mainWidth = 1000,
		// 	mainHeight = 250,
		// 	passComponent = this // PASSING THE COMPONENT
		//
		// let bisectsAhead = []
		//
		// // domain - реальные размеры от 0 до max
		// // range - рамки в которые нужно запихнуть domain
		// let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
		// 	.range([this.state.rangeMin, this.state.rangeMax])
		// let mainScaleY = d3.scale.linear()
		// 		.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
		// 		.range([250, 0])
		// let bisectDate = d3.bisector(data => data.date).right
		//
		// let tooltip = d3.select('.d3ChartsRender').append('div')
		// .attr('class', 'tooltip')
		//
		// let svg = d3.select('.d3ChartsRender').append('svg')
		// .attr({
		// 	width: mainWidth,
		// 	height: mainHeight
		// })
		//
		// let focusGroup = svg.append('g').attr('class', 'focusGroup')
		// let focus = focusGroup.append('circle').attr({
		// 	r: 4,
		// 	'stroke-width': 2,
		// 	stroke: 'red',
		// 	fill: 'none'
		// })
		// let strokeAhead = focusGroup.append('path').attr({
		// 	stroke: 'red',
		// 	'stroke-width': 2,
		// 	fill: 'none',
		// 	class: 'stroke-ahead'
		// })
		//
		// let chartValue = d3.svg.line()
		// .interpolate('monotone')
		// .x(data => mainScaleX(data.date))
		// .y(data => mainScaleY(data.value))
		//
		// let xAxisSize = d3.svg.axis().scale(mainScaleX).tickSize(mainHeight)
		// let yAxisSize = d3.svg.axis().scale(mainScaleY).ticks(10).orient("right")
		//
		// // CHART CALLBACKS IS OVER HERE
		// let strokeGroup = svg.append('g').attr({
		// 	'class': 'main-path',
		// 	'pointer-events': 'all'
		// })
		// .on('mousemove', function(){
		// 	tooltip.transition().style({
		// 		left: (d3.event.pageX + 20) + "px",
		// 		top: (d3.event.pageY - 40) + "px",
		// 		display: 'block',
		// 		opacity: 1
		// 	})
		// 	.text(mainScaleX.invert(d3.mouse(this)[0]).toFixed(2))
		// })
		// .on('mouseout', function(){
		// 	tooltip.transition().delay(500).style({
		// 		opacity: 0,
		// 	})
		// 	.each('end', function(){
		// 		tooltip.style('display', 'none').text('')
		// 	})
		// })
		// .on('click', function(){
		// 	let pointer = mainScaleX.invert(d3.mouse(this)[0])
		//
		// 	passComponent.setState({
		// 		selectedX: data[bisectDate(data, pointer)].date,
		// 		selectedY: data[bisectDate(data, pointer)].value
		// 	})
		//
		//
		// 	bisectsAhead = []
		// 	for (let i = bisectDate(data, pointer); i < bisectDate(data, pointer) + 30; i++){
		// 		bisectsAhead.push(data[i])
		// 	}
		//
		// 	strokeAhead.attr({
		// 		d: chartValue(bisectsAhead)
		// 	})
		//
		// 	focus.attr({
		// 		transform: `translate(${mainScaleX(passComponent.state.selectedX)}, ${mainScaleY(passComponent.state.selectedY)})`
		// 	})
		//
		// 	passComponent.setState({
		// 		selectedValue: passComponent.state.selectedX
		// 	})
		// })
		// //										END
		//
		//
		// let stroke = strokeGroup.append('path')
		// 	.attr({
		// 		d: chartValue(data),
		// 		stroke: 'mediumslateblue',
		// 		transform: `translate(${this.state.xPosition}, 0)`,
		// 		'stroke-width': 1,
		// 		fill: 'none',
		// 		class: 'area'
		// 	})
		//
		// let xAxis = svg.append("g")
		// 	.attr({
		// 		class: 'xAxis',
		// 		transform: `translate(${this.state.xPosition}, -20)`,
		// 		fill: 'none'
		// 	})
		// 	.call(xAxisSize)
		//
		// let yAxis = svg.append("g")
		// 	.attr({
		// 		class: 'yAxis',
		// 		transform: `translate(${mainWidth - 50}, 0)`,
		// 		fill: 'none'
		// 	})
		// 		.call(yAxisSize)
		//
		// let overlay = svg.append('rect').attr({
		// 	width: mainWidth,
		// 	height: mainHeight,
		// 	class: 'overlay',
		// 	fill: 'none'
		// })
		//
		// // HANDLERS
		//
		// d3.selectAll('._zoomChart').on('click', function(){
		// 	let dataZoom = d3.select(this).attr('data-zoom')
		//
		// 	if(dataZoom === 'increment'){
		// 		passComponent.setState({
		// 			rangeMin: passComponent.state.rangeMin - 100,
		// 			rangeMax: passComponent.state.rangeMax + 100
		// 		})
		//
		// 	} else if (dataZoom === 'decrement'){
		// 		passComponent.setState({
		// 			rangeMin: passComponent.state.rangeMin + 100,
		// 			rangeMax: passComponent.state.rangeMax - 100
		// 		})
		// 	}
		//
		// 	mainScaleX.range([passComponent.state.rangeMin, passComponent.state.rangeMax])
		//
		// 	stroke.transition().attr('d', chartValue(data))
		// 	xAxis.transition().call(xAxisSize)
		// 	focus.transition().attr({
		// 		transform: `translate(${mainScaleX(passComponent.state.selectedX)}, ${mainScaleY(passComponent.state.selectedY)})`
		// 	})
		// 	strokeAhead.transition().attr('d', chartValue(bisectsAhead))
		// })
		//
		// d3.selectAll('._mooveChart').on('click', function(){
		// 	let dataMoove = d3.select(this).attr('data-moove')
		//
		// 	dataMoove === 'right' ? passComponent.state.xPosition -= 50 : dataMoove === 'left' ? passComponent.state.xPosition += 50 : null
		// 	strokeGroup.transition().attr('transform', `translate(${passComponent.state.xPosition}, 0)`)
		// 	xAxis.transition().attr("transform", `translate(${passComponent.state.xPosition}, -20)`)
		// 	focusGroup.transition().attr('transform', `translate(${passComponent.state.xPosition}, 0)`)
		// })

		this.d3ChartsRender()
	}














	mooveRight(right){
		// setStates's contains in handlers, transitions - in render
		this.setState({
			xPosition: right ? this.state.xPosition + 50 : this.state.xPosition - 50
		})
	}
	zoomChart(increment){
		if(increment){
			this.setState({
				rangeMin: this.state.rangeMin - 100,
				rangeMax: this.state.rangeMax + 100
			})

		} else {
			this.setState({
				rangeMin: this.state.rangeMin + 100,
				rangeMax: this.state.rangeMax - 100
			})
		}
	}

	d3ChartsRender(){
		let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
		.range([this.state.rangeMin, this.state.rangeMax])

		let mainScaleY = d3.scale.linear()
		.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
		.range([250, 0])



		let xAxisSize = d3.svg.axis().scale(mainScaleX).tickSize(this.state.mainHeight)
		let yAxisSize = d3.svg.axis().scale(mainScaleY).ticks(10).orient("right")

		let chartValue = d3.svg.line()
		.interpolate('monotone')
		.x(data => mainScaleX(data.date))
		.y(data => mainScaleY(data.value))

		d3.selectAll('.xAxis').transition().attr('transform', `translate(${this.state.xPosition}, -20)`).call(xAxisSize)
		d3.selectAll('.yAxis').call(yAxisSize)

		// moove chart
		d3.selectAll('.main-path-group').transition().attr('transform', `translate(${this.state.xPosition}, 0)`)

		// zoom chart
		d3.selectAll('.main-path').transition().attr('d', chartValue(data))

		const passComponent = this


		let bisectDate = d3.bisector(data => data.date).right

		d3.selectAll('.main-path-group').on('click', function(){
			let pointer = mainScaleX.invert(d3.mouse(this)[0])

			passComponent.setState({
				selectedX: data[bisectDate(data, pointer)].date,
				selectedY: data[bisectDate(data, pointer)].value
			})


			passComponent.state.bisectsAhead = []
			for (let i = bisectDate(data, pointer); i < bisectDate(data, pointer) + 30; i++){
				passComponent.state.bisectsAhead.push(data[i])
			}

			passComponent.setState({
				selectedValue: passComponent.state.selectedX
			})
		})

		d3.selectAll('.stroke-ahead').transition().attr({d: chartValue(this.state.bisectsAhead)})
		d3.selectAll('.focus-circle').transition().attr({
			transform: `translate(${mainScaleX(passComponent.state.selectedX)}, ${mainScaleY(passComponent.state.selectedY)})`
		})

		d3.selectAll('.focus-circle').transition().attr({
			transform: `translate(${mainScaleX(passComponent.state.selectedX)}, ${mainScaleY(passComponent.state.selectedY)})`
		})


		d3.selectAll('.focus-group').transition().attr('transform', `translate(${passComponent.state.xPosition}, 0)`)
	}

	render(){

		this.d3ChartsRender()

		return(
			<div>




				<div className="d3Render">
					{
						this.state.selectedValue !== 0 ? <EditForm selectedValue={this.state.selectedValue} /> : null
					}
					<svg width={this.state.mainWidth} height={this.state.mainHeight}>


						<g className="focus-group">
							<circle className="focus-circle" r="4" stroke-width="2" stroke="red" fill="none"></circle>
							<path className="stroke-ahead" stroke-width="2" stroke="red" fill="none"></path>
						</g>

						<g className="main-path-group" pointer-events="all" transform="translate(0, 0)">
							<path
								stroke="mediumslateblue"
								stroke-width="1" fill="none"
								className="main-path">
							</path>
						</g>
						<g className="xAxis" transform="translate(0, -20)" fill="none"></g>
						<g className="yAxis" transform={`translate(${this.state.mainWidth - 50}, 0)`} fill="none"></g>

					</svg>
					<button onClick={this.zoomChart.bind(this, false)}>{'-'}</button>
					<button onClick={this.zoomChart.bind(this, true)}>{'+'}</button>
					<button onClick={this.mooveRight.bind(this, false)}>{'<'}</button>
					<button onClick={this.mooveRight.bind(this, true)}>{'>'}</button>
				</div>
			</div>
		)
	}
}

export default class App extends React.Component{

	render(){

		return(
			<div>
				<Comp1 />
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app-render')
)
