import React, {Component} from 'react';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {KoulutustyyppiSection} from './section/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {OrganisaatioSection} from './section/OrganisaatioSection';
import {KieliversioSection} from './section/KieliversioSection';

export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"koulutus-publication-view"}>
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