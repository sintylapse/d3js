import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'

import d3MainChartRender from '../d3Functions/d3MainChartRender.js'
import data from '../data.js'
import EditForm from './EditForm.js'
import StatisticLog from './StatisticLog.js'

import '../style/main.styl'

export default class App extends React.Component{

	constructor(props) {
    	super(props);
	    this.state = {
			selectedValue: false,
			rangeMin: -600,
			rangeMax: 1550,
			xPosition: 0,
			selectedX: 0,
			selectedY: 0,
			mainWidth: 0,
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
		d3MainChartRender(data, this.state, this)
		window.addEventListener('resize', this.svgResize.bind(this));
		this.svgResize()
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
		newData.unshift(newObj)
		this.setState({
			statiticStore: newData
		})
		localStorage.setItem('data', JSON.stringify(newData))
	}

	deleteFromStat(index){
		let prevArray = this.state.statiticStore
		let newData = prevArray.filter((item, i) => {
			return i !== index
		})
		this.setState({
			statiticStore: newData
		})
		localStorage.setItem('data', JSON.stringify(newData))
	}

	svgResize(){
		this.setState({
			mainWidth: this.refs.svgResize.clientWidth
		})
	}

	render(){
		d3MainChartRender(data, this.state, this)

		return(
			<div className="container">
				{this.state.predictionInitialized && <i className="icon-spin4 main-spinner"></i>}
				<div id="main-screen">
					<div className="row">
						<div className="col-9 svg-col">
							<svg width="100%" ref="svgResize" height={this.state.mainHeight}>
								<g id="global-group">
									<g id="prediction-group">
										<circle id="prediction-circle" strokeWidth="2" stroke="green" fill="none" r="4"></circle>
										<path id="prediction-path" strokeWidth="2" stroke="green" fill="none"></path>
									</g>

									<g id="main-path-group" pointerEvents="all" transform="translate(0, 0)">
										<path
											stroke="mediumslateblue"
											strokeWidth="1" fill="none"
											id="main-path">
										</path>
									</g>
								</g>
								<g id="xAxis" transform="translate(0, -20)" fill="none"></g>
								<g id="yAxis" transform={`translate(${this.state.mainWidth - 50}, 0)`} fill="none"></g>

							</svg>
							<div className="chart-handlers">
								<button onClick={this.zoomChart.bind(this, false)} className="btn">{'-'}</button>
								<button onClick={this.zoomChart.bind(this, true)} className="btn">{'+'}</button>
								<button onClick={this.mooveRight.bind(this, false)} className="btn">{'<'}</button>
								<button onClick={this.mooveRight.bind(this, true)} className="btn">{'>'}</button>
							</div>
						</div>
						<div className="col-3 control-panel-col">
							<EditForm selectedValue={this.state.selectedValue}
								predictionCycle={this.predictionCycle.bind(this)}
								entryPoint={this.state.entryPoint}
								lastPoint={this.state.lastPoint}
								resultView={this.state.resultView}
								predictionEnd={this.predictionEnd.bind(this)}
								predictionInitialized={this.state.predictionInitialized}
								mainHeight={this.state.mainHeight}/>
						</div>
					</div>
				</div>
				{
					this.state.statiticStore.length > 0 &&
					<StatisticLog
						statiticStore={this.state.statiticStore}
						deleteFromStat={this.deleteFromStat.bind(this)}/>
				}

			</div>
		)
	}

}

ReactDOM.render(
	<App />,
	document.getElementById('app-render')
)
