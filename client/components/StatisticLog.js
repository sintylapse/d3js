import React from 'react'
import d3 from 'd3'
import ReactCSSTransitionGroup   from 'react-addons-css-transition-group'

import d3LogChartsRender from '../d3Functions/d3LogChartsRender.js'

class StatisticLogItem extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mainWidth: 150,
            mainHeight: 50
            // they are props ^
        }
    }

    componentDidMount(){
        d3LogChartsRender(this.props.predictionPath, this.state, this.props.logItemId)
    }

    deleteLogItem(index){
        this.props.deleteFromStat(index)
    }

    render(){
        d3LogChartsRender(this.props.predictionPath, this.state, this.props.logItemId)

        const
            resultView = this.props.resultView,
            data = this.props.predictionPath

        return(
            <div className="row statistic-log-item">
                <div className="col-3">Рандомный график</div>
                <div className="col-2">{data[0].value}</div>
                <div className="col-2">{data[data.length - 1].value}</div>
                <div className="col-2">{resultView.message}, {resultView.value}</div>
                <div className="col-2">
                    <svg width={this.state.mainWidth} height={this.state.mainHeight}>
                        <path
                            stroke="mediumslateblue"
                            strokeWidth="1" fill="none"
                            className="log-path"
                            id={`chart-log-${this.props.logItemId}`}>
                        </path>
                    </svg>
                </div>
                <div className="col-1">
                    <button onClick={this.deleteLogItem.bind(this, this.props.logItemId)}>Delete</button>
                </div>
            </div>
        )
    }
}

export default class StatisticLog extends React.Component{

    render(){

        return(
            <div id="statistic-log" className="simple-table">
                <div className="table-header">
                    <div className="row">
                        <div className="col-3">Название графика</div>
                        <div className="col-2">Точка входа</div>
                        <div className="col-2">Точка выхода</div>
                        <div className="col-2">Результат</div>
                        <div className="col-3">Снимок графика</div>
                    </div>
                </div>
                <div className="table-body">
                    <ReactCSSTransitionGroup transitionName="log-item" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {
                        this.props.statiticStore.map((item, i) =>
                            <StatisticLogItem
                                key={item.uniqueId}
                                logItemId = {item.uniqueId}
                                resultView={item.resultView}
                                predictionPath={item.predictionPath}
                                deleteFromStat={this.props.deleteFromStat}/>
                        )
                    }
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        )
    }
}
