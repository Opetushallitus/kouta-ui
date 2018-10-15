import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';

export class LuoKoulutusSection extends AbstractSection {



  componentDidMount = () => this.connectToSectionStateMap();

  getClassName = () => 'LuoKoulutusSection';

  getHeader = () => '1 Luo koulutus';

  isFooterVisible = () => false;

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => {
        console.log('LuoKoulutusSection:action:setSectionDone')
        this.setSectionDone()
      }
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  renderContent = () => {
    console.log('LuoKoulutusSection:renderContent:state', this.state);
    return (
        <div className={"content"}>
          <SelectorButton layerAlign={"left"} label={"LUO UUSI"} options={this.getSelectorButtonOptions()}/>
        </div>
    )
  }

}


