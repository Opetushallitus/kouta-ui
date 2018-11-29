import React, {Component} from 'react';

export class DateTimeEditor extends Component {

  getDateTime = () => this.props.dateTime || {};

  getDate = () => this.getDateTime().date;

  getTime = () => this.getDateTime().time;

  getId = () => this.props.id;

  getLabel = () => this.props.label;

  onDateChange = (event) => this.props.onChange({
      ...this.props.dateTime,
      date: event.target.value
  });

  onTimeChange = (event) => this.props.onChange({
      ...this.props.dateTime,
      time: event.target.value
  });

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
