import React from 'react';
import {AbstractSection} from './AbstractSection';
import {broadcast, connectComponent} from '../utils/stateUtils';

const classNames = require('classnames');

export class AbstractCheckboxSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [this.getOptionsStateName()]: (state) => this.setState({...this.state, options: state}),
    [this.getSelectionsStateName()]: (state) => this.setState({...this.state, selections: state})
  });

  getClassName = () => 'CheckboxSection';

  getHeader = () => {
    throw new Error('AbstractCheckboxSection:getHeader(): implement in subclass!');
  };

  getInstruction = () => {
    throw new Error('AbstractCheckboxSection:getInstruction(): implement in subclass!');
  }

  getOptionsStateName = () => {
    throw new Error('AbstractCheckboxSection:getOpti]onsStateName(): implement in subclass!');
  }

  getSelectionsStateName = () => {
    throw new Error('AbstractCheckboxSection:getSelectionsStateName(): implement in subclass!');
  }

  getSelectionChangeEventName = () => {
    throw new Error('AbstractCheckboxSection:getSelectionChangeEventName(): implement in subclass!');
  }

  getSelectionClearEventName = () => {
    throw new Error('AbstractCheckboxSection:getSelectionClearEventName(): implement in subclass!');
  }

  getOptions = () => this.state.options || [];

  isOptionChecked = (option) => this.state.selections[option.value] === true;

  handleCheckboxChange = (event) => {
    const value = event.target.value;
    const selected = event.target.checked;
    broadcast(this.getSelectionChangeEventName(), {value, selected});
  }

  onClearButtonClick = () => broadcast(this.getSelectionClearEventName());

  renderOption = (option, index) => (
      <li key={index}>
        <input type="checkbox" name={this.getClassName()} value={option.value} checked={this.isOptionChecked(option)}
               onChange={this.handleCheckboxChange}/>{option.label}
      </li>
  );

  renderOptionList = () => this.state.options ? (
      <ul className={this.getCssClassName() + "-list"}>
        {this.getOptions().map(this.renderOption)}
      </ul>
  ) : null;

  renderContent = () => (
      <div className={classNames("content", "checkbox-section-content")}>
        {this.getInstruction()}
        {this.renderOptionList()}
      </div>
  );

}

