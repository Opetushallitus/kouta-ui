import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';
import {connectToOne} from '../../../utils/stateUtils';

export class KoulutuksenKuvausSection extends AbstractSection {

  getClassName = () => 'KoulutuksenKuvausSection';

  getHeader = () => '4 Koulutuksen kuvaus';

  isValid = () => true;

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState({
      kuvaus: state.kuvaus,
      active: state.active
    }));
  }

  isClearButtonVisible = () => false;

  isActive = () => this.state.active === true;

  containsKuvaus = () => this.state.kuvaus !== null;

  renderWarning = (warningMessage) => (
      <div className={"content"}>
        <span className={"kuvaus-warning-span"}>{warningMessage}</span>
      </div>
  )

  renderKuvaus = () => this.containsKuvaus() ? (
      <div className={"content"} dangerouslySetInnerHTML={{__html: this.state.kuvaus}}/>
  ) : this.renderWarning('Koulutukselle ei ole määritelty kuvausta.');

  renderContent = () => this.isActive() ? this.renderKuvaus() : this.renderWarning('Valitse ensin koulutus.');

}
