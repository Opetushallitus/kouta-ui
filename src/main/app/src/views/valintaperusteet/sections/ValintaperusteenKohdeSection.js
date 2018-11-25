import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_STATE_VALINTTAPERUSTEEN_KOHDE,
  selectOption
} from '../../../stores/valintaperusteet/ValintaperusteenKohdeStore';
import {connectComponent} from '../../../utils/stateUtils';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';

export class ValintaperusteenKohdeSection extends AbstractSection {

  getClassName = () => 'ValintaperusteenKohdeSection';

  getHeader = () => 'Kohde';

  getOptions = () => this.state.options || [];

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTTAPERUSTEEN_KOHDE]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  renderContent = () => (
    <div className={'content'}>
      <span className={'instruction-span'}>Valitse kohde</span>
      <RadiobuttonSelector options={this.getOptions()} onChange={selectOption}/>
    </div>
  );

}


