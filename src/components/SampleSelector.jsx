import React from 'react';

const PropTypes = React.PropTypes;

export default class SampleSelector extends React.Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		var options = _.map(window.samples, (s)=> {
			return (<option key={s.id} value={s.id}>{s.label}</option>)
		});

		return (
			<div>
					<label className="control-label">
							<select className="form-control" ref="selector" onChange={this._onSampleChanged.bind(this)}>
								<option value="">---</option>
									{options}
							</select>
					</label>
			</div>
		);
	}

	_onSampleChanged(){
		var selection = this.refs.selector.getDOMNode().value;
		var har = selection ? _.find(window.samples, (s)=> s.id === selection).har : null;

		if( this.props.onSampleChanged ) {
			this.props.onSampleChanged(har);		
		} 
	}

}

SampleSelector.propTypes = {
	onSampleChanged: PropTypes.func
}

SampleSelector.defaultProps = {
	onSampleChanged: null
};