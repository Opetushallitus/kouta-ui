import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {isVariableDefined} from '../../../utils/objectUtils';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from '../../../stores/koulutus/KoulutuksenTiedotStore';
import {APP_STATE_KOULUTUKSEN_KUVAUS} from '../../../stores/koulutus/KoulutuksenKuvausStore';
import {APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../stores/koulutus/KoulutuksenKieliversioStore';

export class KoulutuksenKuvausSection extends AbstractSection {

  getClassName = () => 'KoulutuksenKuvausSection';

  getHeader = () => 'Koulutuksen kuvaus';

  getStateNameForSupportedLanguages = () => APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  onMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUKSEN_TIEDOT]: (state) => this.setState({
      ...this.state,
      enabled: state.enabled
    }),
    [APP_STATE_KOULUTUKSEN_KUVAUS]: (kuvaus) => this.setState({
      ...this.state,
        kuvaus
    })
  });

  isClearButtonVisible = () => false;

  isEnabled = () => this.state.enabled === true;

  containsKuvaus = () => this.state.kuvaus && isVariableDefined(this.state.kuvaus[this.getActiveLanguage()]);

  renderWarning = (warningMessage) => (
      <div className={"content"}>
        <span className={"kuvaus-warning-span"}>{warningMessage}</span>
      </div>
  )

  renderKuvaus = () => this.containsKuvaus() ? (
      <div className={"content"} dangerouslySetInnerHTML={{__html: this.state.kuvaus[this.getActiveLanguage()]}}/>
  ) : this.renderWarning('Koulutukselle ei ole määritelty kuvausta.');

  renderContent = () => this.isEnabled() ? this.renderKuvaus() : this.renderWarning('Valitse ensin koulutus.');

}
