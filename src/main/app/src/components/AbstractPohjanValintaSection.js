import React from 'react';

import {SelectorButton} from './SelectorButton';
import {InfoDropdown} from './InfoDropdown';
import {broadcast, connectComponent} from '../utils/stateUtils';
import {ENTITY_MODIFICATION_MODE} from '../config/constants';
import {AbstractSection} from './AbstractSection';

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

  getClassName = () => {
    throw new Error('AbstractPohjanValintaSection:getClassName(): implement in subclass!');
  };

  getHeader = () => {
    throw new Error('AbstractPohjanValintaSection:getHeader(): implement in subclass!');
  };

  getCreateEntityInfoText = () => {
    throw new Error('AbstractPohjanValintaSection:getCreateEntityInfoText(): implement in subclass!');
  };

  getStateNameForEntryOptions = () => {
    throw new Error('AbstractPohjanValintaSection:getStateNameForEntryOptions(): implement in subclass!');
  };

  getStateNameForMode = () => {
    throw new Error('AbstractPohjanValintaSection:getStateNameForMode(): implement in subclass!');
  };

  getStateNameForModeOptions = () => {
    throw new Error('AbstractPohjanValintaSection:getStateNameForModeOptions(): implement in subclass!');
  };

  getStateNameForEntry = () => {
    throw new Error('AbstractPohjanValintaSection:getStateNameForEntry(): implement in subclass!');
  };

  getEventNameForEntry = () => {
    throw new Error('AbstractPohjanValintaSection:getEventNameForEntry(): implement in subclass!');
  };

  getEventNameForMode = () => {
    throw new Error('AbstractPohjanValintaSection:getEventNameForMode(): implement in subclass!');
  };

  getEntryOptions = () => this.state.entryOptions || [];

  getEntry = () => this.state.entry;

  getModeOptions = () => this.state.modeOptions || [];

  getMode = () => this.state.mode;

  handleDropdownChange = (value) => broadcast(this.getEventNameForEntry(), value);

  selectMode = (mode) => broadcast(this.getEventNameForMode(), mode);

  renderMode = () => ({
    [ENTITY_MODIFICATION_MODE.CREATE_ENTITY]: () => <span
      className={'info-span'}>{this.getCreateEntityInfoText()}</span>,
    [ENTITY_MODIFICATION_MODE.INHERIT_ENTITY]: () => this.renderInfoDropdown(),
    [ENTITY_MODIFICATION_MODE.USE_ENTITY]: () => this.renderInfoDropdown()
  }[this.getMode()]());

  renderInfoDropdown = () => (
    <InfoDropdown label={'Valitse listasta'} selection={this.getEntry()} onChange={this.handleDropdownChange}
                  options={this.getEntryOptions()}/>
  );

  renderContent = () => {
    return (<div className={'content'}>
      <SelectorButton layerAlign={'left'} label={'Valitse pohja'} onSelect={this.selectMode}
                      options={this.getModeOptions()}/>
      {this.renderMode()}
    </div>);
  };
}
