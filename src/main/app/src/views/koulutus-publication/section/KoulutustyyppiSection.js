import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_KOULUTUSTYYPPI} from '../../../config/states';
import {connectToOne} from '../../../utils/stateUtils';
import {isVariableDefined} from '../../../utils/objectUtils';
import {activeKoulutustyyppi, koulutustyyppiOptions} from '../../../model/Koulutustyyppi';
import {setKoulutustyyppi} from '../../../stores/KoulutustyyppiStore';

export class KoulutustyyppiSection extends AbstractSection {

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUSTYYPPI, this, (state) => this.setState(state));
  }

  getClassName = () => 'KoulutustyyppiSection';

  getHeader = () => '2 Valitse koulutustyyppi';

  handleCheckboxChange = (event) => setKoulutustyyppi(event.target.value);

  isValid = () => isVariableDefined(this.state[activeKoulutustyyppi]);

  isOptionChecked = (option) => option.value === this.state[activeKoulutustyyppi];

  onClearButtonClick = () => setKoulutustyyppi(null);

  renderKoulutustyyppiOption = (koulutustyyppiOption, index) => (
    <li key={index}>
      <input type="radio" name="koulutustyyppi" value={koulutustyyppiOption.value} checked={this.isOptionChecked(koulutustyyppiOption)}
             onChange={this.handleCheckboxChange} />{koulutustyyppiOption.label}
    </li>
  )

  renderKoulutustyyppiList = () => this.state.koulutustyyppiOptions ? (
    <ul className={"koulutustyyppi-list"}>
      {this.state[koulutustyyppiOptions].map(this.renderKoulutustyyppiOption)}
    </ul>
  ) : null;

  renderContent = () => (
    <div className={"content"}>
      {this.renderKoulutustyyppiList()}
    </div>
  );

}