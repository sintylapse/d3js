import React from 'react'

class StatisticLogItem extends React.Component{
    render(){
        let resultView = this.props.resultView
        let predictionPath = this.props.predictionPath

        return(
            <div className="row">
                <div className="col-3">Рандомный график</div>
                <div className="col-2">{predictionPath[0].value}</div>
                <div className="col-2">{predictionPath[predictionPath.length - 1].value}</div>
                <div className="col-2">{resultView.message}, {resultView.value}</div>
                <div className="col-3">Screen</div>
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
        console.log(this.props.statiticStore);
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
                            resultView={item.resultView}
                            predictionPath={item.predictionPath}/>
                    )
                }
            </div>
        )
    }
}
