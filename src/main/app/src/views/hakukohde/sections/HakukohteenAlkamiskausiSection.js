import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI,
    clearSelections,
    selectLukukausi,
    selectLukuvuosi
} from '../../../stores/hakukohde/HakukohteenAlkamiskausiStore';
import {RadiobuttonSelector} from "../../../components/RadiobuttonSelector";
import {DropdownSelector} from "../../../components/DropdownSelector";

export class HakukohteenAlkamiskausiSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenAlkamiskausiSection';

  getHeader = () => 'Koulutuksen alkamiskausi';

  getLukukausiOptions = () => this.state.lukukausiOptions || [];

  getLukuvuosiOptions = () => this.state.lukuvuosiOptions || [];

  onClearButtonClick = () => clearSelections();

  renderContent = () => (
      <div className={'content'}>
          <RadiobuttonSelector options={this.getLukukausiOptions()} onChange={selectLukukausi}/>
          <DropdownSelector options={this.getLukuvuosiOptions()} onChange={selectLukuvuosi}/>
      </div>
  );

}
