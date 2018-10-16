import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepIndicator} from './MultiStepIndicator';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {KoulutustyyppiSection} from './section/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {ValitseOrganisaatioSection} from './section/ValitseOrganisaatioSection';
import {saveAndPublishKoulutus, saveKoulutus} from '../../stores/KoulutusPersistencyStore';
import {connect} from '../../utils/utils';
import {APP_STATE_KOULUTUS_PERSISTENCY} from '../../config/states';
import {JULKAISUTILA} from '../../config/constants';

export class KoulutusPublicationView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = connect(APP_STATE_KOULUTUS_PERSISTENCY, {}, (state) => {
    console.log('KoulutusPublicationView:setState', state);
    this.setState(state)
  });

  saveKoulutus = () => saveKoulutus();

  saveAndPublishKoulutus = () => saveAndPublishKoulutus();

  isSaved = () => this.state[JULKAISUTILA.TALLENNETTU] === true;

  isPublished = () => this.state[JULKAISUTILA.JULKAISTU] === true;

  renderTallennaButton = () => this.isSaved() ? (
      <button className={"primary big disabled"} >Tallennettu</button>
  ) : (
      <button className={"primary big"} onClick={this.saveKoulutus}>Tallenna</button>
  );

  renderJulkaiseButton = () => this.isPublished() ? (
      <button className={"primary big disabled"} >Julkaistu</button>
  ) : (
      <button className={"primary big"} onClick={this.saveAndPublishKoulutus}>Tallenna ja julkaise</button>
  );

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
          <div className={"button-container button-container-right"}>
            <button className={"secondary big"}>Seuraava</button>
            {this.renderTallennaButton()}
            {this.renderJulkaiseButton()}
          </div>
        </div>
      </div>
  )

}