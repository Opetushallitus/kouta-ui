import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {CheckboxSelector} from '../../../components/CheckboxSelector';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';
import {TextAreaField} from '../../../components/TextAreaField';
import {InfoHeader} from '../../../components/InfoHeader';
import {ActionLink} from '../../../components/ActionLink';
import {connectComponent} from '../../../utils/stateUtils';
import {
    addKieliValue,
    APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS,
    changeCheckboxSelection,
    changeRadioSelection,
    changeSelectionValue,
    getKieliValue
} from '../../../stores/toteutus/ToteutuksenJarjestamistiedotStore';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../stores/toteutus/ToteutuksenKieliversioStore';

export class ToteutuksenJarjestamistiedotSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS]: (options) => this.setState({
      ...this.state,
      ...options
    })
  });

  getClassName = () => 'ToteutuksenJarjestamistiedotSection';

  getHeader = () => 'Toteutuksen järjestämistiedot';

  getSupportedLanguagesStateName = () => APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getLisattavaOsioActiveOptions = () => this.state.lisattavaOsioOptions.filter(entry => entry.active);

  getRadioValue = (targetOptions) => (this.state[targetOptions].find(option => option.active) || {}).key

  changeLisattavaOsioSelection = (change) => changeCheckboxSelection('lisattavaOsioOptions', change);

  changeOpetuskieliSelection = (change) => changeCheckboxSelection('opetuskieliOptions', change);

  changeOpetusaikaSelection = (change) => changeRadioSelection('opetusaikaOptions', change);

  changeOpetustapaSelection = (change) => changeRadioSelection('opetustapaOptions', change);

  changeLisattavaOsioValue = (change) => changeSelectionValue('lisattavaOsioOptions', change);

  changeMaksullisuusSelection = (change) => changeRadioSelection('maksullisuusOptions', change);

  changeMaksunMaara = (event) => addKieliValue('maksunMaara', this.getActiveLanguage(), event.target.value);

  getMaksunMaara = () => getKieliValue('maksunMaara', this.getActiveLanguage());

  changeKuvaus = (event) => addKieliValue('kuvaus', this.getActiveLanguage(), event.target.value);

  getKuvaus = () => getKieliValue('kuvaus', this.getActiveLanguage());

  renderLisattavaOsioTextAreas = () => this.getLisattavaOsioActiveOptions().map(entry => (
    <TextAreaField onChange={this.changeLisattavaOsioValue} id={entry.key} key={entry.key} label={entry.label}
                   value={entry.value}/>
  ));

  renderMaksunMaaraInputField = () => (
      <div className={'input-field-container column'}>
          <div className={'row'}>
              <input type={'text'} placeholder={'Maksun määrä'} onChange={this.changeMaksunMaara} value={this.getMaksunMaara()}></input> euroa
          </div>
      </div>
  );

    addNewLanguage = (event) => {
  };

  isMaksullisuusSelected = () => this.getRadioValue('maksullisuusOptions') === 'kylla';

  optionallyRenderMaksullisuusMaksunMaara = () => this.isMaksullisuusSelected() && this.renderMaksunMaaraInputField();

  renderContent = () => (
      <div className={'content'}>
        <div className={'column'}>
          <InfoHeader label={'Opetuskieli'}/>
          <div className={'row'}>
            <CheckboxSelector options={this.state.opetuskieliOptions} onChange={this.changeOpetuskieliSelection}/>
          </div>

          <ActionLink label={'Lisää uusi kieli'} onClick={this.addNewLanguage}/>

          <InfoHeader label={'Opetusaika'}/>
          <RadiobuttonSelector options={this.state.opetusaikaOptions}
                               onChange={this.changeOpetusaikaSelection}/>
          <InfoHeader label={'Pääasiallinen opetustapa'}/>
          <RadiobuttonSelector options={this.state.opetustapaOptions}
                               onChange={this.changeOpetustapaSelection}/>
          <InfoHeader label={'Onko opetus maksullista?'}/>

          <div className={'option-controls-row'}>
            <RadiobuttonSelector options={this.state.maksullisuusOptions}
                                 onChange={this.changeMaksullisuusSelection}/>
            {this.optionallyRenderMaksullisuusMaksunMaara()}
          </div>

          <div className={'toteutuksen-kuvaus column'}>
            <InfoHeader label={'Toteutuksen kuvaus'}/>
            <textarea className={'toteutuksen-kuvaus-textarea'}
                      placeholder={'Kirjoita kuvaus miten koulutukssen toteutus järjestetään teidän oppilaitoksessanne'}
                      onChange={this.changeKuvaus}>{this.getKuvaus()}</textarea>
            <span className={'info-span'}>Huom! Tämä teksti näkyy oppijalle Opintopolun sivuilla</span>
          </div>

          <InfoHeader label={'Valitse lisättävä osio'}/>
          <CheckboxSelector options={this.state.lisattavaOsioOptions}
                            onChange={this.changeLisattavaOsioSelection}/>
          {this.renderLisattavaOsioTextAreas()}
        </div>
      </div>

    )
}
