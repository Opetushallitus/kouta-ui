import React, {Component} from 'react';
import {APP_STATE_KOULUTUS_DETAILS} from '../config/states';
import {connectToOne} from '../utils/stateUtils';

export class KoulutusDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => connectToOne(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState(state));

  renderDetailsRow = (label, value) => (
    <div className={"details-row"}>
      <div className={"label-column"}>{label}</div>
      <div className={"value-column"}>{value}</div>
    </div>
  )

  renderOpintojenLaajuus = () => this.state.opintojenLaajuus || '';

  renderOpintojenLaajuusyksikko = () => this.state.opintojenLaajuusyksikko || '';

  renderOpintojenLaajuusInfo = () => this.renderOpintojenLaajuus() + ' ' + this.renderOpintojenLaajuusyksikko();

  renderOsaamisalaItem = (item, index) => (
    <li key={index} className={"osaamisala-item"}>
      {item}
    </li>
  )

  renderOsaamisalaList = () => (
    <ul className={"osaamisala-list"}>
      {this.state.osaamisalaList.map(this.renderOsaamisalaItem)}
    </ul>
  )

  renderTutkintonimikeList = () => this.state.tutkintonimikeList.join(', ');

  render = () => this.state.active ?  (
    <div className={"koulutus-details"}>
      {this.renderDetailsRow('Koulutus:', this.state.nimi)}
      {this.renderDetailsRow('Koulutusala:', this.state.koulutusala)}
      {this.renderDetailsRow('Osaamisalat:', this.renderOsaamisalaList())}
      {this.renderDetailsRow('Tutkintonimike:', this.renderTutkintonimikeList())}
      {this.renderDetailsRow('Laajuus:', this.renderOpintojenLaajuusInfo())}
    </div>
  ) : null;
}