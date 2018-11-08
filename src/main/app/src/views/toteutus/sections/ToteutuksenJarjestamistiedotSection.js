import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {CheckboxSelector} from '../../../components/CheckboxSelector';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';
import {TextAreaField} from '../../../components/TextAreaField';

export class ToteutuksenJarjestamistiedotSection extends AbstractSection {

  onMount = () => {
    this.setState({
      ...this.state,
      lisattavaOsioOptions: this.getLisattavaOsioOptions(),
      opetuskieliOptions: this.getOpetuskieliOptions(),
      opetusaikaOptions: this.getOpetusaikaOptions(),
      opetustapaOptions: this.getOpetustapaOptions(),
      maksullisuusOptions: this.getMaksullisuusOptions()
    });
  };
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

  getMaksullisuusOptions = () => [
    {
      label: 'Ei',
      key: 'ei'
    },
    {
      label: 'Kyllä',
      key: 'kylla'
    }
  ]

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
    [targetOptions]: this.state[targetOptions].map(entry => ({
      ...entry,
      active: change.key === entry.key ? change.value : entry.active
    }))
  });

  changeRadioSelection = (targetOptions, change) => this.setState({
    ...this.state,
    [targetOptions]: this.state[targetOptions].map(entry => ({
      ...entry,
      active: change.key === entry.key ? change.value : false
    }))
  });

  changeValue = (targetOptions, change) => this.setState({
    ...this.state,
    [targetOptions]: this.state[targetOptions].map(entry => ({
      ...entry,
      value: change.key === entry.key ? change.value : entry.value
    }))
  });

  changeLisattavaOsioSelection = (change) => this.changeCheckboxSelection('lisattavaOsioOptions', change);

  changeOpetuskieliSelection = (change) => this.changeCheckboxSelection('opetuskieliOptions', change);

  changeOpetusaikaSelection = (change) => this.changeRadioSelection('opetusaikaOptions', change);

  changeOpetustapaSelection = (change) => this.changeRadioSelection('opetustapaOptions', change);

  changeLisattavaOsioValue = (change) => this.changeValue('lisattavaOsioOptions', change);

  changeMaksullisuusSelection = (change) => this.changeRadioSelection('maksullisuusOptions', change);

  renderLisattavaOsioTextAreas = () => this.getLisattavaOsioActiveOptions().map(entry => (
    <TextAreaField onChange={this.changeLisattavaOsioValue} id={entry.key} key={entry.key} label={entry.label}
                   value={entry.value}/>
  ));

  renderContent = () => {
    console.log('Section:renderCOntent', this.state);
    return (
      <div className={'content'}>
        <CheckboxSelector label={'Opetuskieli'}
                          options={this.state.opetuskieliOptions}
                          onChange={this.changeOpetuskieliSelection}
        />
        <RadiobuttonSelector label={'Opetusaika'}
                             options={this.state.opetusaikaOptions}
                             onChange={this.changeOpetusaikaSelection}/>
        <RadiobuttonSelector label={'Pääasiallinen opetustapa'}
                             options={this.state.opetustapaOptions}
                             onChange={this.changeOpetustapaSelection}/>
        <RadiobuttonSelector label={'Onko opetus maksullista?'}
                             options={this.state.maksullisuusOptions}
                             onChange={this.changeMaksullisuusSelection}/>
        <CheckboxSelector label={'Valitse lisättävä osio'}
                          options={this.state.lisattavaOsioOptions}
                          onChange={this.changeLisattavaOsioSelection}/>;
        {this.renderLisattavaOsioTextAreas()}
      </div>
    )
  };
}
