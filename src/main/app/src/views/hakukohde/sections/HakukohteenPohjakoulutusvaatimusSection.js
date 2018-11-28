import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS,
  clearSelections,
  selectPohjakoulutusvaatimus,
  updateMuuValinta
} from '../../../stores/hakukohde/HakukohteenPohjakoulutusvaatimusStore';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';

export class HakukohteenPohjakoulutusvaatimusSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenPohjakoulutusvaatimusSection';

  getHeader = () => 'Pohjakoulutusvaatimus';

  getOptions = () => this.state.options || [];

  onClearButtonClick = () => clearSelections();

  renderContent = () => (
    <div className={'content'}>
        <span className={'instruction-span'}>Valitse pohjakoulutus</span>
        <RadiobuttonSelector options={this.getOptions()}  onChange={selectPohjakoulutusvaatimus} onInput={updateMuuValinta}/>
    </div>
  )

}

