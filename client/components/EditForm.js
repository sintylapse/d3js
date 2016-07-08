import React from 'react'

export default class EditForm extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			rateValue: 0,
			resultView: {
				message: false,
				value: 0
			}
		}
	}
	prediction(direction){
		// конечное значение не будет определено
		// не будет массива bisectsAhead
		const
			rateValue = this.refs.rateInput.value ? this.refs.rateInput.value : 1,
			bisectsAhead = this.props.bisectsAhead,
			bisectsAheadFirst = bisectsAhead[0],
			bisectsAheadLast = bisectsAhead[bisectsAhead.length - 1]

		let difference = bisectsAheadLast.value - bisectsAheadFirst.value
		let result = Math.abs(difference * rateValue)

		if (difference > 0 && direction === 'buy' || difference < 0 && direction === 'sell') {
			this.setState({
				resultView: {
					message: 'win',
					value: result
				}
			})
		} else if (difference < 0 && direction === 'buy' || difference > 0 && direction === 'sell') {
			this.setState({
				resultView: {
					message: 'lose',
					value: result
				}
			})
		} else {
			this.setState({
				resultView: {
					message: 'nothing',
					value: result
				}
			})
		}
	}
	rateValueSet(event){
		console.log(event.target.value)
	}
	render(){

		return(
			<div className='editForm'>
				<div>
					Выбранное значение:<span class="selectedPosition">{this.props.selectedValue}</span>
				</div>
				<div>
					Вложенное значение:<br /><input ref="rateInput" type="text"/>
				</div>
				<br/>Начать?<br/>
				<div>
					<button className="confirm" onClick={this.prediction.bind(this, 'buy')}>Вверх</button>
					<button className="reject" onClick={this.prediction.bind(this, 'sell')}>Вниз</button>
				</div>
				<br />
				{
					this.state.resultView.message && this.renderMessage()
				}
			</div>
		)
	}
	renderMessage(){
		if (this.state.resultView.message === "win") {
			return (
				<div>
					<strong>You win {this.state.resultView.value}</strong>
				</div>
			)
		} else if (this.state.resultView.message = "lose"){
			return (
				<div>
					<strong>You lose {this.state.resultView.value}</strong>
				</div>
			)
		} else {
			return (
				<div>
					<strong>You win nothing</strong>
				</div>
			)
		}
	}
}
