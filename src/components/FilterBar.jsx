import React from 'react';
import _ from 'lodash';
import {Input, Button, ButtonGroup, Row, Col} from 'react-bootstrap';
import mimeTypes from '../core/mimeTypes.js';

const PropTypes = React.PropTypes;

export default class FilterBar extends React.Component {
	constructor(){
		super();
		this.state={
			type: 'all'
		};
	}
	render(){
		var buttons = _.map(_.keys(mimeTypes.types), (x)=> {
			return this._createButton(x, mimeTypes.types[x].label);
		});
		return (
			<Row>
					<Col sm={8}>
						<ButtonGroup bsSize="small">
							{this._createButton('all', 'All')}
							{buttons}
						</ButtonGroup>
					</Col>
					<Col sm={4}>
						<Input type="search"
							onChange={this._filterTextChanged.bind(this)}
							placeholder="Search Url"
							bsSize="small"
							ref="filterText"/>
						
					</Col>
			</Row>
		);
	}

	_filterTextChanged(){
		if( this.props.onFilterTextChange ) {
			this.props.onFilterTextChange(this.refs.filterText.getValue());
		}
	}

	_filterRequested(type, event){
		this.setState({type: type});
		if( this.props.onChange ){
			this.props.onChange(type);
		}
	}


	_createButton(type, label){
		var handler = this._filterRequested.bind(this, type);
		return (
			<Button key={type}
				bsStyle="primary"
				active={this.state.type === type}
				onClick={handler}>{label}
			</Button>
		);
	}


}

FilterBar.defaultProps = {
	onChange: null,
	onFilterTextChange: null
};

FilterBar.propTypes = {
	onChange: PropTypes.func,
	onFilterTextChange: PropTypes.func
}