import React from 'react';
import {connectListener} from '../../../utils/stateUtils';
import {AbstractSection} from '../../../components/AbstractSection';
import {InputField} from '../../../components/InputField';
import {APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, clearValues, storeValues} from '../../../stores/toteutus/ToteutuksenYhteystiedotStore';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../stores/toteutus/ToteutuksenKieliversioStore';

export class ToteutuksenYhteystiedotSection extends AbstractSection {

  onMount = () => connectListener(this, APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, (fieldMap) => this.setState({
    ...this.state, fieldMap
  }));

  getSupportedLanguagesStateName = () => APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClassName = () => 'ToteutuksenYhteystiedotSection';

  getHeader = () => 'Koulutuksen yhteystiedot';

  getFields = () => [
    {
      id: 'nimi',
      label: 'Nimi'
    },
    {
      id: 'titteli',
      label: 'Titteli?'
    },
    {
      id: 'sahkoposti',
      label: 'Sähköposti'
    },
    {
      id: 'puhelinnumero',
      label: 'Puhelinnumero'
    }
  ];

  getFieldMap = () => this.state.fieldMap || {};

  getFieldIds = () => Object.keys(this.getFieldMap());

  getFieldLanguageMap = (fieldId) => this.getFieldMap()[fieldId];

  getFieldValueInActiveLanguage = (fieldId) => this.getFieldLanguageMap(fieldId)[this.getActiveLanguage()];

  getDataFields = () => this.getFields().map(field => ({
    ...field,
    value: this.getFieldValueInActiveLanguage(field.id)
  }));

  updateEntry = (field) => {
    const language = this.getActiveLanguage();
    const fieldId = field.id;
    const value = field.value;
    const fieldMap = {...this.getFieldMap()};
    fieldMap[fieldId][language] = value;
    this.shallCloneValues() && this.cloneFieldValueToAllLanguages(fieldMap, fieldId);
    this.setState({...this.state, fieldMap});
  };

  renderField = (field) => <InputField key={field.id} field={field} onChange={this.updateEntry}/>;

  renderFields = () => this.getDataFields().map(this.renderField);

  onClearButtonClick = () => clearValues();

  onSubmitButtonClick = () => {
    storeValues(this.state);
    this.setSectionDone();
  };

  shallCloneValues = () => this.state.cloneValues === true;

  cloneFieldValueToAllLanguages = (fieldMap, fieldId) => {
    this.getSupportedLanguages().forEach(language => {
      fieldMap[fieldId][language] = fieldMap[fieldId][this.getActiveLanguage()];
    });
    return fieldMap;
  };

  cloneValuesToOtherLanguages = () => {
    const fieldMap = this.getFieldIds().reduce(this.cloneFieldValueToAllLanguages, {...this.getFieldMap()});
    this.setState({...this.state, fieldMap});
  };

  toggleCloneOption = (event) => {
    const checked = event.target.checked;
    this.setState({...this.state, cloneValues: checked}, () => checked && this.cloneValuesToOtherLanguages());
  };

  renderContent = () => (
    <div className={'content'}>
      {this.renderFields()}
      <input type="checkbox" onChange={this.toggleCloneOption} checked={this.shallCloneValues()}/> Käytä samoja
      yhteystietoja kaikissa kieliversioissa
    </div>
  );

}
