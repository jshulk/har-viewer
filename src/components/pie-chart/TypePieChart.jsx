import React from 'react';
import _ from 'lodash';
import chartBuilder from './chart-builder';

export default class TypePieChart extends React.Component {
	constructor(){
		super();
		this.state = {
			svgWidth: 275,
			svgHeight: 275,
			width: 125,
			height: 125
		};
	}

	render(){

		var center = {
			x: this.state.svgWidth/2,
			y: this.state.svgHeight/2
		};

		return (
			<svg width={this.state.svgWidth} height={this.state.svgHeight}>
				<g ref="container" transform={`translate(${center.x}, ${center.y})`}></g>
			</svg>
		);
	}

	componentDidMount(){
		this._buildChart(this.props.entries);
	}

	componentWillReceiveProps(props){
		if( this.props.entries.length !== props.length) {
			this._buildChart(this.props.entries);
		}
	}

	_buildChart(entries){
		var groups = this._getEntriesByGroup(entries || []),
			config = {
				width: this.state.width,
				height: this.state.height
			};

		chartBuilder(groups, this.refs.container.getDOMNode(), config);

	}

	chartBuilder(){}

	_getEntriesByGroup(entries){
		return _.chain(entries)
			.groupBy(x => x.type)
			.map((g, key) => {
				return {
					type: key,
					count: g.length
				}
			})
			.value(); 
	}
}

TypePieChart.defaultProps = {

}