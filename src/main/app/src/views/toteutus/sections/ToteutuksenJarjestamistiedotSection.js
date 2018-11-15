import React, {Component} from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {CheckboxSelector} from '../../../components/CheckboxSelector';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';
import {TextAreaField} from '../../../components/TextAreaField';
import {
  updateMultiSelectionOptionActivation,
  updateOptionValue,
  updateSingleSelectionOptionActivation
} from '../../../utils/optionListUtils';
import {InfoHeader} from '../../../components/InfoHeader';
import {ActionLink} from '../../../components/ActionLink';
import {DropdownSelector} from '../../../components/DropdownSelector';

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

  onMount = () => this.setState({
    ...this.state,
    lisattavaOsioOptions: this.getLisattavaOsioOptions(),
    opetuskieliOptions: this.getOpetuskieliOptions(),
    opetusaikaOptions: this.getOpetusaikaOptions(),
    opetustapaOptions: this.getOpetustapaOptions(),
    maksullisuusOptions: this.getBooleanOptions(),
    lukuvuosimaksuOptions: this.getBooleanOptions(),
    stipendiOptions: this.getBooleanOptions(),
    lukukausiOptions: this.getLukukausiOptions(),
    lukuvuosiOptions: this.getLukuvuosiOptions()
  });

  getClassName = () => 'ToteutuksenJarjestamistiedotSection';

  getHeader = () => 'Toteutuksen järjestämistiedot';

  //TODO: siirrä storeen
  getLukukausiOptions = () => [
    {
      label: 'Kevät',
      key: 'kevat'
    },
    {
      label: 'Kesä',
      key: 'kesa'
    },
    {
      label: 'Syksy',
      key: 'syksy'
    }
  ];

  //TODO: siirrä storeen
  getOpetuskieliOptions = () => [
    {
      label: 'Suomi',
      key: 'fi'
    },
    {
      label: 'Ruotsi',
      key: 'sv'
    },
    {
      label: 'Englanti',
      key: 'en'
    }
  ];

  //TODO: siirrä storeen
  getOpetusaikaOptions= () => [
    {
      label: 'Päiväopetus',
      key: 'paivaopetus'
    },
    {
      label: 'Iltaopetus',
      key: 'iltaopetus'
    },
    {
      label: 'Viikonloppuopetus',
      key: 'viikonloppuopetus'
    }
  ];

  //TODO: siirrä storeen
  getOpetustapaOptions = () => [
    {
      label: 'Lähiopiskelu',
      key: 'lahiopiskelu'
    },
    {
      label: 'Etäopiskelu',
      key: 'etaopiskelu'
    }
  ];

  //TODO: siirrä storeen
  getBooleanOptions = () => [
    {
      label: 'Ei',
      key: 'ei'
    },
    {
      label: 'Kyllä',
      key: 'kylla'
    }
  ];

  //TODO: siirrä storeen
  getLisattavaOsioOptions = () => [
    {
      label: 'Opintojen rakenne',
      key: 'opintojen-rakenne'
    },
    {
      label: 'Jatko-opintomahdollisuudet',
      key: 'jatko-opintomahdollisuudet'
    },
    {
      label: 'Osaamisalan valinta',
      key: 'osaamisalan-valinta'
    },
    {
      label: 'Sisältö',
      key: 'sisalto'
    },
    {
      label: 'Uramahdollisuudet',
      key: 'uramahdollisuudet'
    },
    {
      label: 'Kohderyhmä',
      key: 'kohderyhma'
    },
    {
      label: 'Kansainvälistyminen',
      key: 'kansainvalistyminen'
    },
    {
      label: 'Yhteistyö muiden toimijoiden kanssa',
      key: 'yhteistyo'
    }
  ];

  //TODO: siirrä storeen
  getLukuvuosiOptions = () => [
    {
      label: '2019',
      key: '2019'
    },
    {
      label: '2020',
      key: '2020'
    },
    {
      label: '2021',
      key: '2021'
    },
    {
      label: '2022',
      key: '2022'
    }
  ];

  getLisattavaOsioActiveOptions = () => this.state.lisattavaOsioOptions.filter(entry => entry.active);

  changeCheckboxSelection = (targetOptions, change) => this.setState({
    ...this.state,
    [targetOptions]: updateMultiSelectionOptionActivation(this.state[targetOptions], change)
  });

  changeRadioSelection = (targetOptions, change) => this.setState({
    ...this.state,
    [targetOptions]: updateSingleSelectionOptionActivation(this.state[targetOptions], change)
  });

  changeSelectionValue = (targetOptions, change) => this.setState({
    ...this.state,
    [targetOptions]: updateOptionValue(this.state[targetOptions], change)
  });

  getRadioValue = (targetOptions) => (this.state[targetOptions].find(option => option.active) || {}).key

  changeLisattavaOsioSelection = (change) => this.changeCheckboxSelection('lisattavaOsioOptions', change);

  changeOpetuskieliSelection = (change) => this.changeCheckboxSelection('opetuskieliOptions', change);

  changeOpetusaikaSelection = (change) => this.changeRadioSelection('opetusaikaOptions', change);

  changeOpetustapaSelection = (change) => this.changeRadioSelection('opetustapaOptions', change);

  changeLisattavaOsioValue = (change) => this.changeSelectionValue('lisattavaOsioOptions', change);

  changeMaksullisuusSelection = (change) => this.changeRadioSelection('maksullisuusOptions', change);

  changeStipendiSelection = (change) => this.changeRadioSelection('stipendiOptions', change);

  changeLukuvuosimaksuSelection = (change) => this.changeRadioSelection('lukuvuosimaksuOptions', change);

  changeLukuvuosi = (change) => this.changeRadioSelection('lukuvuosiOptions', change);

  changeLukukausi = (change) => this.changeRadioSelection('lukukausiOptions', change);

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
