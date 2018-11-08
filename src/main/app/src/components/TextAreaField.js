import React, {Component} from 'react';

export class TextAreaField extends Component {

  onChange = (event) => this.props.onChange({
    key: this.getKey(),
    value: event.target.value
  });

  getKey = () => this.props.id;

  getId = () => this.props.id;

  getLabel = () => this.props.label;

  getValue = () => this.props.value;

  render = () => (
    <div id={this.getId()} key={this.getKey()} className={'textarea-field'}>
      <span className={'label'}>
        {this.getLabel()}
      </span>
      <textarea value={this.getValue()} onChange={this.onChange}/>
    </div>
  );
}
