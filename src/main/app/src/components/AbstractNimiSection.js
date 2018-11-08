import React from 'react';
import {AbstractSection} from './AbstractSection';
import {broadcast, connectComponent} from '../utils/stateUtils';

export class AbstractNimiSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [this.getTranslationMapStateName()]: (translationMap) => this.setState({...this.state, translationMap})
  });

  getTranslationMapStateName = () => {
    throw new Error('AbstractNimiSection:getTranslationMapStateName(): implement in subclass!');
  };

  getSupportedLanguagesStateName = () => {
    throw new Error('AbstractNimiSection:getSupportedLanguagesStateName(): implement in subclass!');
  };

  getClearTranslationMapEventName = () => {
    throw new Error('AbstractNimiSection:getClearTranslationMapEventName(): implement in subclass!');
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

  onClearButtonClick = () => broadcast(this.getClearTranslationMapEventName());

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
