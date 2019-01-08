import React, {Component} from 'react';

export class InputField extends Component {

  onChange = (event) => this.props.onChange({
      id: this.getId(),
      key: this.getId(),
      value: event.target.value
  });

  getKey = () => this.getId();

  getId = () => this.props.id;

  getLabel = () => this.props.label;

  getValue = () => this.props.value;

  render = () => (
    <div id={this.getId()} key={this.getKey()} className={'input-field'}>
      <span className={'label-span'}>{this.getLabel()}</span>
      <input type={'text'} value={this.getValue()} placeholder={this.getLabel()} onChange={this.onChange}/>
    </div>
  );
}
