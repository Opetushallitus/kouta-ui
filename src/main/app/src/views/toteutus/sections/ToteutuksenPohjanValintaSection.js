import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_EVENT_TOTEUTUS_MODIFICATION_MODE,
  APP_STATE_TOTEUTUS_MODIFICATION_MODE,
  APP_STATE_TOTEUTUS_OPTIONS
} from '../../../config/states';
import {broadcast, connectToOne} from '../../../utils/stateUtils';
import {ENTITY_MODIFICATION_MODE} from '../../../config/constants';
import {InfoDropdown} from '../../../components/InfoDropdown';
import {SelectorButton} from '../../../components/SelectorButton';

export class ToteutuksenPohjanValintaSection extends AbstractSection {

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_TOTEUTUS_OPTIONS, this, (options) => this.setState({
      ...this.state,
      dropdownOptions: options
    }));
    connectToOne(APP_STATE_TOTEUTUS_MODIFICATION_MODE, this, (incomingState) =>
      this.setState({
        ...this.state,
        creationMode: incomingState.modificationMode
      }));
  };

  getClassName = () => 'ToteutuksenPohjanValintaSection';

  getHeader = () => 'Pohjan valinta';

  getDropdownOptions = () => this.state.dropdownOptions || [];

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi toteutus',
      action: () => {
        broadcast(APP_EVENT_TOTEUTUS_MODIFICATION_MODE, ENTITY_MODIFICATION_MODE.CREATE_ENTITY);
        this.setSectionDone();
      }
    },
    {
      text: 'Kopioi pohjaksi aiemmin luotu toteutus',
      action: () => broadcast(APP_EVENT_TOTEUTUS_MODIFICATION_MODE, ENTITY_MODIFICATION_MODE.INHERIT_ENTITY)
    },
    {
      text: 'Käytä olemassa olevan toteutuksen tietoja',
      action: () => broadcast(APP_EVENT_TOTEUTUS_MODIFICATION_MODE, ENTITY_MODIFICATION_MODE.EDIT_ENTITY)
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
