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
			</div>
		)
	}
}

export default class App extends React.Component{
	
	render(){

		return(
			<div>
				<h1>HELLLO WRLDDD!!</h1>
				<Comp1 />
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app-render')
)