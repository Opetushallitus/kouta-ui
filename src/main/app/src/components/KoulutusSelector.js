import React, {Component} from 'react';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_KOULUTUS_DETAILS, APP_STATE_KOULUTUS_LIST} from '../config/states';
import {selectKoulutus, updateKoulutuksenNimi} from '../stores/KoulutusDetailsStore';
import {connectToOne} from '../utils/stateUtils';

const classNames = require('classnames');
export class KoulutusSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      editableName: '',
    };
  }

  componentDidMount = () => {
    connectToOne(APP_STATE_KOULUTUS_LIST, this, (state) => {
        this.setState({...this.state, ...state});
    });
    connectToOne(APP_STATE_ACTIVE_KOULUTUS, this, (state) => {
      this.setState({...this.state, ...state});
    });
    connectToOne(APP_STATE_KOULUTUS_DETAILS, this, (state) => {
      this.setState({...this.state, ...state});
    });
  };

  getOptions = () => this.state.koulutusOptions || [];

  matchOption = (option) => option.comparisonValue.indexOf(this.state.filter) > -1;

  compareOptions = (a, b) => {
    const aName =  a.label;
    const bName = b.label;
    if(aName < bName) return -1;
    if(aName > bName) return 1;
    return 0;
  }

  getFilteredOptions = () => this.state.filter.length > 0 ? this.getOptions().filter(this.matchOption).sort(this.compareOptions) : [];

  selectOption = (event) => {
    const value = event.target.getAttribute("data-id");
    selectKoulutus(value);
  }

  getOptionCssClass = (option) => option.id === this.state.activeKoulutusId ? 'selected' : '';

  renderOption = (option, index) => (
    <li key={index} className={classNames("option-li", this.getOptionCssClass(option))} data-id={option.id} onClick={this.selectOption}>
      {option.label}
    </li>
  )

  setFilter = (e) => this.setState({
    filter: e.target.value.trim().toLowerCase()
  });

  updateName = (e) => updateKoulutuksenNimi(e.target.value);

  renderOptions = () => {
    const filteredOptions = this.getFilteredOptions();
    return filteredOptions.length > 0 ? (
      <div className={"options-container"}>
        <ul className={"options-ul"}>
          {filteredOptions.map(this.renderOption)}
        </ul>
      </div>
    ) : null;
  }

  renderNameEditor = () => this.state.activeKoulutusId ? (
    <div className={"name-editor"}>
      <span>Muokkaa koulutuksen nimeä</span>
      <input type={"text"} className={"filter-input"} placeholder={"Koulutuksen nimi"} onChange={this.updateName} value={this.state.nimi}></input>
    </div>
  ) : null;

  render = () => (
      <div className={"koulutus-selector"}>
      <span>Valitse koulutus listasta</span>
      <input type={"text"} className={"filter-input"} placeholder={"Valitse koulutus..."} onChange={this.setFilter}></input>
      {this.renderOptions()}
      {this.renderNameEditor()}
    </div>
  );


}