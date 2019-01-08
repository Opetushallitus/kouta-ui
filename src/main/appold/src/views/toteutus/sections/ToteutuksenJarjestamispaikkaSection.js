import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_ORGANISAATION_TOIMIPISTE_ENTRIES,
  APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS,
  selectToimipiste
} from '../../../stores/koulutus/KoulutuksenOrganisaatioStore';
import {CheckboxSelector} from '../../../components/CheckboxSelector';

export class ToteutuksenJarjestamispaikkaSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_ORGANISAATION_TOIMIPISTE_ENTRIES]: (toimipisteEntries) => this.setState({
      ...this.state,
      toimipisteEntries
    }),
    [APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS]: (toimipisteSelections) => this.setState({
      ...this.state,
      toimipisteSelections
    })
  });

  getClassName = () => 'ToteutuksenJarjestamispaikkaSection';

  getHeader = () => 'Missä järjestetään?';

  hasToimipisteEntries = () => this.getToimipisteEntries().length > 0;

  getToimipisteEntries = () => this.state.toimipisteEntries || [];

  getToimipisteSelections = () => this.state.toimipisteSelections || [];

  isOptionSelected = (option) => this.getToimipisteSelections()[option.key] === true;

  getToimipisteOptionsWithValues = (toimipisteOptions) => toimipisteOptions.map(option => ({
    ...option,
    active: this.isOptionSelected(option)
  }));

  selectToimipiste = (event) => selectToimipiste(event.key, event.active);

  renderToimipisteEntry = (entry, index) => <CheckboxSelector key={index} label={entry.organisaationNimi}
                                                              options={this.getToimipisteOptionsWithValues(entry.toimipisteOptions)}
                                                              onChange={this.selectToimipiste}/>;

  renderToimipisteEntries = () => this.hasToimipisteEntries() ?
    this.getToimipisteEntries().map(this.renderToimipisteEntry) : <span>Valitse ensin organisaatiot.</span>;

  renderContent = () => (
    <div className={'content'}>
      {this.renderToimipisteEntries()}
    </div>
  );

}
