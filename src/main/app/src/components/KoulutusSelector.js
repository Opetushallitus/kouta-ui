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

  getOptions = () => this.props.appStore.koodisto || [];

  matchOption = (option) => option.metadata[0]['nimi'].toLowerCase().indexOf(this.state.filter) > -1;

  compareOptions = (a, b) => {
    const aName =  a.metadata[0]['nimi'];
    const bName = b.metadata[0]['nimi'];
    if(aName < bName) return -1;
    if(aName > bName) return 1;
    return 0;
  }

  getFilteredOptions = () => this.getOptions().filter(this.matchOption).sort(this.compareOptions)

  renderOption = (option, index) => (
    <li key={index} className={"option-li"}>
      {option.metadata[0]['nimi']}
    </li>
  )

  renderOptions = () => {
    const options  = this.getFilteredOptions();
    return (
        <div className={"options-container"}>
          <ul className={"options-ul"}>
            {this.getFilteredOptions().map(this.renderOption)}
          </ul>
        </div>
    );
  }

  setFilter = (e) => this.setState({
    filter: e.target.value.toLowerCase();
  });

  render = () => (
    <div className={"filter-list"}>
      <input type={"text"} className={"filter-input"} placeholder={"Valitse koulutus..."} onChange={this.setFilter}></input>
      {this.renderOptions()}
    </div>
  )

}