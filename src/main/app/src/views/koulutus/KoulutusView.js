import React, {Component} from 'react';
import {KoulutuksenPohjaSection} from './sections/KoulutuksenPohjaSection';
import {KoulutuksenTyyppiSection} from './sections/KoulutuksenTyyppiSection';
import {KoulutuksenTiedotSection} from './sections/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './sections/KoulutuksenKuvausSection';
import {KoulutuksenOrganisaatioSection} from './sections/KoulutuksenOrganisaatioSection';
import {KoulutuksenKieliversioSection} from './sections/KoulutuksenKieliversioSection';

export class KoulutusView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <div className={"button-container button-container-right"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <KoulutuksenTyyppiSection orderNumber={"1"}/>
          <KoulutuksenPohjaSection orderNumber={"2"}/>
          <KoulutuksenKieliversioSection orderNumber={"3"}/>
          <KoulutuksenTiedotSection orderNumber={"4"}/>
          <KoulutuksenKuvausSection orderNumber={"5"}/>
          <KoulutuksenOrganisaatioSection orderNumber={"6"}/>
      </div>
  )
}