import React, {Component} from 'react';
import {LuoKoulutusSection} from './sections/LuoKoulutusSection';
import {KoulutustyyppiSection} from './sections/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './sections/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './sections/KoulutuksenKuvausSection';
import {OrganisaatioSection} from './sections/OrganisaatioSection';
import {KieliversioSection} from './sections/KieliversioSection';

export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <div className={"button-container button-container-right"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <KoulutustyyppiSection orderNumber={"1"}/>
          <LuoKoulutusSection orderNumber={"2"}/>
          <KieliversioSection orderNumber={"3"}/>
          <KoulutuksenTiedotSection orderNumber={"4"}/>
          <KoulutuksenKuvausSection orderNumber={"5"}/>
          <OrganisaatioSection orderNumber={"6"}/>
      </div>
  )
}