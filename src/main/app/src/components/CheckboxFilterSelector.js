import React, {Component} from 'react';
import {updateMultiSelectionOptionActivation} from '../utils/optionListUtils';

export class CheckboxFilterSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      visibleList: false
    };
  }

  getFilter = () => this.state.filter;

  setFilter = (event) => this.setState({
    ...this.state,
    filter: event.target.value,
    visibleList: true
  });

  supportsTags = () => this.props.maxTags && this.props.maxTags > 0;

  getFilteredOptions = () => (this.props.options || []).filter(option => option.label.includes(this.state.filter));

  getActiveOptions = () => (this.props.options || []).filter(option => option.active);

  getLabel = () => this.props.label;

  handleCheckboxChange = (event) => this.props.onSelect(
    updateMultiSelectionOptionActivation(this.props.options, {
      key: event.target.value,
      active: event.target.checked
    })
  );

  renderOption = (option, index) => (
    <li key={index}>
      <input type='checkbox' value={option.key} checked={option.active}
             onChange={this.handleCheckboxChange}/>{option.label}
    </li>
  );

  renderOptionList = () => this.state.visibleList && (
    <div className={'options-container'}>
      <ul className={'options-list'}>
        {this.getFilteredOptions().map(this.renderOption)}
      </ul>
    </div>
  );

  renderTag = (option) => (
    <div className={'tag'}>{option.label}</div>
  )

  renderTags = () => this.supportsTags() && (
    <div className={'tags-container'}>
      {this.getActiveOptions().map(this.renderTag)}
    </div>
  )

  render = () => (
    <div className={'checkbox-filter-selector'}>
      <span className={'label'}>
        {this.getLabel()}
      </span>
      <input type={'text'} value={this.getFilter()} onChange={this.setFilter}/>
      {this.renderOptionList()}
      {this.renderTags()}
    </div>
  );
}
