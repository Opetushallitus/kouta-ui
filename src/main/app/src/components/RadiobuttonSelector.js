import React, {Component} from 'react';

export class RadiobuttonSelector extends Component {

  getOptions = () => this.props.options || [];

  getName = () => this.props.name;

  handleCheckboxChange = (event) => this.props.onChange({
    key: event.target.value,
    active: event.target.checked
  });

  renderOption = (option, index) => (
    <li key={index}>
      <input type="radio" name={this.getName()} value={option.key} checked={option.active === true}
             onChange={this.handleCheckboxChange}/>{option.label}
    </li>
  );

  renderOptionList = () => (
    <ul className={'option-list'}>
      {this.getOptions().map(this.renderOption)}
    </ul>
  );

  render = () => (
    <div className={'radiobutton-selector'}>
      {this.renderOptionList()}
    </div>
  );
}
