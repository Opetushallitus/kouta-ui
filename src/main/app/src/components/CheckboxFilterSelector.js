import React, {Component} from 'react';
import {updateMultiSelectionOptionActivation} from '../utils/optionListUtils';

export class CheckboxFilterSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      expanded: false
    };
  }

  getControlIcon = () => this.state.expanded ? 'expand_more' : 'expand_less';

  getFilter = () => this.state.filter;

  setFilter = (event) => this.setState({
    ...this.state,
    filter: event.target.value,
    expanded: true
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

  toggleExpanded = () => this.setState({
    ...this.state,
    expanded: !this.state.expanded
  });

  renderOption = (option, index) => (
    <li key={index}>
      <input type='checkbox' value={option.key} checked={option.active === true}
             onChange={this.handleCheckboxChange}/>{option.label}
    </li>
  );

  renderOptionList = () => this.state.expanded && (
    <div className={'options-container'}>
      <ul className={'options-list'}>
        {this.getFilteredOptions().map(this.renderOption)}
      </ul>
    </div>
  );

  removeTag = (key) => {
    this.props.onSelect(
      updateMultiSelectionOptionActivation(this.props.options, {
        key,
        active: false
      })
    );
  }

  renderTag = (option, index) => (
    <div key={index} className={'tag'}>
      <span>{option.label}</span>
      <div className={'remove-button'} onClick={() => this.removeTag(option.key)}>
        <i className={'material-icons'}>clear</i>
      </div>
    </div>
  )

  renderTags = () => this.supportsTags() && (
    <div className={'tags-container'}>
      {this.getActiveOptions().map(this.renderTag)}
    </div>
  )

  render = () => (
    <div className={'checkbox-filter-selector'}>
      <span className={'label-span'}>
        {this.getLabel()}
      </span>
      <div className={'controls'}>
        <input type={'text'} value={this.getFilter()} onChange={this.setFilter}/>
        <div className={'expand-button'}>
          <i className="material-icons" onClick={this.toggleExpanded}>{this.getControlIcon()}</i>
        </div>
      </div>
      {this.renderOptionList()}
      {this.renderTags()}
    </div>
  );
}
