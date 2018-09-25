import React, {Component} from 'react';

export class KoulutuksetActionBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectorVisible: false
    };
  }

  toggleSelector = () => {
    this.setState( {
      selectorVisible: !this.state.selectorVisible
    });
  };

  renderSelectorLayer = () => this.state.selectorVisible ? (
      <div className="selector-layer">
        <span>Tutkintoon johtava koulutus</span>
        <span>Muu koulutus</span>
      </div>
  ) : null;

  render = () => (
    <div className="koulutukset-action-bar">
      <h1 className="koulutukset-header">Koulutukset</h1>
      <div className="new-koulutus-selector">
        <button className="new-koulutus-button" onClick={this.toggleSelector}>Luo uusi koulutus</button>
        {this.renderSelectorLayer()}
      </div>
      <button className="file-import-button">Tuo tiedostosta</button>
    </div>
  )
}