import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {logEvent} from '../../../utils/logging';

export class KoulutuksenLuontiSection extends AbstractSection {

  getClassName = () => 'KoulutuksenLuontiSection';

  getHeader = () => 'Luo koulutus';

  isFooterVisible = () => false;

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => {
        logEvent('KoulutuksenLuontiSection:action:setSectionDone')
        this.setSectionDone()
      }
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  renderContent = () => (
        <div className={"content"}>
          <SelectorButton layerAlign={"left"} label={"LUO UUSI"} options={this.getSelectorButtonOptions()}/>
        </div>
  );

}


