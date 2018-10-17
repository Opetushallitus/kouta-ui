import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepIndicator} from './MultiStepIndicator';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {KoulutustyyppiSection} from './section/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {ValitseOrganisaatioSection} from './section/ValitseOrganisaatioSection';
import {FooterActionButtons} from './FooterActionButtons';

export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"koulutus-publication-view"}>
        <StatusBar/>
        <MultiStepIndicator/>
        <div className={"koulutus-publication-body"}>
          <div className={"button-container button-container-right"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <LuoKoulutusSection/>
          <KoulutustyyppiSection/>
          <KoulutuksenTiedotSection/>
          <KoulutuksenKuvausSection/>
          <ValitseOrganisaatioSection/>
          <FooterActionButtons/>
        </div>
      </div>
  )
}