import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {CheckboxSelector} from '../../../components/CheckboxSelector';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';

export class ToteutuksenJarjestamistiedotSection extends AbstractSection {

  getClassName = () => 'ToteutuksenJarjestamistiedotSection';

  getHeader = () => 'Toteutuksen järjestämistiedot';

  getOpetuskieliOptions = () => [
    {
      label: 'Suomi',
      value: 'fi'
    },
    {
      label: 'Ruotsi',
      value: 'sv'
    },
    {
      label: 'Englanti',
      value: 'en'
    }
  ];


  getOpetusaikaOptions= () => [
    {
      label: 'Päiväopetus',
      value: 'paivaopetus'
    },
    {
      label: 'Iltaopetus',
      value: 'iltaopetus'
    },
    {
      label: 'Viikonloppuopetus',
      value: 'viikonloppuopetus'
    }
  ];


  getOpetustapaOptions = () => [
    {
      label: 'Lähiopiskelu',
      value: 'lahiopiskelu'
    },
    {
      label: 'Etäopiskelu',
      value: 'etaopiskelu'
    }
  ];

  getMaksullisuusOptions = () => [
    {
      label: 'Ei',
      value: 'ei'
    },
    {
      label: 'Kyllä',
      value: 'kylla'
    }
  ]

  getLisattavaOsioOptions = () => [
    {
      label: 'Opintojen rakenne',
      value: 'opintojen-rakenne'
    },
    {
      label: 'Jatko-opintomahdollisuudet',
      value: 'jatko-opintomahdollisuudet'
    },
    {
      label: 'Osaamisalan valinta',
      value: 'osaamisalan-valinta'
    },
    {
      label: 'Sisältö',
      value: 'sisalto'
    },
    {
      label: 'Uramahdollisuudet',
      value: 'uramahdollisuudet'
    },
    {
      label: 'Kohderyhmä',
      value: 'kohderyhma'
    },
    {
      label: 'Kansainvälistyminen',
      value: 'kansainvalistyminen'
    },
    {
      label: 'Yhteistyö muiden toimijoiden kanssa',
      value: 'yhteistyo'
    }
  ];

  getOpetuskieliSelections = () => this.state.opetuskieliSelections || {};

  getOpetusaikaSelections = () => this.state.opetusaikaSelections || {};

  getOpetustapaSelections = () => this.state.opetustapaSelections || {};

  getMaksullisuusSelections = () => this.state.maksullisuusSelections || {};

  getLisattavaOsioSelections = () => this.state.lisattavaOsioSelections || {};

  changeOpetuskieli = (change) => {
    const opetuskieliSelections = {...this.getOpetuskieliSelections()};
    opetuskieliSelections[change.value] = change.selected;
    this.setState({...this.state, opetuskieliSelections});
  }

  changeOpetusaika = (change) => {
    this.setState({
      ...this.state,
      opetusaikaSelections: {
        [change.value]: change.selected
      }
    })
  }

  changeOpetustapa = (change) => {
    this.setState({
      ...this.state,
      opetustapaSelections: {
        [change.value]: change.selected
      }
    })
  }

  changeMaksullisuus = (change) => {
    this.setState({
      ...this.state,
      maksullisuusSelections: {
        [change.value]: change.selected
      }
    })
  }

  changeLisattavaOsio = (change) => {
    const lisattavaOsioSelections = {...this.getLisattavaOsioSelections()};
    lisattavaOsioSelections[change.value] = change.selected;
    this.setState({...this.state, lisattavaOsioSelections});
  }

  renderContent = () => {
    return (
      <div className={'content'}>
        <CheckboxSelector label={"Opetuskieli"} selections={this.getOpetuskieliSelections()} options={this.getOpetuskieliOptions()} onChange={this.changeOpetuskieli}/>
        <RadiobuttonSelector label={"Opetusaika"} selections={this.getOpetusaikaSelections()} options={this.getOpetusaikaOptions()} onChange={this.changeOpetusaika}/>
        <RadiobuttonSelector label={"Pääasiallinen opetustapa"} selections={this.getOpetustapaSelections()} options={this.getOpetustapaOptions()} onChange={this.changeOpetustapa}/>
        <RadiobuttonSelector label={"Onko opetus maksullista?"} selections={this.getMaksullisuusSelections()} options={this.getMaksullisuusOptions()} onChange={this.changeMaksullisuus}/>
        <CheckboxSelector label={"Valitse lisättävä osio"} selections={this.getLisattavaOsioSelections()}
                          options={this.getLisattavaOsioOptions()} onChange={this.changeLisattavaOsio}/>
      </div>
    );
  };

}
