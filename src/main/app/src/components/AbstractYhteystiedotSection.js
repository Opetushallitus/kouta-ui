import React from 'react';
import {InputField} from './InputField';
import {AbstractSection} from './AbstractSection';
import {connectListener} from '../utils/stateUtils';

export class AbstractYhteystiedotSection extends AbstractSection {

  onMount = () => connectListener(this, this.getStateNameForYhteystiedot(), (yhteystiedot) => this.setState({
    ...this.state,
    ...yhteystiedot
  }));

  getStateNameForYhteystiedot = () => {
    throw new Error('AbstractYhteystiedotSection:getStateNameForYhteystiedot: implement in subclass');
  }

  getStateNameForSupportedLanguages = () => {
    throw new Error('AbstractYhteystiedotSection:getStateNameForSupportedLanguages: implement in subclass');
  }

  getClassName = () =>  {
    throw new Error('AbstractYhteystiedotSection:getClassName: implement in subclass');
  }

  getHeader = () => {
    throw new Error('AbstractYhteystiedotSection:getHeader: implement in subclass');
  }

  onClearButtonClick = () => {
    throw new Error('AbstractYhteystiedotSection:onSubmitButtonClick: implement in subclass');
  }

  onSubmitButtonClick = () => {
    throw new Error('AbstractYhteystiedotSection:onSubmitButtonClick: implement in subclass');
  }

  getValueMap = () => this.state.valueMap || {};

  getFields = () => this.state.fields || [];

  getFieldIds = () => Object.keys(this.getValueMap());

  getFieldLanguageMap = (fieldId) => this.getValueMap()[fieldId];

  getFieldValueInActiveLanguage = (fieldId) => this.getFieldLanguageMap(fieldId)[this.getActiveLanguage()];

  getDataFields = () => this.getFields().map(field => ({
    ...field,
    value: this.getFieldValueInActiveLanguage(field.id)
  }));

  updateEntry = (field) => {
    const language = this.getActiveLanguage();
    const fieldId = field.id;
    const value = field.value;
    const valueMap = {...this.getValueMap()};
    valueMap[fieldId][language] = value;
    this.shallCloneValues() && this.cloneFieldValueToAllLanguages(valueMap, fieldId);
    this.setState({...this.state, valueMap});
  };

  renderField = (field) => <InputField key={field.id} field={field} onChange={this.updateEntry}/>;

  renderFields = () => this.getDataFields().map(this.renderField);

  shallCloneValues = () => this.state.cloneValues === true;

  cloneFieldValueToAllLanguages = (valueMap, fieldId) => {
    this.getSupportedLanguages().forEach(language => {
      valueMap[fieldId][language] = valueMap[fieldId][this.getActiveLanguage()];
    });
    return valueMap;
  };

  cloneValuesToOtherLanguages = () => {
    const valueMap = this.getFieldIds().reduce(this.cloneFieldValueToAllLanguages, {...this.getValueMap()});
    this.setState({...this.state, valueMap});
  };

  toggleCloneOption = (event) => {
    const checked = event.target.checked;
    this.setState({
      ...this.state,
      cloneValues: checked
    }, () => checked && this.cloneValuesToOtherLanguages());
  };

  renderContent = () => (
    <div className={'content'}>
      {this.renderFields()}
      <div className={'row'}>
      <input type="checkbox" onChange={this.toggleCloneOption} checked={this.shallCloneValues()}/>
        Käytä samoja yhteystietoja kaikissa kieliversioissa
      </div>
    </div>
  );

}
