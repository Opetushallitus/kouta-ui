import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT,
  clearSelections,
  selectOption
} from '../../../stores/valintaperusteet/ValintaperusteenVahimmaisehdotStore';
import {CheckboxSelector} from '../../../components/CheckboxSelector';

export class ValintaperusteenVahimmaisehdotSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'ValintaperusteenVahimmaisehdotSection';

  getHeader = () => 'Valituksi tulemisen vähimmäisehdot';

  getOptions = () => this.state.options || [];

  onClearButtonClick = () => clearSelections();

  renderContent = () => (
    <div className={'content'}>
      <span className={'instruction-span'}>Hakija on hakukelpoinen jos hän</span>
      <CheckboxSelector options={this.getOptions()} onChange={selectOption}/>
    </div>
  );
}
