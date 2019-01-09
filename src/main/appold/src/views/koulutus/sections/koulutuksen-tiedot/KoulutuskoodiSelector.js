import React, {Component} from 'react';
import {broadcast, connectComponent, disconnectListener} from '../../../../utils/stateUtils';
import {KOULUTUSTYYPPI_CATEGORY} from '../../../../config/constants';
import {APP_EVENT_SELECT_KOULUTUSKOODI, APP_EVENT_SELECT_KOULUTUSTYYPPI} from "../../../../stores/koulutus/KoulutusStore";
import {APP_STATE_KOULUTUKSEN_TIEDOT} from "../../../../stores/koulutus/KoulutuksenTiedotStore";
import {APP_STATE_KOULUTUSKOODI_LIST, getKoulutusOptionById} from "../../../../stores/koulutus/KoulutuskoodiListStore";

const classNames = require('classnames');

export class KoulutuskoodiSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      editableName: '',
    };
  }

  componentDidMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUSKOODI_LIST]: (state) => this.setState(...this.state, {
        koulutusOptions: state.koulutusOptions
    }),
    [APP_STATE_KOULUTUKSEN_TIEDOT]: (state) => this.setState(...this.state, {
        nimi: state.nimi,
        enabled: state.enabled
    }),
    [APP_EVENT_SELECT_KOULUTUSTYYPPI]: (koulutustyyppi) =>
      this.setState(...this.state, { koulutustyyppi: koulutustyyppi })
    });

  componentWillUnmount = () => disconnectListener(this);

  getFilter = () => this.state.filter || '';

  getOptions = () => this.state.koulutusOptions || [];

  hasOptions = () => this.getOptions().length > 0;


  matchOption = (option) => option.comparisonValue.indexOf(this.getFilter()) > -1;

  isNameEditingAllowed = () =>  this.state.enabled && this.state.koulutustyyppi !== KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS;

  compareOptions = (a, b) => {
    const aName =  a.label;
    const bName = b.label;
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  };

  getFilteredOptions = () => this.getFilter().length > 0 ? this.getOptions()
    .filter(this.matchOption)
    .sort(this.compareOptions) : [];

  selectOption = (event) => {
    const value = event.target.getAttribute("data-id");
    this.setState({
      ...this.state,
      filter: '',
      optionsEnabled: false
    }, () => broadcast(APP_EVENT_SELECT_KOULUTUSKOODI, getKoulutusOptionById(value)));
  };

  getOptionCssClass = (option) => option.id === this.state.activeKoulutusId ? 'selected' : '';

  renderOption = (option, index) => (
    <li key={index} className={classNames("option-li", this.getOptionCssClass(option))} data-id={option.id} onClick={this.selectOption}>
      {option.label}
    </li>
  );

  setFilter = (e) => this.setState({
    ...this.state,
    filter: e.target.value.trim().toLowerCase(),
    optionsEnabled: true
  });

  //updateName = (e) => updateKoulutuksenNimi(e.target.value);

  renderOptions = () => {
    const filteredOptions = this.getFilteredOptions();
    return filteredOptions.length > 0 && this.state.optionsEnabled ? (
      <div className={"options-container"}>
        <ul className={"options-ul"}>
          {filteredOptions.map(this.renderOption)}
        </ul>
      </div>
    ) : null;
  };

  render = () => this.hasOptions() ? (
      <div className={"koulutus-selector"}>
        <span>Valitse koulutus listasta</span>
        <input type={"text"} value={this.state.filter} className={"filter-input"} placeholder={"Valitse koulutus..."} onChange={this.setFilter}/>
        {this.renderOptions()}
          <span className={'title-span'}>{this.state.nimi}</span>
      </div>
  ) : (
      <div className={"koulutus-selector"}>
        Valitse ensin koulutustyyppi.
      </div>
  );
}
