import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA,
  selectOption,
  clearSelections
} from '../../../stores/valintaperusteet/ValintaperusteenOsaamistaustaStore';
import {CheckboxSelector} from '../../../components/CheckboxSelector';

export class ValintaperusteenOsaamistaustaSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'ValintaperusteenOsaamistaustaSection';

  getHeader = () => 'Osaamistausta';

  getOptions = () => this.state.options || [];

  onClearButtonClick = () => clearSelections();

  renderContent = () => (
    <div className={'content'}>
      <span className={'instruction-span'}>Valitse mikä osaamistausta hakijalla pitää olla</span>
      <CheckboxSelector options={this.getOptions()} onChange={selectOption}/>
    </div>
  );

}
