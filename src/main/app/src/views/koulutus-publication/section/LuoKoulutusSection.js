import React from 'react';
import {AbstractSection} from './AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {showKoulutusSelector} from '../../../states/AppState';
import {KoulutusSelector} from './luo-koulutus/KoulutusSelector';


export class LuoKoulutusSection extends AbstractSection {

  constructor(props) {
    super(props);

    this.state = {
      showKoulutusSelector: false
    };
  }

  getHeader = () => "1 Luo koulutus";

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => showKoulutusSelector()
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];



  renderContent = () => {
    return (
      <div className={"content"}>
        <SelectorButton layerAlign={"left"} label={"LUO UUSI"} onSelect={this.createNewKoulutus} options={this.getSelectorButtonOptions()}/>
        <KoulutusSelector/>
      </div>
    )
  }
}