import React from 'react';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../../config/states';
import {connectListener} from '../../../../utils/stateUtils';
import {Connectable} from '../../../../components/Connectable';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from "../../../../stores/koulutus/KoulutuksenTiedotStore";

export class KoulutusDetails extends Connectable {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => connectListener(this, APP_STATE_KOULUTUKSEN_TIEDOT, (state) => this.setState(state));

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

  getOsaamisaalaNameList = () => this.state.osaamisalaNameList || [];

  renderOsaamisalaList = () => (
    <ul className={"osaamisala-list"}>
      {this.getOsaamisaalaNameList().map(this.renderOsaamisalaItem)}
    </ul>
  )

  renderTutkintonimikeList = () => this.state.tutkintonimikeList.join(', ');

  render = () => this.state.enabled ?  (
    <div className={"koulutus-details"}>
      {this.renderDetailsRow('Koulutus:', this.state.nimi)}
      {this.renderDetailsRow('Koulutusala:', this.state.koulutusala)}
      {this.renderDetailsRow('Osaamisalat:', this.renderOsaamisalaList())}
      {this.renderDetailsRow('Tutkintonimike:', this.renderTutkintonimikeList())}
      {this.renderDetailsRow('Laajuus:', this.renderOpintojenLaajuusInfo())}
    </div>
  ) : null;
}
