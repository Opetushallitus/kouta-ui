import React from 'react';
import {AbstractSection} from './AbstractSection';
import {broadcast, connectComponent} from '../utils/stateUtils';

export class AbstractNimiSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [this.getStateNameForTranslationMap()]: (translationMap) => this.setState({...this.state, translationMap})
  });

  getStateNameForTranslationMap = () => {
    throw new Error('AbstractNimiSection:getStateNameForTranslationMap(): implement in subclass!');
  };

  getStateNameForSupportedLanguages = () => {
    throw new Error('AbstractNimiSection:getStateNameForSupportedLanguages(): implement in subclass!');
  };

  getEventNameForClearTranslationMap = () => {
    throw new Error('AbstractNimiSection:getEventNameForClearTranslationMap(): implement in subclass!');
  }

  getHeader = () => {
    throw new Error('AbstractNimiSection:getHeader(): implement in subclass!');
  };

  getPromptText = () => {
    throw new Error('AbstractNimiSection:getPromptText(): implement in subclass!');
  };

  getErrorInstruction = () => {
    throw new Error('AbstractNimiSection:getErrorInstruction(): implement in subclass!');
  }

  getCssClassName = () => 'nimi-section';

  getTranslationMap = () => ({...this.state.translationMap});

  getTranslation = () => this.getTranslationMap()[this.getActiveTabId()] || '';

  onClearButtonClick = () => broadcast(this.getEventNameForClearTranslationMap());

  updateTranslation = (event) => {
    const value = event.target.value;
    const translationMap = this.getTranslationMap();
    translationMap[this.getActiveTabId()] = value;
    this.setState({...this.state, translationMap});
  };

  isEnabled = () => true;

  renderContent = () => this.isEnabled() ? (
    <div className={"content"}>
      <span className={"label"}>{this.getPromptText()}</span>
      <input type={"text"} className={"translation-input"} value={this.getTranslation()}
             placeholder={this.getPromptText()}
             onChange={this.updateTranslation}></input>
      <span className={"info-span"}>Huom! Tämä teksti näkyy oppijalle Opintopolun sivuilla.</span>
    </div>
  ) : (
    <div className={"content"}>
      <span>{this.getErrorInstruction()}</span>
    </div>
  )

}
