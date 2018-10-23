import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION,
  APP_EVENT_SELECT_KOULUTUSTYYPPI,
  APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY,
  APP_STATE_KOULUTUSTYYPPI_OPTIONS
} from '../../../config/states';
import {broadcast, connectToOne} from '../../../utils/stateUtils';

export class KoulutustyyppiSection extends AbstractSection {

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUSTYYPPI_OPTIONS, this, (koulutustyyppiOptions) => this.setState({...this.state, koulutustyyppiOptions}));
    connectToOne(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, this, (activeKoulutustyyppi) => this.setState({...this.state, activeKoulutustyyppi}));
  }

  getClassName = () => 'KoulutustyyppiSection';

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