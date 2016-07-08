import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import $ from 'jquery'
import data from './data.js'

import EditForm from './EditForm.js'

export default class App extends React.Component{


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

			// #bisect
			passComponent.state.bisectsAhead = []
			for (let i = bisectDate(data, pointer); i < bisectDate(data, pointer) + 50; i++){
				passComponent.state.bisectsAhead.push(data[i])
			}

			passComponent.setState({
				selectedValue: passComponent.state.selectedX
			})
		})

		d3.selectAll('.stroke-ahead').transition().attr({d: chartValue(this.state.bisectsAhead)})

		d3.selectAll('.focus-circle').transition().attr({
			transform: `translate(${mainScaleX(this.state.selectedX)}, ${mainScaleY(this.state.selectedY)})`,
			r: 0
		}).transition().attr('r', 4)
		d3.selectAll('.focus-group').transition().attr('transform', `translate(${this.state.xPosition}, 0)`)
	}

	render(){

		this.d3ChartsRender()

		return(
			<div>
				<div className="d3Render">
					{
						this.state.selectedValue && <EditForm bisectsAhead={this.state.bisectsAhead} selectedValue={this.state.selectedValue} />
					}
					<svg width={this.state.mainWidth} height={this.state.mainHeight}>


						<g className="focus-group">
							<circle className="focus-circle" strokeWidth="2" stroke="red" fill="none"></circle>
							<path className="stroke-ahead" strokeWidth="2" stroke="red" fill="none"></path>
						</g>

						<g className="main-path-group" pointerEvents="all" transform="translate(0, 0)">
							<path
								stroke="mediumslateblue"
								strokeWidth="1" fill="none"
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

ReactDOM.render(
	<App />,
	document.getElementById('app-render')
)
