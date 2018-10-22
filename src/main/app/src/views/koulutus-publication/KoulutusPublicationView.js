import React, {Component} from 'react';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {KoulutustyyppiSection} from './section/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {OrganisaatioSection} from './section/OrganisaatioSection';

export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"koulutus-publication-view"}>
          <div className={"button-container button-container-right"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <LuoKoulutusSection orderNumber={"1"}/>
          <KoulutustyyppiSection orderNumber={"2"}/>
          <KoulutuksenTiedotSection orderNumber={"3"}/>
          <KoulutuksenKuvausSection orderNumber={"4"}/>
          <OrganisaatioSection orderNumber={"5"}/>
      </div>
  )
}