import React, {Component} from 'react';

export class CheckboxSelector extends Component {

  getOptions = () => this.props.options || [];

  handleCheckboxChange = (event) => this.props.onChange({
    key: event.target.value,
    active: event.target.checked
  });

  optionallyRenderInputField = (option) => option.input && option.active ? (
    <input type={'text'} data-key={option.key} value={option.value} placeholder={option.input.placeholder} onChange={this.handleInputFieldChange}/>
  ) : null;

  handleInputFieldChange = (event) => this.props.onInput({
    key: event.target.getAttribute('data-key'),
    value:  event.target.value
  });

  renderOption = (option, index) => (
    <li key={index}>
      <input type="checkbox" value={option.key} checked={option.active === true}
             onChange={this.handleCheckboxChange}/>{option.label} {this.optionallyRenderInputField(option)}
    </li>
  );

  renderOptionList = () => (
    <ul className={"option-list"}>
      {this.getOptions().map(this.renderOption)}
    </ul>
  );

  render = () => (
    <div className={'checkbox-selector'}>
      {this.renderOptionList()}
    </div>
  );
}
