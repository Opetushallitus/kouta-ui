import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {InfoDropdown} from '../../../components/InfoDropdown';
import {broadcast, connectComponent} from '../../../utils/stateUtils';
import {
  APP_EVENT_KOULUTUS_MODIFICATION_MODE,
  APP_STATE_KOULUTUS_MODIFICATION_MODE,
  APP_STATE_KOULUTUS_OPTIONS
} from '../../../config/states';
import {ENTITY_MODIFICATION_MODE} from '../../../config/constants';

export class KoulutuksenPohjanValintaSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUS_OPTIONS]: (options) => this.setState({
      ...this.state,
      dropdownOptions: options
    }),
    [APP_STATE_KOULUTUS_MODIFICATION_MODE]: (incomingState) =>
      this.setState({
        ...this.state,
        creationMode: incomingState.creationMode
      })
  });

  getClassName = () => 'KoulutuksenPohjanValintaSection';

  getHeader = () => 'Luo koulutus';

  getDropdownOptions = () => this.state.dropdownOptions || [];

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => {
        broadcast(APP_EVENT_KOULUTUS_MODIFICATION_MODE, ENTITY_MODIFICATION_MODE.CREATE_ENTITY);
        this.setSectionDone();
      }
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja',
      action: () => broadcast(APP_EVENT_KOULUTUS_MODIFICATION_MODE, ENTITY_MODIFICATION_MODE.INHERIT_ENTITY)
    }
  ];

  handleDropdownChange = (event) => console.log(event.target.value);

  renderInfoDropdown = () => this.state.creationMode === ENTITY_MODIFICATION_MODE.INHERIT_ENTITY ? (
    <InfoDropdown label={'Valitse listasta'} onChange={this.handleDropdownChange}
                  options={this.getDropdownOptions()}/>
  ) : null;

  renderContent = () => (
    <div className={'content'}>
      <SelectorButton layerAlign={'left'} label={'Valitse pohja'} options={this.getSelectorButtonOptions()}/>
      {this.renderInfoDropdown()}
    </div>
  );

}


