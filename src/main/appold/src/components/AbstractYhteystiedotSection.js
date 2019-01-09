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
  };

  getStateNameForSupportedLanguages = () => {
    throw new Error('AbstractYhteystiedotSection:getStateNameForSupportedLanguages: implement in subclass');
  };

  getClassName = () =>  {
    throw new Error('AbstractYhteystiedotSection:getClassName: implement in subclass');
  };

  getHeader = () => {
    throw new Error('AbstractYhteystiedotSection:getHeader: implement in subclass');
  };

  onClearButtonClick = () => {
    throw new Error('AbstractYhteystiedotSection:onSubmitButtonClick: implement in subclass');
  };

  onSubmitButtonClick = () => {
    throw new Error('AbstractYhteystiedotSection:onSubmitButtonClick: implement in subclass');
  };

  notifyValuesUpdated = () => {
    throw new Error('AbstractYhteystiedotSection:notifyValuesUpdated: implement in subclass');
  };

  getValueMap = () => this.state.valueMap || {};

  getFields = () => this.state.fields || [];

  getFieldIds = () => Object.keys(this.getValueMap());

  getFieldLanguageMap = (fieldId) => this.getValueMap()[fieldId];

  getFieldValueInActiveLanguage = (fieldId) => this.getFieldLanguageMap(fieldId)[this.getActiveLanguage()];

  getDataFields = () => this.getFields().map(field => ({
    ...field,
    value: this.getFieldValueInActiveLanguage(field.id)
  }));

  updateValues = (valueMap) => {
      this.setState({...this.state, valueMap});
      this.notifyValuesUpdated();
  };

  updateEntry = (field) => {
    var valueMap = {...this.getValueMap()};
    valueMap[field.id][this.getActiveLanguage()] = field.value;
    this.shallCloneValues() && this.cloneFieldValueToAllLanguages(valueMap, field.id);
    this.updateValues(valueMap);
  };

  renderField = (field) => <InputField key={field.id} id={field.id} label={field.label} onChange={this.updateEntry} value={this.getFieldValueInActiveLanguage(field.id)}/>;

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
    this.updateValues(valueMap);
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
