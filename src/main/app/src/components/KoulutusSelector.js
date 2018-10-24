import React, {Component} from 'react';
import {APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, APP_STATE_KOULUTUS_DETAILS, APP_STATE_KOULUTUSKOODI_LIST} from '../config/states';
import {selectKoulutus, updateKoulutuksenNimi} from '../stores/KoulutusDetailsStore';
import {connectToOne} from '../utils/stateUtils';
import {KoulutusNameTranslationEditor} from '../views/koulutus-publication/sections/koulutuksen-tiedot/KoulutusNameTranslationEditor';
import {KOULUTUSTYYPPI_CATEGORY} from '../config/constants';

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
    connectToOne(APP_STATE_KOULUTUSKOODI_LIST, this, (state) => this.setState(...this.state, {
        koulutusOptions: state.koulutusOptions
    }));
    connectToOne(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState(...this.state, {
        nimi: state.nimi,
        enabled: state.enabled
    }));
    connectToOne(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, this, (koulutustyyppiCategory) => {
      this.setState(...this.state, {koulutustyyppiCategory});
    });
  };

  getFilter = () => this.state.filter || '';

  getOptions = () => this.state.koulutusOptions || [];

  hasOptions = () => this.getOptions().length > 0;

  matchOption = (option) => option.comparisonValue.indexOf(this.getFilter()) > -1;

  isNameEditingAllowed = () =>  this.state.enabled && this.state.koulutustyyppiCategory !== KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS;

  compareOptions = (a, b) => {
    const aName =  a.label;
    const bName = b.label;
    if(aName < bName) return -1;
    if(aName > bName) return 1;
    return 0;
  }

  getFilteredOptions = () => this.getFilter().length > 0 ? this.getOptions().filter(this.matchOption).sort(this.compareOptions) : [];

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

  renderNameEditor = () => this.isNameEditingAllowed() ? (
      <KoulutusNameTranslationEditor/>
  ) : null;

  render = () => this.hasOptions() ? (
      <div className={"koulutus-selector"}>
        <span>Valitse koulutus listasta</span>
        <input type={"text"} className={"filter-input"} placeholder={"Valitse koulutus..."} onChange={this.setFilter}></input>
        {this.renderOptions()}
        {this.renderNameEditor()}
      </div>
  ) : (
      <div className={"koulutus-selector"}>
        Valitse ensin koulutustyyppi.
      </div>
  );
}