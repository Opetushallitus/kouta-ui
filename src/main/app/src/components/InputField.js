import React, {Component} from 'react';

export class InputField extends Component {

  onChange = (event) => this.props.onChange({...this.props.field, value: event.target.value});

  getKey = () => this.getId();

  getId = () => this.props.field.id;

  getLabel = () => this.props.field.label;

  getValue = () => this.props.field.value;

  render = () => (
    <div id={this.getId()} key={this.getKey()} className={'input-field'}>
      <span className={'label'}>{this.getLabel()}</span>
      <input type={'text'} value={this.getValue()} placeholder={this.getLabel()} onChange={this.onChange}/>
    </div>
  );
}
