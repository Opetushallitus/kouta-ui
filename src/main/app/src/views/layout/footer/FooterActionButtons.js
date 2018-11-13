import React, {Component} from 'react';
import {REQUEST_STATUS} from '../../../config/constants';
import {broadcast, connectListener} from '../../../utils/stateUtils';
import {
    APP_EVENT_SAVE_AND_PUBLISH_KOULUTUS, APP_EVENT_SAVE_KOULUTUS,
    APP_STATE_SAVE_KOULUTUS,
    ATTR_SAVE,
    ATTR_SAVE_AND_PUBLISH
} from "../../../stores/koulutus/KoulutusStore";

const classNames = require('classnames');

export class FooterActionButtons extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => connectListener(this, APP_STATE_SAVE_KOULUTUS, (state) => this.setState(state));

  saveKoulutus = () => broadcast(APP_EVENT_SAVE_KOULUTUS);

  saveAndPublishKoulutus = () => broadcast(APP_EVENT_SAVE_AND_PUBLISH_KOULUTUS);

  isSaveButtonEnabled = () => true;

  isPublishButtonEnabled = () => this.state[ATTR_SAVE_AND_PUBLISH] === REQUEST_STATUS.ENABLED;

  getSaveButtonCssClass = () => this.state[ATTR_SAVE];

  getPublishButtonCssClass = () => this.state[ATTR_SAVE_AND_PUBLISH];

  getSaveButtonClickHandler = () => this.isSaveButtonEnabled() ? this.saveKoulutus : null;

  getPublishButtonClickHandler = () => this.isPublishButtonEnabled() ? this.saveAndPublishKoulutus : null;

  getSaveButtonLabel = () => ({
    [REQUEST_STATUS.SUCCESS]: 'Tallennettu',
    [REQUEST_STATUS.FAILURE]: 'Tallennuksessa tapahtui virhe'
  }[this.state[ATTR_SAVE]]) || 'Tallenna';

  getPublishButtonLabel = () => ({
    [REQUEST_STATUS.SUCCESS]: 'Julkaistu',
    [REQUEST_STATUS.FAILURE]: 'Julkaisussa tapahtui virhe'
  }[this.state[ATTR_SAVE_AND_PUBLISH]]) || 'Tallenna ja julkaise';

  renderSaveButton = () => (
      <button className={classNames("primary", "big", this.getSaveButtonCssClass())}
              onClick={this.getSaveButtonClickHandler()}>{this.getSaveButtonLabel()}</button>
  )

  renderPublishButton = () => (
      <button className={classNames("primary", "big", this.getPublishButtonCssClass())}
              onClick={this.getPublishButtonClickHandler()}>{this.getPublishButtonLabel()}</button>
  );

  render = () => (
      <div className={"footer-action-buttons button-container button-container-right"}>
        <button className={"secondary big"}>Seuraava</button>
        {this.renderSaveButton()}
        {this.renderPublishButton()}
      </div>
  )

}
