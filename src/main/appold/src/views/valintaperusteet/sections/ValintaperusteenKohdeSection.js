import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO,
  selectOption,
  clearSelections
} from '../../../stores/valintaperusteet/ValintaperusteenKohdejoukkoStore';
import {connectComponent} from '../../../utils/stateUtils';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';

export class ValintaperusteenKohdeSection extends AbstractSection {

  getClassName = () => 'ValintaperusteenKohdeSection';

  getHeader = () => 'Kohde';

  getOptions = () => this.state.options || [];

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  onClearButtonClick = () => clearSelections();

  renderContent = () => (
    <div className={'content'}>
      <span className={'instruction-span'}>Valitse kohde</span>
      <RadiobuttonSelector options={this.getOptions()} onChange={selectOption}/>
    </div>
  );

}


