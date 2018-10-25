import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {InfoDropdown} from '../../../components/InfoDropdown';

export class KoulutuksenLuontiSection extends AbstractSection {

  getClassName = () => 'KoulutuksenLuontiSection';

  getHeader = () => 'Luo koulutus';

  isFooterVisible = () => false;

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => this.setSectionDone()
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  getDropdownOptions = () => [
    {
      "value": "1.2.246.562.13.00000000000000000001",
      "label": "Insinööri (ylempi AMK), merenkulku"
    },
    {
      "value": "1231",
      "label": "Insinööri (ylempi AMK), merenkulku"
    }
  ];

  handleDropdownChange = (event) => {
    const value = event.target.value;
  }

  renderContent = () => (
      <div className={"content"}>
        <SelectorButton layerAlign={"left"} label={"Valitse pohja"} options={this.getSelectorButtonOptions()}/>
        <InfoDropdown label={"Valitse listasta"} onChange={this.handleDropdownChange} selection={"1.2.246.562.13.00000000000000000001"} options={this.getDropdownOptions()}/>
      </div>
  );

}


