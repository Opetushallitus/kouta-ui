import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepIndicator} from './MultiStepIndicator';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {KoulutustyyppiSection} from './section/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {ValitseOrganisaatioSection} from './section/ValitseOrganisaatioSection';
import {saveAndPublishKoulutus, saveKoulutus} from '../../stores/KoulutusPersistencyStore';
export class KoulutusPublicationView extends Component {

  saveKoulutus = () => saveKoulutus();

  saveAndPublishKoulutus = () => saveAndPublishKoulutus();

  render = () => (
      <div className={"koulutus-publication-view"}>
        <StatusBar/>
        <MultiStepIndicator/>
        <div className={"koulutus-publication-body"}>
          <div className={"button-container"}>
            <button className={"secondary small"}>Esikatsele</button>
          </div>
          <LuoKoulutusSection/>
          <KoulutustyyppiSection/>
          <KoulutuksenTiedotSection/>
          <KoulutuksenKuvausSection/>
          <ValitseOrganisaatioSection/>
          <div className={"button-container button-container-right"}>
            <button className={"secondary big"}>Seuraava</button>
            <button className={"primary big"} onClick={this.saveKoulutus}>Tallenna</button>
            <button className={"primary big"} onClick={this.saveAndPublishKoulutus}>Tallenna ja julkaise</button>
          </div>
        </div>
      </div>
  )

}