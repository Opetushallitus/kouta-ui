import React, {Component} from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {FilterList} from '../../../components/FilterList';
import {expandKoulutusTyyppiSection} from '../../../states/AppState';
import {KoulutusSelector} from './luo-koulutus/KoulutusSelector';


export class LuoKoulutusSection extends AbstractSection {

  constructor(props) {
    super(props);

    this.state = {
      showKoulutusSelector: false,
      expanded: true
    };
  }

  getHeader = () => "1 Luo koulutus";

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => expandKoulutusTyyppiSection()
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