import React, {Component} from 'react';
import {KoulutuksenLuontiSection} from './sections/KoulutuksenLuontiSection';
import {KoulutuksenTyyppiSection} from './sections/KoulutuksenTyyppiSection';
import {KoulutuksenTiedotSection} from './sections/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './sections/KoulutuksenKuvausSection';
import {OrganisaatioSection} from './sections/OrganisaatioSection';
import {KoulutuksenKieliversioSection} from './sections/KoulutuksenKieliversioSection';

export class KoulutusView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <div className={"button-container button-container-right"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <KoulutuksenTyyppiSection orderNumber={"1"}/>
          <KoulutuksenLuontiSection orderNumber={"2"}/>
          <KoulutuksenKieliversioSection orderNumber={"3"}/>
          <KoulutuksenTiedotSection orderNumber={"4"}/>
          <KoulutuksenKuvausSection orderNumber={"5"}/>
          <OrganisaatioSection orderNumber={"6"}/>
      </div>
  )
}