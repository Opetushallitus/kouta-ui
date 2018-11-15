import React from 'react';

import {SelectorButton} from './SelectorButton';
import {InfoDropdown} from './InfoDropdown';
import {broadcast, connectComponent} from '../utils/stateUtils';
import {ENTITY_MODIFICATION_MODE} from '../config/constants';
import {AbstractSection} from './AbstractSection';
import {
  EVENT_ENTRY, EVENT_MODE, STATE_ENTRY, STATE_ENTRY_OPTIONS, STATE_MODE,
  STATE_MODE_OPTIONS
} from '../config/scopes/PohjanValinta';

export class AbstractPohjanValintaSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [this.getStateNameForEntryOptions()]: (entryOptions) => this.setState({
      ...this.state,
      entryOptions
    }),
    [this.getStateNameForMode()]: (mode) => this.setState({...this.state, mode}),
    [this.getStateNameForModeOptions()]: (modeOptions) => this.setState({...this.state, modeOptions}),
    [this.getStateNameForEntry()]: (entry) => this.setState({...this.state, entry})
  });

  getCssClassName = () => 'pohjan-valinta-section';

  getScope = () => {
    throw new Error('AbstractPohjanValintaSection:getScope(): implement in subclass!');
  };

  getClassName = () => {
    throw new Error('AbstractPohjanValintaSection:getClassName(): implement in subclass!');
  };

  getHeader = () => {
    throw new Error('AbstractPohjanValintaSection:getHeader(): implement in subclass!');
  };

  getStateNameForEntryOptions = () => this.getScope()[STATE_ENTRY_OPTIONS];

  getStateNameForMode = () => this.getScope()[STATE_MODE];

  getStateNameForModeOptions = () => this.getScope()[STATE_MODE_OPTIONS];

  getStateNameForEntry = () => this.getScope()[STATE_ENTRY];

  getEventNameForEntry = () => this.getScope()[EVENT_ENTRY];

  getEventNameForMode = () => this.getScope()[EVENT_MODE];

  getEntryOptions = () => this.state.entryOptions || [];

  getEntry = () => this.state.entry;

  getModeOptions = () => this.state.modeOptions || [];

  getMode = () => this.state.mode;

  handleDropdownChange = (value) => broadcast(this.getEventNameForEntry(), value);

  selectMode = (mode) => broadcast(this.getEventNameForMode(), mode);

  renderMode = () => (this.getMode() ? {
    [ENTITY_MODIFICATION_MODE.CREATE_ENTITY]: () => <div/>,
    [ENTITY_MODIFICATION_MODE.INHERIT_ENTITY]: () => this.renderInfoDropdown(),
    [ENTITY_MODIFICATION_MODE.USE_ENTITY]: () => this.renderInfoDropdown()
  }[this.getMode()]() : <div/>);

  renderInfoDropdown = () => (
    <InfoDropdown label={'Valitse listasta'} selection={this.getEntry()} onChange={this.handleDropdownChange}
                  options={this.getEntryOptions()}/>
  );

  getButtonText = () => {
    const mode = this.getMode();
    const option = this.getModeOptions().find((option) => option.value === mode);
    return option ? option.label : 'Valitse pohja';
  };

  renderContent = () => {
    return (
      <div className={'content'}>
      <SelectorButton layerAlign={'left'} label={this.getButtonText()} onSelect={this.selectMode}
                      options={this.getModeOptions()}/>
      {this.renderMode()}
        </div>);
  };
}
