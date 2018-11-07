import React, {Component} from 'react';

export class CheckboxSelector extends Component {

  getOptions = () => this.props.options || [];

  getSelections = () => this.props.selections || [];

  getLabel = () => this.props.label;

  isOptionChecked = (option) => this.getSelections()[option.value] === true;

  handleCheckboxChange = (event) => this.props.onChange({
    value: event.target.value,
    selected: event.target.checked
  });

  renderOption = (option, index) => (
    <li key={index}>
      <input type="checkbox" value={option.value} checked={this.isOptionChecked(option)}
             onChange={this.handleCheckboxChange}/>{option.label}
    </li>
  );

  renderOptionList = () => (
    <ul className={"option-list"}>
      {this.getOptions().map(this.renderOption)}
    </ul>
  );

  render = () => (
    <div className={'checkbox-selector'}>
      <span className={"label"}>
        {this.getLabel()}
      </span>
      {this.renderOptionList()}
    </div>
  );
}
