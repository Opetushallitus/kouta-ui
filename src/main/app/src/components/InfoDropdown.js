import React, {Component} from 'react';
import {broadcast} from '../utils/stateUtils';

export class InfoDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (event) => this.props.onChange(event.target.value);

  onClearButtonClick = () => broadcast(this.getSelectionClearEventName());

  renderOption = (option, index) => <option key={index} value={option.value}>{option.label}</option>

  getSelection = () => this.props.selection;

  getLabel = () => this.props.label;

  getOptions = () => this.props.options || [];

  getDefaultOption = () => <option key={"-"} value={"no-selection"} disabled={true}>Valitse koulutus</option>

  renderOptions = () => this.getOptions() ?
    [this.getDefaultOption()].concat(this.getOptions().map(this.renderOption))
    : null;

  hasOptions = () => this.getOptions().length > 0;

  render = () => this.hasOptions() ? (
      <div className={"info-dropdown"}>
        {this.getLabel()}
        <select value={this.getSelection()} onChange={this.handleChange}>
          {this.renderOptions()}
        </select>
      </div>
  ) : (
    <div className={"info-dropdown"}>
      Valintoja ei ole saatavilla.
    </div>
  )


}
