import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {broadcast, connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_KOULUTUSTYYPPI_OPTIONS} from "../../../stores/koulutus/KoulutusOptionsStore";
import {APP_EVENT_SELECT_KOULUTUSTYYPPI, APP_STATE_KOULUTUS_JSON} from "../../../stores/koulutus/KoulutusStore";

export class KoulutuksenTyyppiSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUSTYYPPI_OPTIONS]: (koulutustyyppiOptions) => this.setState({
      ...this.state,
      koulutustyyppiOptions
    }),
    [APP_STATE_KOULUTUS_JSON]: (koulutus) => this.setState({
      ...this.state,
      koulutus
    })
  });

  getClassName = () => 'KoulutuksenTyyppiSection';

  getHeader = () => 'Valitse koulutustyyppi';

  handleCheckboxChange = (event) => broadcast(APP_EVENT_SELECT_KOULUTUSTYYPPI, event.target.value);

  isOptionChecked = (option) => this.state.koulutus && option.value === this.state.koulutus.koulutustyyppi;

  onClearButtonClick = () => broadcast(APP_EVENT_SELECT_KOULUTUSTYYPPI);

  renderKoulutustyyppiOption = (koulutustyyppiOption, index) => (
    <li key={index}>
      <input type="radio" name="koulutustyyppi" value={koulutustyyppiOption.value} checked={this.isOptionChecked(koulutustyyppiOption)}
             onChange={this.handleCheckboxChange} />{koulutustyyppiOption.label}
    </li>
  )

  renderKoulutustyyppiList = () => this.state.koulutustyyppiOptions ? (
    <ul className={"koulutustyyppi-list"}>
      {this.state.koulutustyyppiOptions.map(this.renderKoulutustyyppiOption)}
    </ul>
  ) : null;

  renderContent = () => (
    <div className={"content"}>
      {this.renderKoulutustyyppiList()}
    </div>
  );

}
