import React from 'react'
import ReactDOM from 'react-dom'



class Comp1 extends React.Component{


	constructor(props) {
    super(props);
    this.state = {
    	textColor: "red"
    };

	}

	render(){

		return(
			<div>
				<div className="d3Render"></div>
				<div className="d3RenderExample"></div>
				<button className="_zoomChart" data-zoom="decrement">-</button>
				<button className="_zoomChart" data-zoom="increment">+</button>
				<button className="_mooveChart" data-moove="left">{'<'}</button>
				<button className="_mooveChart" data-moove="right">{'>'}</button>
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
