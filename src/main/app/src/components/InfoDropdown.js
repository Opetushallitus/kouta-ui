import React, {Component} from 'react';

export class InfoDropdown extends Component {

  handleChange = (event) => this.props.onChange(event.target.value);

  renderOption = (option, index) => <option key={index} value={option.value}>{option.label}</option>

  getSelection = () => this.props.selection;

  getLabel = () => this.props.label;

  getOptions = () => this.props.options || [];

  getDefaultOption = () => <option key={"-"} value={"no-selection"}>Valitse</option>

  renderOptions = () => {
      const options = Array.isArray(this.getOptions()) ? this.getOptions() : Object.values(this.getOptions());
      return options ? [this.getDefaultOption()].concat(options.map(this.renderOption)) : [this.getDefaultOption()];
  };

  hasOptions = () => this.getOptions().length > 0;

  render = () => (
      <div className={"info-dropdown"}>
        <span className={"label-span"}>{this.getLabel()}</span>
        <select value={this.getSelection()} onChange={this.handleChange}>
          {this.renderOptions()}
        </select>
      </div>
  )

}
