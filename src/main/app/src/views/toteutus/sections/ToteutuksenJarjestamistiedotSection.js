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

class MaksunMaaraInput extends Component {

  render = () => (
    <div className={'input-field-container column'}>
      <div className={'row'}>
        <input type={'text'} placeholder={'Maksun määrä'}></input> euroa
      </div>
    </div>
  );

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
      stipendiOptions: this.getBooleanOptions()
    });

  getClassName = () => 'ToteutuksenJarjestamistiedotSection';

  getHeader = () => 'Toteutuksen järjestämistiedot';

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

  renderLisattavaOsioTextAreas = () => this.getLisattavaOsioActiveOptions().map(entry => (
    <TextAreaField onChange={this.changeLisattavaOsioValue} id={entry.key} key={entry.key} label={entry.label}
                   value={entry.value}/>
  ));

  addNewLanguage = (event) => {
  };


  isMaksullisuusSelected = () => this.getRadioValue('maksullisuusOptions') === 'kylla';

  isLukuvuosimaksuSelected = () => this.getRadioValue('lukuvuosimaksuOptions') === 'kylla';

  optionallyRenderMaksullisuusMaksunMaara = () => this.isMaksullisuusSelected() && <MaksunMaaraInput/>

  optionallyRenderLukuvuosiMaksunMaara = () => this.isLukuvuosimaksuSelected() && <MaksunMaaraInput/>

  renderContent = () => (
      <div className={'content'}>
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

        <InfoHeader label={'Valitse lisättävä osio'}/>
        <CheckboxSelector options={this.state.lisattavaOsioOptions}
                          onChange={this.changeLisattavaOsioSelection}/>
        {this.renderLisattavaOsioTextAreas()}
      </div>
    )
}
