import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepIndicator} from './MultiStepIndicator';
import {LuoKoulutusSection} from './section/LuoKoulutusSection';
import {KoulutustyyppiSection} from './section/KoulutustyyppiSection';
import {KoulutuksenTiedotSection} from './section/KoulutuksenTiedotSection';
import {KoulutuksenKuvausSection} from './section/KoulutuksenKuvausSection';
import {ValitseOrganisaatioSection} from './section/ValitseOrganisaatioSection';
import {ATTR_SAVE, ATTR_SAVE_AND_PUBLISH, saveAndPublishKoulutus, saveKoulutus} from '../../stores/KoulutusPersistencyStore';
import {APP_STATE_KOULUTUS_PERSISTENCY} from '../../config/states';
import {REQUEST_STATUS} from '../../config/constants';
import {connectToOne} from '../../utils/stateUtils';

const classNames = require('classnames');

export class KoulutusPublicationView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => connectToOne(APP_STATE_KOULUTUS_PERSISTENCY, {}, (state) => this.setState(state));

  saveKoulutus = () => saveKoulutus();

  saveAndPublishKoulutus = () => saveAndPublishKoulutus();

  isSaveButtonEnabled = () => true;

  isPublishButtonEnabled = () => this.state[ATTR_SAVE_AND_PUBLISH] === REQUEST_STATUS.ENABLED;

  getSaveButtonCssClass = () => this.state[ATTR_SAVE];

  getPublishButtonCssClass = () => this.state[ATTR_SAVE_AND_PUBLISH];

  getSaveButtonClickHandler = () => this.isSaveButtonEnabled() ? this.saveKoulutus : null;

  getPublishButtonClickHandler = () => this.isPublishButtonEnabled() ? this.saveAndPublishKoulutus : null;

  getSaveButtonLabel = () => 'Tallenna';

  getPublishButtonLabel = () => 'Tallenna ja julkaise';

  renderSaveButton = () => (
      <button className={classNames("primary", "big", this.getSaveButtonCssClass())}
              onClick={this.getSaveButtonClickHandler()}>{this.getSaveButtonLabel()}</button>
  )

  renderPublishButton = () => (
      <button className={classNames("primary", "big", this.getPublishButtonCssClass())}
              onClick={this.getPublishButtonClickHandler()}>{this.getPublishButtonLabel()}</button>
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
            {this.renderSaveButton()}
            {this.renderPublishButton()}
          </div>
        </div>
      </div>
  )

}