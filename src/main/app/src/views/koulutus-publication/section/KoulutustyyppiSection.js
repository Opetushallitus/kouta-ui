import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_ACTIVE_KOULUTUSTYYPPI, APP_STATE_KOULUTUSTYYPPI_OPTIONS} from '../../../config/states';
import {connectToOne} from '../../../utils/stateUtils';
import {isVariableDefined} from '../../../utils/objectUtils';
import {setKoulutustyyppi} from '../../../stores/KoulutustyyppiStore';

export class KoulutustyyppiSection extends AbstractSection {

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUSTYYPPI_OPTIONS, this, (koulutustyyppiOptions) => this.setState({...this.state, koulutustyyppiOptions}));
    connectToOne(APP_STATE_ACTIVE_KOULUTUSTYYPPI, this, (activeKoulutustyyppi) => this.setState({...this.state, activeKoulutustyyppi}));
  }

  getClassName = () => 'KoulutustyyppiSection';

  getHeader = () => '2 Valitse koulutustyyppi';

  handleCheckboxChange = (event) => {
    const value = event.target.value;
    console.log('KoulutustyyppiSectionhandleCheckboxChange:value', value);
    setKoulutustyyppi(event.target.value);
  }

  isValid = () => isVariableDefined(this.state.activeKoulutustyyppi);

  isOptionChecked = (option) => option.value === this.state.activeKoulutustyyppi;

  onClearButtonClick = () => setKoulutustyyppi(null);

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