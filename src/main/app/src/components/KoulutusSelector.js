import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {getCssClassName} from '../utils/utils';
const classNames = require('classnames');

@inject("appStore")
@observer
export class KoulutusSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filter: ''
    };
  }

  getOptions = () => this.props.appStore.koulutusOptions || [];

  matchOption = (option) => option.comparisonValue.indexOf(this.state.filter) > -1;

  compareOptions = (a, b) => {
    const aName =  a.label;
    const bName = b.label;
    if(aName < bName) return -1;
    if(aName > bName) return 1;
    return 0;
  }

  getFilteredOptions = () => this.state.filter.length > 0 ? this.getOptions().filter(this.matchOption).sort(this.compareOptions) : [];

  selectOption = (event) => this.props.appStore.selectKoulutus(event.target.getAttribute("data-id"));

  getOptionCssClass = (option) => option.id === this.props.appStore.activeKoulutusId ? 'selected' : '';

  renderOption = (option, index) => (
    <li key={index} className={classNames("option-li", this.getOptionCssClass(option))} data-id={option.id} onClick={this.selectOption}>
      {option.label}
    </li>
  )

  setFilter = (e) => this.setState({
    filter: e.target.value.trim().toLowerCase()
  });

  renderOptions = () => {
    const filteredOptions = this.getFilteredOptions();
    return filteredOptions.length > 0 ? (
      <div className={"options-container"}>
        <ul className={"options-ul"}>
          {this.getFilteredOptions().map(this.renderOption)}
        </ul>
      </div>
    ) : null;
  }

  render = () => (
    <div className={getCssClassName(this)}>
      <input type={"text"} className={"filter-input"} placeholder={"Valitse koulutus..."} onChange={this.setFilter}></input>
      {this.renderOptions()}
    </div>
  );


}