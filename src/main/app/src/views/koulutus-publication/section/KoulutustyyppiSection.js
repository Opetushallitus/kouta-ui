import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {selectKoulutustyyppi} from '../../../stores/KoulutusListStore';
import {APP_STATE_KOULUTUSTYYPPI} from '../../../config/states';
import {connect} from '../../../utils/utils';

export class KoulutustyyppiSection extends AbstractSection {

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connect(APP_STATE_KOULUTUSTYYPPI, {}, (state) => this.setState(state));
  }

  handleCheckboxChange = (event) => {
    const value = event.target.value;
    selectKoulutustyyppi(value);
    this.setSectionDone();
  }

  getHeader = () => "2 Valitse koulutustyyppi";

  isOptionChecked = (option) => option.value === this.state.activeKoulutustyyppi;

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