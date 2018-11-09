import React, {Component} from 'react';

export class CheckboxSelector extends Component {

  getOptions = () => this.props.options || [];

  getLabel = () => this.props.label;

  handleCheckboxChange = (event) => this.props.onChange({
    key: event.target.value,
    active: event.target.checked
  });

  renderOption = (option, index) => (
    <li key={index}>
      <input type="checkbox" value={option.key} checked={option.active === true}
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
