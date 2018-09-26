import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepIndicator} from './MultiStepIndicator';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {ValitseKoulutustyyppiSection} from './section/ValitseKoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {ValitseOrganisaatioSection} from './section/ValitseOrganisaatioSection';
export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"koulutus-publication-view"}>
        <StatusBar/>
        <MultiStepIndicator/>
        <div className={"koulutus-publication-body"}>
          <div className={"button-row"}>
            <button className={"secondary-small-button"}>Esikatsele</button>
          </div>
          <LuoKoulutusSection/>
          <ValitseKoulutustyyppiSection/>
          <KoulutuksenTiedotSection/>
          <KoulutuksenKuvausSection/>
          <ValitseOrganisaatioSection/>
          <div className={"button-row"}>
            <button className={"secondary-big-button"}>Seuraava</button>
            <button className={"primary-big-button"}>Tallenna</button>
            <button className={"primary-big-button"}>Tallenna ja julkaise</button>
          </div>
        </div>
      </div>
  )

}