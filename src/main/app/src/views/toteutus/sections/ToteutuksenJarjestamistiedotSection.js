import React, {Component} from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {CheckboxSelector} from '../../../components/CheckboxSelector';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';
import {TextAreaField} from '../../../components/TextAreaField';
import {InfoHeader} from '../../../components/InfoHeader';
import {ActionLink} from '../../../components/ActionLink';
import {DropdownSelector} from '../../../components/DropdownSelector';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS,
  changeCheckboxSelection,
  changeRadioSelection,
  changeSelectionValue
} from '../../../stores/toteutus/ToteutuksenJarjestamistiedotStore';

class MaksunMaaraInput extends Component {

  render = () => (
    <div className={'input-field-container column'}>
      <div className={'row'}>
        <input type={'text'} placeholder={'Maksun määrä'}></input> euroa
      </div>
    </div>
  );

}

class StipendiEditor extends Component  {

  render = () => (
    <div className={'stipendi-editor column'}>
      <span>Summa</span>
      <div className={'row'}>
        <input type={'text'} placeholder={'Maksun määrä'}></input> euroa / prosenttia
      </div>
      <span>Anna lisätietoja stipendin myöntämisestä</span>
      <textarea placeholder={'Miten koulutus järjestetään teidän oppilaitoksessanne?'}>
      </textarea>
    </div>
  )
}

export class ToteutuksenJarjestamistiedotSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS]: (options) => this.setState({
      ...this.state,
      ...options
    })
  });

  getClassName = () => 'ToteutuksenJarjestamistiedotSection';

  getHeader = () => 'Toteutuksen järjestämistiedot';

  getLisattavaOsioActiveOptions = () => this.state.lisattavaOsioOptions.filter(entry => entry.active);

  getRadioValue = (targetOptions) => (this.state[targetOptions].find(option => option.active) || {}).key

  changeLisattavaOsioSelection = (change) => changeCheckboxSelection('lisattavaOsioOptions', change);

  changeOpetuskieliSelection = (change) => changeCheckboxSelection('opetuskieliOptions', change);

  changeOpetusaikaSelection = (change) => changeRadioSelection('opetusaikaOptions', change);

  changeOpetustapaSelection = (change) => changeRadioSelection('opetustapaOptions', change);

  changeLisattavaOsioValue = (change) => changeSelectionValue('lisattavaOsioOptions', change);

  changeMaksullisuusSelection = (change) => changeRadioSelection('maksullisuusOptions', change);

  changeStipendiSelection = (change) => changeRadioSelection('stipendiOptions', change);

  changeLukuvuosimaksuSelection = (change) => changeRadioSelection('lukuvuosimaksuOptions', change);

  changeLukuvuosi = (change) => changeRadioSelection('lukuvuosiOptions', change);

  changeLukukausi = (change) => changeRadioSelection('lukukausiOptions', change);

  renderLisattavaOsioTextAreas = () => this.getLisattavaOsioActiveOptions().map(entry => (
    <TextAreaField onChange={this.changeLisattavaOsioValue} id={entry.key} key={entry.key} label={entry.label}
                   value={entry.value}/>
  ));

  addNewLanguage = (event) => {
  };

  isMaksullisuusSelected = () => this.getRadioValue('maksullisuusOptions') === 'kylla';

  isLukuvuosimaksuSelected = () => this.getRadioValue('lukuvuosimaksuOptions') === 'kylla';

  isStipendiSelected = () => this.getRadioValue('stipendiOptions') === 'kylla';

  optionallyRenderMaksullisuusMaksunMaara = () => this.isMaksullisuusSelected() && <MaksunMaaraInput/>

  optionallyRenderLukuvuosiMaksunMaara = () => this.isLukuvuosimaksuSelected() && <MaksunMaaraInput/>

  optionallyRenderStipendiEditor = () => this.isStipendiSelected() && <StipendiEditor/>

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

          <InfoHeader label={'Onko lukuvuosimaksua?'}/>
          <div className={'option-controls-row'}>
            <RadiobuttonSelector options={this.state.lukuvuosimaksuOptions}
                                 onChange={this.changeLukuvuosimaksuSelection}/>
            {this.optionallyRenderLukuvuosiMaksunMaara()}
          </div>
          <InfoHeader label={'Onko stipendit käytössä?'}/>
          <RadiobuttonSelector options={this.state.stipendiOptions}
                               onChange={this.changeStipendiSelection}/>
          {this.optionallyRenderStipendiEditor()}

          <InfoHeader label={'Tieto suunnitelluista koulutuksen alkamisajankohdista'}/>

          <div className={'koulutuksen-alkamisajankohta row'}>
            <RadiobuttonSelector options={this.state.lukukausiOptions} onChange={this.changeLukukausi}/>
            <span className={'label'}>Vuosi</span>
            <DropdownSelector options={this.state.lukuvuosiOptions} prompt={'Valitse lukuvuosi'}
                              onChange={this.changeLukuvuosi}/>
          </div>

          <div className={'toteutuksen-kuvaus column'}>
            <InfoHeader label={'Toteutuksen kuvaus'}/>
            <textarea className={'toteutuksen-kuvaus-textarea'}
                      placeholder={'Kirjoita kuvaus miten koulutukssen toteutus järjestetään teidän oppilaitoksessanne'}/>
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
