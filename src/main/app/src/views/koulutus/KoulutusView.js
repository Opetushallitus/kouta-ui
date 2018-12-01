import React, {Component} from 'react';
import {KoulutuksenPohjanValintaSection} from './sections/KoulutuksenPohjanValintaSection';
import {KoulutuksenTyyppiSection} from './sections/KoulutuksenTyyppiSection';
import {KoulutuksenTiedotSection} from './sections/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './sections/KoulutuksenKuvausSection';
import {KoulutuksenOrganisaatioSection} from './sections/KoulutuksenOrganisaatioSection';
import {KoulutuksenKieliversioSection} from './sections/KoulutuksenKieliversioSection';
import {KoulutuksenNimiSection} from './sections/KoulutuksenNimiSection';

export class KoulutusView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <div className={"button-container button-container-right"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <KoulutuksenTyyppiSection orderNumber={"1"}/>
          <KoulutuksenPohjanValintaSection orderNumber={"2"}/>
          <KoulutuksenKieliversioSection orderNumber={"3"}/>
          <KoulutuksenTiedotSection orderNumber={"4"}/>
          <KoulutuksenKuvausSection orderNumber={"5"}/>
          <KoulutuksenOrganisaatioSection orderNumber={"6"}/>
      </div>
  )
}
