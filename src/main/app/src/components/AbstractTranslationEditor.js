import React, {Component} from 'react';
import {broadcast, connectListener} from '../utils/stateUtils';
import {APP_EVENT_KOULUTUS_NAME_EDITED_TRANSLATION_MAP} from '../config/states';
import {LANGUAGE_CODE_TO_LANGUAGE_NAME} from '../config/constants';

export class AbstractTranslationEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onMount = () => connectListener(this, this.getInputsStateName(), (translationMap) =>
      this.setState({...this.state, translationMap}));

  getInputsStateName = () => {
    throw new Error('AbstractTranslationEditor:getInputsStateName(): implement in subclass!');
  }

  getInputChangeEventName = () => {
    throw new Error('AbstractTranslationEditor:getInputChangeEventName(): implement in subclass!');
  }

  getLabel = () => {
    throw new Error('AbstractTranslationEditor:getLabel(): implement in subclass!');
  }

  getTranslationMap = () => this.state.translationMap || {};

  getTranslation = (languageCode) => {
    const translation = this.getTranslationMap()[languageCode];
    return translation;
  }

  updateTranslation = (event) => {
    const target = event.target;
    const value = target.value;
    const key = target.getAttribute('id');
    const translationMap = {...this.getTranslationMap()};
    translationMap[key] = value;
    broadcast(APP_EVENT_KOULUTUS_NAME_EDITED_TRANSLATION_MAP, translationMap);
    this.setState({...this.state, translationMap});
  }

  renderLanguageInput = (languageCode) => (
      <div key={languageCode} className={"input-field"}>
        <span className={"translation-instruction"}>{LANGUAGE_CODE_TO_LANGUAGE_NAME[languageCode]}</span>
        <input type={"text"} key={languageCode}
               id={languageCode}
               placeholder={LANGUAGE_CODE_TO_LANGUAGE_NAME[languageCode]}
               onChange={this.updateTranslation} value={this.getTranslation(languageCode)}/>
      </div>
  );

  renderInputs = () => Object.keys(this.getTranslationMap()).map(this.renderLanguageInput);

  render = () => (
      <div className={"translation-editor"}>
        <span>{this.getLabel()}</span>
        {this.renderInputs()}
      </div>
  )
}
