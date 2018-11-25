import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_VALINTAPERUSTEEN_HAKUTAPA,
  selectOption
} from '../../../stores/valintaperusteet/ValintaperusteenHakutapaStore';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';

export class ValintaperusteenHakutapaSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_HAKUTAPA]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'ValintaperusteenHakutapaSection';

  getHeader = () => 'Hakutavan rajaus';

  getOptions = () => this.state.options || [];

  renderContent = () => (
    <div className={'content'}>
      <span className={'instruction-span'}>Valitse hakutapa</span>
      <RadiobuttonSelector options={this.getOptions()} onChange={selectOption}/>
    </div>
  );

}
