import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT,
  clearSelections,
  setAloituspaikkojenLukumaara
} from '../../../stores/hakukohde/HakukohteenAloituspaikatStore';

export class HakukohteenAloituspaikatSection extends AbstractSection {

    onMount = () => connectComponent(this, {
      [APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT]: (incomingState) => this.setState({
        ...this.state,
        ...incomingState
      })
    });

    getClassName = () => 'HakukohteenAloituspaikatSection';

    getHeader = () => 'Aloituspaikat';

    getAloituspaikkojenLukumaara = () => this.state.aloituspaikkojenLukumaara || '';

    setAloituspaikkojenLukumaara = (event) => setAloituspaikkojenLukumaara(event.target.value);

    onClearButtonClick = () => clearSelections();

    renderContent = () => (
      <div className={'content'}>
        <span className={'instruction-span'}>Anna aloituspaikkojen lukumäärä</span>
        <input type={'text'} value={this.getAloituspaikkojenLukumaara()} placeholder={'Lukumäärä'}
          onChange={this.setAloituspaikkojenLukumaara}/>
      </div>
    );

}
