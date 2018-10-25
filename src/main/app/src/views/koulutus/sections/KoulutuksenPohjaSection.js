import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {InfoDropdown} from '../../../components/InfoDropdown';
import {broadcast, connectToOne} from '../../../utils/stateUtils';
import {
  APP_EVENT_KOULUTUS_CREATION_MODE,
  APP_STATE_KOULUTUS_CREATION_MODE,
  APP_STATE_KOULUTUS_OPTIONS
} from '../../../config/states';
import {EVENT_KOULUTUS_CREATION_MODE} from '../../../config/constants';

export class KoulutuksenPohjaSection extends AbstractSection {

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUS_OPTIONS, this, (options) => this.setState({
      ...this.state,
      dropdownOptions: options
    }));
    connectToOne(APP_STATE_KOULUTUS_CREATION_MODE, this, (incomingState) =>
      this.setState({
        ...this.state,
        creationMode: incomingState.creationMode}));
  };

  getClassName = () => 'KoulutuksenPohjaSection';

  getHeader = () => 'Luo koulutus';

  getDropdownOptions = () => this.state.dropdownOptions || [];

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => {
        broadcast(APP_EVENT_KOULUTUS_CREATION_MODE, EVENT_KOULUTUS_CREATION_MODE.NEW_KOULUTUS);
        this.setSectionDone();
      }
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja',
      action: () => broadcast(APP_EVENT_KOULUTUS_CREATION_MODE, EVENT_KOULUTUS_CREATION_MODE.TEMPLATE_KOULUTUS)
    }
  ];

  handleDropdownChange = (event) => console.log(event.target.value);

  renderInfoDropdown = () => this.state.creationMode === EVENT_KOULUTUS_CREATION_MODE.TEMPLATE_KOULUTUS ? (
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


