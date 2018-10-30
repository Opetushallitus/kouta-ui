import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';
import {connectListener} from '../../../utils/stateUtils';

export class KoulutuksenKuvausSection extends AbstractSection {

  getClassName = () => 'KoulutuksenKuvausSection';

  getHeader = () => 'Koulutuksen kuvaus';

  onMount = () => connectListener(this, APP_STATE_KOULUTUS_DETAILS, (state) => this.setState({
    kuvaus: state.kuvaus,
    enabled: state.enabled
  }));

  isClearButtonVisible = () => false;

  isEnabled = () => this.state.enabled === true;

  containsKuvaus = () => this.state.kuvaus !== null;

  renderWarning = (warningMessage) => (
      <div className={"content"}>
        <span className={"kuvaus-warning-span"}>{warningMessage}</span>
      </div>
  )

  renderKuvaus = () => this.containsKuvaus() ? (
      <div className={"content"} dangerouslySetInnerHTML={{__html: this.state.kuvaus}}/>
  ) : this.renderWarning('Koulutukselle ei ole määritelty kuvausta.');

  renderContent = () => this.isEnabled() ? this.renderKuvaus() : this.renderWarning('Valitse ensin koulutus.');

}
