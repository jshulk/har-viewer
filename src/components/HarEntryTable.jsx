require("fixed-data-table/dist/fixed-data-table.css");
require("./_har-entry-table.scss");
import React from 'react';
import FixedDataTable from 'fixed-data-table';
import _ from 'lodash';
import TimeBar from './timebar/TimeBar.jsx';
import FileType from './file-type/FileType.jsx';
import formatter from '../core/formatter';

const Table = FixedDataTable.Table;
const Column = FixedDataTable.Column;
const GutterWidth = 30;
const PropTypes = React.PropTypes;

export default class HarEntryTable extends React.Component {
	constructor(){
		super();
		this.state = {
			isColumnResizing: false,
			columnWidths: {
				url: 500,
				size: 100,
				time: 200
			},
			tableWidth: 1000,
			tableHeight: 500,
			sortDirection: {
				url: null,
				size: null,
				time: null
			}
		};

	}

	render(){
		return (
			
				<Table rowsCount={this.props.entries.length}
							ref="entriesTable"
							width={this.state.tableWidth}
							height={this.state.tableHeight}
							rowGetter={this._getEntry.bind(this)}
							isColumnResizing={this.state.isColumnResizing}
							onColumnResizeEndCallback={this._onColumnResized.bind(this)}
							rowHeight={30}
							headerHeight={30}>
						<Column dataKey="url"
								headerRenderer={this._renderHeader.bind(this)}
								cellRenderer={this._renderUrlColumn.bind(this)}
								cellDataGetter={this._readKey.bind(this)}
								width={this.state.columnWidths.url}
								isResizable={true}
								label="Url"/>
						<Column dataKey="size"
								headerRenderer={this._renderHeader.bind(this)}
								cellRenderer={this._renderSizeColumn.bind(this)}
								cellDataGetter={this._readKey.bind(this)}
								width={this.state.columnWidths.size}
								isResizable={true}
								label="Size"/>
						<Column dataKey="time"
								cellRenderer={this._renderTimeColumn.bind(this)}
								headerRenderer={this._renderHeader.bind(this)}
								cellDataGetter={this._readKey.bind(this)}
								width={this.state.columnWidths.time}
								isResizable={true}
								minWidth={200}
								label="Time"/>
				</Table>
		);
	}

	_readKey(key, entry) {
		var keyMap = {
			url: 'request.url',
			time: 'time.start'
		};

		key = keyMap[key] || key;
		return _.get(entry, key);
	}

	//Custom cell rendering
	_renderSizeColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width){
		return (<span>{formatter.fileSize(cellData)}</span>)
	}

	_renderUrlColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width){
		return (<FileType url={rowData.request.url} type={rowData.type} />);
	}

	_renderTimeColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
		var start = rowData.time.start,
			total = rowData.time.total,
			pgTimings = this.props.page.pageTimings,
			scale = this._prepareScale(this.props.entries, this.props.page);

		return (
			<TimeBar scale={scale}
				start={start}
				total={total}
				timings={rowData.time.details}
				domContentLoaded={pgTimings.onContentLoad}
				pageLoad={pgTimings.onLoad}/>
		);
	}

	_prepareScale(entries, page){
		var startTime = 0,
			lastEntry = _.last(entries),
			endTime = lastEntry.time.start + lastEntry.time.total,
			maxTime = Math.max(endTime, page.pageTimings.onLoad);

		var scale = d3.scale.linear()
			.domain([startTime, Math.ceil(maxTime)])
			.range([0,100]);

		return scale;
	}


	_renderHeader(label, dataKey){
		var dir = this.state.sortDirection[dataKey],
			classMap = {
				asc: 'glyphicon glyphicon-sort-by-attributes',
				desc: 'glyphicon glyphicon-sort-by-attributes-alt'
			}

		var sortClass = dir ? classMap[dir] : '';

		return (
			<div className="text-primary sortable"
				onClick={this._columnClicked.bind(this, dataKey)}>
				<strong>{label}</strong>
				&nbsp;
				<i className={sortClass}></i>
			</div>
		);
	}

	_columnClicked(dataKey) {
        var sortDirections = this.state.sortDirection;
        var dir = sortDirections[dataKey];

        if (dir === null) {dir = 'asc'; }
        else if (dir === 'asc') {dir = 'desc'; }
        else if (dir === 'desc') {dir = null; }

        // Reset all sorts
        _.each(_.keys(sortDirections), function (x) {
            sortDirections[x] = null;
        });

        sortDirections[dataKey] = dir;

        if (this.props.onColumnSort) {
            this.props.onColumnSort(dataKey, dir);
        }
    }
    
	_getEntry(index){
		return this.props.entries[index];
	}
	_onColumnResized(newColumnWidth, dataKey){
		var columnWidths = this.state.columnWidths;
		columnWidths[dataKey] = newColumnWidth;
		this.setState({
			columnWidths: columnWidths
		});
	}

	componentDidMount(){
		window.addEventListener("resize", _.debounce(this._onResize.bind(this), 30, {leading: true, trailing: true}));
		this._onResize();
	}
	_onResize(){
		var parent = this.refs.entriesTable.getDOMNode().parentNode;
		this.setState({
			tableWidth: parent.clientWidth - GutterWidth,
			tableHeight: document.body.clientHeight - parent.offsetTop - GutterWidth*0.5
		});
	}
}

HarEntryTable.defaultProps = {
	entries: [],
	onColumnSort: null,
	page: null
};

HarEntryTable.propTypes = {
	entries: PropTypes.array,
	onColumnSort: PropTypes.func,
	page: PropTypes.object
}