require("fixed-data-table/dist/fixed-data-table.css");

import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input, Alert} from 'react-bootstrap';
import mimeTypes from '../core/mimeTypes';
import HarEntryTable from './HarEntryTable.jsx';
import harParser from '../core/har-parser';
import FilterBar from './FilterBar.jsx';
import SampleSelector from './SampleSelector.jsx';
import TypePieChart from './pie-chart/TypePieChart.jsx';


export default class HarViewer extends React.Component {
	constructor(){
		super();
		this.state = this._initialState();
	}
	_initialState(){
		return {
			entries: [],
			activeHar: null,
			sortKey: null,
			sortDirection: null,
			filterType: 'all',
			filterText: null
		}
	}
	render(){
		var content = this.state.activeHar ? this._renderViewer(this.state.activeHar) : this._renderEmptyViewer();
		
		return (
			<div>
				{this._renderHeader()}
				{content}
			</div>
		);
	}

	_renderEmptyViewer(){
		return (
			<Grid fluid>
				<Row>
					<Col sm={12}>
						<p></p>
						<Alert bsStyle="warning">
							<strong>No Har loaded</strong>
						</Alert>
					</Col>
				</Row>
			</Grid>
		);
	}
	_renderViewer(har){
		var pages = harParser.parse(har);
		var currentPage = pages[0];
		var filter = {
			type: this.state.filterType,
			text: this.state.filterText
		};

		var filteredEntries = this._filterEntries(filter, currentPage.entries);

		var entries = this._sortEntriesByKey(this.state.sortKey,
		 	this.state.sortDirection,
		 	filteredEntries);

		return (
			<Grid fluid>
				<FilterBar  onChange={this._onFilterChanged.bind(this)}
					onFilterTextChange={this._onFilterTextChanged.bind(this)}>
				</FilterBar>
				<Row>
					<Col sm={12}>
						<TypePieChart entries = {currentPage.entries}></TypePieChart>
					</Col>
				</Row>

				<Row>
					<Col sm={12}>
						<HarEntryTable entries = {entries}
						 page={currentPage}
						 onColumnSort = {this._onColumnSort.bind(this)} />
					</Col>
				</Row>
			</Grid>
		);
	}
	_filterEntries(filter, entries){
		return _.filter(entries, function(entry){
			var matchesType = filter.type === 'all' || filter.type == entry.type,
				matchesText = _.includes(entry.request.url, filter.text || '');
			return matchesType && matchesText;
		});
	}
	_onFilterChanged(type){
		this.setState({
			filterType: type
		});
	}

	_onFilterTextChanged(text){
		this.setState({
			filterText: text
		});
	}

	_sortEntriesByKey(sortKey, sortDirection, entries){
		if( _.isEmpty(sortKey) || _.isEmpty(sortDirection) ) return entries;

		var keyMap = {
			url: 'request.url',
			time: 'start.time'
		};
		var getValue = function(entry){
			var key = keyMap[sortKey] || sortKey;
			return _.get(entry, key);
		}
		var sorted = _.sortBy(entries, getValue);
		if( sortDirection == "desc"){
			sorted = sorted.reverse();
		}
		return sorted;
	}

	
	
	_onColumnSort(dataKey, direction){
		this.setState({
			sortKey: dataKey,
			sortDirection: direction
		});
	}

	
	
	_renderHeader(){


		
		return (
			<Grid>
				<Row>
					<Col sm={12} >
						<PageHeader>Har Viewer</PageHeader>
					</Col>
					<Col sm={3} smOffset={9}>
						<SampleSelector onSampleChanged={this._sampleChanged.bind(this)}></SampleSelector>
					</Col>
				</Row>
				
			</Grid>
		);
	}

	_sampleChanged(har){
		if( har ){
			this.setState({
				activeHar: har
			});
		} else {
			this.setState(this._initialState());
		}
	}

}


HarViewer.defaultProps = {
	entries: []
};