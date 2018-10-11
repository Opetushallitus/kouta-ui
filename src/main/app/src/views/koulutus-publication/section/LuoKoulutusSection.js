import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';

export class LuoKoulutusSection extends AbstractSection {

  getHeader = () => "1 Luo koulutus";

  isFooterVisible = () =>false;

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => this.setSectionDone()
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  renderContent = () => (
      <div className={"content"}>
        <SelectorButton layerAlign={"left"} label={"LUO UUSI"} onSelect={this.createNewKoulutus} options={this.getSelectorButtonOptions()}/>
      </div>
  )
}


