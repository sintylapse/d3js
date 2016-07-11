import React from 'react'
import d3 from 'd3'

class StatisticLogItem extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mainWidth: 250,
            mainHeight: 50
        }
    }

    componentDidMount(){
        const
            data = this.props.predictionPath,
            rangeMin = -250,
            rangeMax = 1550

		let mainScaleX = d3.scale.linear().domain([0, data[data.length - 1].date])
		.range([rangeMin, rangeMax])
		let mainScaleY = d3.scale.linear()
		.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
		.range([250, 0])

		let chartValue = d3.svg.line()
		.interpolate('monotone')
		.x(data => mainScaleX(data.date))
		.y(data => mainScaleY(data.value))

        let ident = `#chart-log-${this.props.ident}`
		d3.select(ident).transition().attr('d', chartValue(data))
    }

    render(){
        const
            resultView = this.props.resultView,
            data = this.props.predictionPath

        return(
            <div className="row">
                <div className="col-3">Рандомный график</div>
                <div className="col-2">{data[0].value}</div>
                <div className="col-2">{data[data.length - 1].value}</div>
                <div className="col-2">{resultView.message}, {resultView.value}</div>
                <div className="col-3">
                    <svg width={this.state.mainWidth} height={this.state.mainHeight}>
                        <path
                            stroke="mediumslateblue"
                            strokeWidth="1" fill="none"
                            className="log-path"
                            id={`chart-log-${this.props.ident}`}>
                        </path>
                    </svg>
                </div>
            </div>
        )
    }
}

export default class StatisticLog extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            stateIs: 0
        }
    }

    render(){
        // console.log(this.props.statiticStore);
        return(
            <div>
                <div className="row">
                    <div className="col-3">Название графика</div>
                    <div className="col-2">Точка входа</div>
                    <div className="col-2">Точка выхода</div>
                    <div className="col-2">Результат</div>
                    <div className="col-3">Снимок графика</div>
                </div>
                {
                    this.props.statiticStore.map((item, i) =>
                        <StatisticLogItem
                            key={i}
                            ident = {i}
                            resultView={item.resultView}
                            predictionPath={item.predictionPath}/>
                    )
                }
            </div>
        )
    }
}
