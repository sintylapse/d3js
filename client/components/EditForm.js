import React from 'react'
import ReactCSSTransitionGroup   from 'react-addons-css-transition-group'

export default class EditForm extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			rateValue: 0
		}
	}
	predictionCycleStart(direction){
		this.props.predictionCycle(direction, this.refs.rateInput.value, this.refs.iterationTimeInput.value)
	}
	predictionCycleEnd(){
		this.props.predictionEnd()
	}
	rateValueSet(event){
		console.log(event.target.value)
	}
	render(){

		return(

			<div id='control-panel' style={{'height': this.props.mainHeight}}>
				{
					this.props.selectedValue ? <div className="inner">
						<div className="panel-stage-1">
							Выбранное значение:
							<span className="selectedPosition">{this.props.selectedValue}</span>
						</div>

						{
							!this.props.predictionInitialized ? <div className="panel-stage-2">
								<div>
									Вложенное значение:<br /><input ref="rateInput" type="text"/>
								</div>
								<br />
								<div>
									Скорость: <br /><input ref="iterationTimeInput" type="text" />
								</div>
								<br/>Начать?<br/>
								<div>
									<button className="confirm" onClick={this.predictionCycleStart.bind(this, 'buy')}>Вверх</button>
									<button className="reject" onClick={this.predictionCycleStart.bind(this, 'sell')}>Вниз</button>
								</div>
							</div> : <div>
								<button onClick={this.predictionCycleEnd.bind(this)}>Закончить</button>
							</div>
						}
						<br />
						<ReactCSSTransitionGroup transitionName="field-opacity" transitionEnterTimeout={300} transitionLeaveTimeout={300} className="result-wrap">
							{
								this.props.resultView.message && this.renderMessage()
							}
						</ReactCSSTransitionGroup>

					</div> : <div className="inner">
						<p>Выберите начальную точку входа</p>
					</div>
				}
			</div>
		)
	}
	renderMessage(){
		if (this.props.resultView.message === "win") {
			return (
				<div className="result-inner win" key="1">
					<strong>You win {this.props.resultView.value}</strong>
				</div>
			)
		} else if (this.props.resultView.message === "lose"){
			return (
				<div className="result-inner lose" key="2">
					<strong>You lose {this.props.resultView.value}</strong>
				</div>
			)
		} else {
			return (
				<div className="result-inner nothing" key="3">
					<strong>You win nothing</strong>
				</div>
			)
		}
	}
}
