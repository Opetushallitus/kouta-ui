import React from 'react';
import {APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../config/states';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_HAKUKOHTEEN_PERUSTIEDOT,
  setKaksoistutkintoActive,
  updateNimi,
  clearSelections
} from '../../../stores/hakukohde/HakukohteenPerustiedotStore';

export class HakukohteenPerustiedotSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_PERUSTIEDOT]: (hakukohteenPerustiedot) => this.setState({
      ...this.state,
      ...hakukohteenPerustiedot
    })
  });

  getClassName = () => 'HakukohteenPerustiedotSection';

  getHeader = () => 'Hakukohteen perustiedot';

  getPromptText = () => 'Anna hakukohteelle nimi';

  getNimi = () => ({...this.state.nimi});

  getLocalizedNimi = () => this.getNimi()[this.getActiveTabId()] || '';

  onClearButtonClick = () => clearSelections();

  getStateNameForSupportedLanguages = () => APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  isKaksoistutkintoActive = () => this.state.kaksoistutkintoActive;

  updateTranslation = (event) => {
    const value = event.target.value;
    updateNimi(this.getActiveLanguage(), value);
  };

  toggleKaksoistutkintoActive = (event) => setKaksoistutkintoActive(event.target.checked);

  renderContent = () => (
    <div className={'content'}>
      <span className={'instruction-span'}>{this.getPromptText()}</span>
      <input type={'text'} className={'translation-input'} value={this.getLocalizedNimi()}
             placeholder={this.getPromptText()}
             onChange={this.updateTranslation}></input>
      <div className={'row'}>
        <input type="checkbox" checked={this.isKaksoistutkintoActive()}
               onChange={this.toggleKaksoistutkintoActive}/> Voi suorittaa kaksoistutkinnon
      </div>
    </div>
  );

}
