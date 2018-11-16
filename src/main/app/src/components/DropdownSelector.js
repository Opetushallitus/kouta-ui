import React, {Component} from 'react';

export class DropdownSelector extends Component {

  getDefaultOption = () => <option key={'-'} value={'no-selection'} disabled={true}>{this.props.prompt}</option>;

  hasDefaultOption = () => this.props.prompt && true;

  getDefaultOptionAsArray = () => this.hasDefaultOption() ? [this.getDefaultOption()] : [];

  renderOptions = () => this.getDefaultOptionAsArray().concat(this.getOptions().map(this.renderOption));

  getOptions = () => (this.props.options || []);

  getControlOptions = () => this.hasDefaultOption() ? [this.getDefaultOption()].concat(this.getOptions()) :
    this.getOptions();

  getSelection = () => (this.getOptions().find(entry => entry.active) || {}).key || 'no-selection';

  handleChange = (event) => this.props.onChange({
    key: event.target.value,
    active: true
  });

  renderOption = (option, index) => (
    <option key={index} value={option.key}>{option.label}</option>
  );

  render = () => (
    <select className={'dropdown-selector'} value={this.getSelection()} onChange={this.handleChange}>
      {this.renderOptions()}
    </select>

  );

}
