import React, {Component} from 'react';
import {connectComponent, disconnectListener} from '../../../../utils/stateUtils';
import {
  APP_STATE_KOULUTUKUSEN_OSAAMISALAKUVAUS_MAP,
  APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS
} from '../../../../config/states';
import {getLanguage} from '../../../../stores/generic/LanguageStore';

export class OsaamisalaViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUKUSEN_OSAAMISALAKUVAUS_MAP]: (osaamisalakuvausMap) => this.setState({...this.state, osaamisalakuvausMap}),
    [APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS]: (selections) => this.setState({...this.state, selections})
  });

  componentWillUnmount = () => disconnectListener(this);

  getOsaamisalakuvausMap = () => this.state.osaamisalakuvausMap || {};

  getOsaamisalaKuvausList = () => Object.values(this.state.osaamisalakuvausMap || {});

  getSelections = () => this.state.selections || {};

  getOsaamisalaByKey = (key) => this.getOsaamisalakuvausMap()[key];

  //TODO: Move this logic to stores
  getSelectedEntries = () => {
    const selections = this.getSelections();
    let entries = [];
    Object.keys(selections).forEach(key => {
      let selected = selections[key];
      if (selected) {
        entries.push(this.getOsaamisalaByKey(key));
      }
    });
    return entries;
  };

  renderOsaamisalaKuvaus = (entry, index) => entry ? (
    <div className={'osaamisala-kuvaus'} key={index}>
      <div className={'kuvaus-title'}>
        {entry.nimi[getLanguage()]}
      </div>
      <div className={'content'} dangerouslySetInnerHTML={{__html: entry.teksti[getLanguage()]}}>
      </div>
    </div>
  ) : null;

  renderKuvausList = () => this.getSelectedEntries().map(this.renderOsaamisalaKuvaus);

  render = () => (
    <div className={'osaamisala-viewer'}>
      {this.renderKuvausList()}
    </div>
  );

}
