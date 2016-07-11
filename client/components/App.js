import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import data from './data.js'

import EditForm from './EditForm.js'
import StatisticLog from './StatisticLog.js'

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
			predictionPath: [],
			entryPoint: 0,
			lastPoint: 0,
			resultView: {
				message: false,
				value: 0
			},
			predictionInitialized: false,
			statiticStore: localStorage.length ? JSON.parse(localStorage.getItem('data')) : []
	    };
	}

	componentDidMount(){
		this.d3ChartsRender()
	}

	mooveRight(right){
		// setStates's contains in handlers, transitions - in render
		this.setState({
			xPosition: right ? this.state.xPosition - 50 : this.state.xPosition + 50
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

	// #interval
	predictionCycle(direction, rateValue, iterationTime){
		let
			entryPoint = this.state.entryPoint,
			// resultArray = this.state.predictionPath
			resultArray = []

		resultArray.push(data[entryPoint])
		iterationTime = iterationTime ? iterationTime: 500

		if (!this.predinctionInterval) {
			this.predinctionInterval = setInterval(() => {

				entryPoint += 1
				let secondPoint = entryPoint
				resultArray.push(data[secondPoint])

				rateValue = rateValue ? rateValue : 1

				let difference = resultArray[resultArray.length - 1].value - resultArray[0].value
				let result = Math.abs(difference * rateValue)


				if (difference > 0 && direction === 'buy' || difference < 0 && direction === 'sell') {
					this.setState({
						resultView: {
							message: 'win',
							value: `+${result}`
						}
					})
				} else if (difference < 0 && direction === 'buy' || difference > 0 && direction === 'sell') {
					this.setState({
						resultView: {
							message: 'lose',
							value: `-${result}`
						}
					})
				} else {
					this.setState({
						resultView: {
							message: 'nothing',
							value: `${result}`
						}
					})
				}

				this.setState({
					predictionPath: resultArray,
					lastPoint: resultArray[resultArray.length - 1].value
				})
				console.log('tick');

			}, iterationTime)

		}


		this.setState({
			predictionInitialized: true
		})

	}

	predictionEnd(){
		console.log('END');
		this.setState({
			predictionInitialized: false
		})
		clearInterval(this.predinctionInterval)
		this.predinctionInterval = null

		let
			newData = this.state.statiticStore,
			newObj = {}

		newObj.predictionPath = this.state.predictionPath
		newObj.resultView = this.state.resultView
		newData.push(newObj)
		this.setState({
			statiticStore: newData,
			// predictionPath: [],
			// resultView: {}
		})
		localStorage.setItem('data', JSON.stringify(newData))
	}

	render(){

		this.d3ChartsRender()

		return(
			<div className="container">
				{this.state.predictionInitialized && <i className="icon-spin4 main-spinner"></i>}
				<div className="d3Render">
					{
						this.state.selectedValue &&
						<EditForm selectedValue={this.state.selectedValue}
						predictionCycle={this.predictionCycle.bind(this)}
						entryPoint={this.state.entryPoint}
						lastPoint={this.state.lastPoint}
						resultView={this.state.resultView}
						predictionEnd={this.predictionEnd.bind(this)}
						predictionInitialized={this.state.predictionInitialized}/>
					}
					<svg width={this.state.mainWidth} height={this.state.mainHeight}>
						<g className="global-group">
							<g className="prediction-group">
								<circle className="prediction-circle" strokeWidth="2" stroke="green" fill="none" r="4"></circle>
								<path className="prediction-path" strokeWidth="2" stroke="green" fill="none"></path>
							</g>

							<g className="main-path-group" pointerEvents="all" transform="translate(0, 0)">
								<path
									stroke="mediumslateblue"
									strokeWidth="1" fill="none"
									className="main-path">
								</path>
							</g>
						</g>
						<g className="xAxis" transform="translate(0, -20)" fill="none"></g>
						<g className="yAxis" transform={`translate(${this.state.mainWidth - 50}, 0)`} fill="none"></g>

					</svg>
					<div>
						<button onClick={this.zoomChart.bind(this, false)} className="btn">{'-'}</button>
						<button onClick={this.zoomChart.bind(this, true)} className="btn">{'+'}</button>
						<button onClick={this.mooveRight.bind(this, false)} className="btn">{'<'}</button>
						<button onClick={this.mooveRight.bind(this, true)} className="btn">{'>'}</button>
					</div>
				</div>
				<StatisticLog statiticStore={this.state.statiticStore}/>

			</div>
		)
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
		d3.selectAll('.global-group').transition().attr('transform', `translate(${this.state.xPosition}, 0)`)

		// zoom chart
		d3.selectAll('.main-path').transition().attr('d', chartValue(data))

		const self = this


		let bisectDate = d3.bisector(data => data.date).right

		d3.selectAll('.main-path-group').on('click', function(){
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

		if (this.state.predictionInitialized) {
			d3.selectAll('.main-path-group').on('click', null)
		}

		d3.selectAll('.prediction-circle').transition().attr({
			transform: `translate(${mainScaleX(this.state.selectedX)}, ${mainScaleY(this.state.selectedY)})`,
		})

		d3.selectAll('.prediction-path').transition().attr({d: chartValue(this.state.predictionPath)})
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app-render')
)
