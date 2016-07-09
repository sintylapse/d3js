import React from 'react'

export default class EditForm extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			rateValue: 0
		}
	}
	predictionCycleStart(direction){

		this.props.predictionCycle(direction, this.refs.rateInput.value)
	}
	predictionCycleEnd(){
		this.props.predictionEnd()
	}
	rateValueSet(event){
		console.log(event.target.value)
	}
	render(){

		return(
			<div id='edit-form'>
				<div>
					Выбранное значение:<span class="selectedPosition">{this.props.selectedValue}</span>
				</div>
				<div>
					Вложенное значение:<br /><input ref="rateInput" type="text"/>
				</div>
				{
					!this.props.predictionInitialized && <div>
						<br/>Начать?<br/>
						<div>
							<button className="confirm" onClick={this.predictionCycleStart.bind(this, 'buy')}>Вверх</button>
							<button className="reject" onClick={this.predictionCycleStart.bind(this, 'sell')}>Вниз</button>
						</div>
					</div>
				}

				<div>
					<button onClick={this.predictionCycleEnd.bind(this)}>Закончить</button>
				</div>
				<br />
				{
					this.props.resultView.message && this.renderMessage()
				}
			</div>
		)
	}
	renderMessage(){
		if (this.props.resultView.message === "win") {
			return (
				<div className="result-view win">
					<strong>You win {this.props.resultView.value}</strong>
				</div>
			)
		} else if (this.props.resultView.message === "lose"){
			return (
				<div className="result-view lose">
					<strong>You lose {this.props.resultView.value}</strong>
				</div>
			)
		} else {
			return (
				<div className="result-view nothing">
					<strong>You win nothing</strong>
				</div>
			)
		}
	}
}
