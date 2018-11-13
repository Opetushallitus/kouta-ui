import React, {Component} from 'react';

export class DateTimeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      time: props.time || '',
      date: props.date || '',
      label: props.label || ''
    };
  }

  getDate = () => this.state.date;

  getTime = () => this.state.time;

  getId = () => this.props.id;

  getLabel = () => this.state.label;

  onDateChange = (event) => this.setState({
    ...this.state,
    date: event.target.value
  }, () => this.props.onChange(this.state));

  onTimeChange = (event) => this.setState({
    ...this.state,
    time: event.target.value
  }, () => this.props.onChange(this.state));

  render = () => (
    <div id={this.getId()} className={'date-time-editor'}>
      <span className={'label'}>
        {this.getLabel()}
      </span>
      <div className={'inputs'}>
        <input type={'text'} className={'date-input'} placeholder={'pp.kk.vvvv'} onChange={this.onDateChange}
               value={this.getDate()}/>
        <i className='material-icons'>calendar_today</i>
        <input type={'text'} className={'time-input'} placeholder={'hh:mm'} onChange={this.onTimeChange}
               value={this.getTime()}/>
      </div>
    </div>
  );
}
