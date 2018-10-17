import React, {Component} from 'react';
import {ATTR_SAVE, ATTR_SAVE_AND_PUBLISH, saveAndPublishKoulutus, saveKoulutus} from '../../stores/KoulutusPersistencyStore';
import {APP_STATE_KOULUTUS_PERSISTENCY} from '../../config/states';
import {REQUEST_STATUS} from '../../config/constants';
import {connectToOne} from '../../utils/stateUtils';

const classNames = require('classnames');

export class FooterActionButtons extends Component {

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
      <div className={"button-container button-container-right"}>
        <button className={"secondary big"}>Seuraava</button>
        {this.renderSaveButton()}
        {this.renderPublishButton()}
      </div>
  )

}