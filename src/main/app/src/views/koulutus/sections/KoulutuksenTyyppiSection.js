import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION,
  APP_EVENT_SELECT_KOULUTUSTYYPPI,
  APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY,
  APP_STATE_KOULUTUSTYYPPI_OPTIONS
} from '../../../config/states';
import {broadcast, connectComponent} from '../../../utils/stateUtils';

export class KoulutuksenTyyppiSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUSTYYPPI_OPTIONS]: (koulutustyyppiOptions) => this.setState({
      ...this.state,
      koulutustyyppiOptions
    }),
    [APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY]: (activeKoulutustyyppi) => this.setState({
      ...this.state,
      activeKoulutustyyppi
    })
  });

  getClassName = () => 'KoulutuksenTyyppiSection';

  getHeader = () => 'Valitse koulutustyyppi';

  handleCheckboxChange = (event) => broadcast(APP_EVENT_SELECT_KOULUTUSTYYPPI, event.target.value);

  isOptionChecked = (option) => option.value === this.state.activeKoulutustyyppi;

  onClearButtonClick = () => broadcast(APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION);

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
