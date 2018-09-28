import React, {Component} from 'react';
import {AbstractSection} from './AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {FilterList} from '../../../components/FilterList';


export class LuoKoulutusSection extends AbstractSection {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getHeader = () => "1 Luo koulutus";

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => this.createNewKoulutus()
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  /*
  <SelectorButton label={"Luo uusi"} text={"LUO UUSI"} instruction={"Lorem ipsum lorem ipsum"} options={this.getSelectorButtonOptions()}/>
          <FilterList options={this.state.koodisto}/>
   */
  renderContent = () => {
    return (
        <div className={"content"}>
         <SelectorButton/>
         <FilterList/>
        </div>
    )
  }
}