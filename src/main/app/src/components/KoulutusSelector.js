import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';

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

  getFilteredOptions = () => this.getOptions().filter(this.matchOption).sort(this.compareOptions);

  selectOption = (event) => this.props.appStore.selectKoulutus(event.target.getAttribute("data-id"));

  renderOption = (option, index) => (
    <li key={index} className={"option-li"} data-id={option.id} onClick={this.selectOption}>
      {option.label}
    </li>
  )

  setFilter = (e) => this.setState({
    filter: e.target.value.toLowerCase()
  });

  renderOptions = () => (
      <div className={"options-container"}>
        <ul className={"options-ul"}>
          {this.getFilteredOptions().map(this.renderOption)}
        </ul>
      </div>
  );

  render = () => (
    <div className={"filter-list"}>
      <input type={"text"} className={"filter-input"} placeholder={"Valitse koulutus..."} onChange={this.setFilter}></input>
      {this.renderOptions()}
    </div>
  )

}