import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET,
  selectKielitaito,
  selectKielitutkinto,
  updateCustomKielitaito,
  updateTaso,
  clearSelections
} from '../../../stores/valintaperusteet/ValintaperusteenKielitaitovaatimuksetStore';
import {CheckboxSelector} from '../../../components/CheckboxSelector';
import {DropdownSelector} from '../../../components/DropdownSelector';
import {ContentfulOptionRenderer} from '../../../components/ContentfulOptionSelector';

export class ValintaperusteenKielitaitovaatimuksetSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'ValintaperusteenKielitaitovaatimuksetSection';

  getHeader = () => 'Kielitaitovaatimukset';

  getKielitutkintoOptions = () => this.state.kielitutkintoOptions || [];

  getKielitaitoOptions = () => this.state.kielitaitoOptions || [];

  getActiveKielitutkinto = () => this.getKielitutkintoOptions().find(option => option.active === true);

  onClearButtonClick = () => clearSelections();

  updateTaso = (event) => {
    const dataId = event.target.getAttribute('data-id');
    const value = event.target.value;
    updateTaso(dataId, value);
  };

  selectKielitutkintoDescription = (kielitutkintoId, change) => {
    console.log('selectKielitutkintoDescription:kielitutkintoId', kielitutkintoId);
    console.log('selectKielitutkintoDescription:change', change);
  };

  renderKielitutkintoSelector = (content, kielitutkintoId) => {
    const options = content[kielitutkintoId].options;
    const taso = content[kielitutkintoId].taso;
    return <div className={'kielitutkinto-selector row'}>
      <DropdownSelector id={'kielitutkintoId'} options={options}
                        onChange={(change) => this.selectKielitutkintoDescription(kielitutkintoId, change)}/>
      <input type={'text'} dataId={'kielitutkintoId'} value={taso} onChange={this.updateTaso}/>
    </div>;
  };

  renderTutkintoContent = (content) => {
    if (!content) {
      return null;
    }
    const optionIds = Object.keys(content);
    return optionIds.map(optionId => this.renderKielitutkintoSelector(content, optionId));
  };



  renderContent = () => (
    <div className={'content'}>
      <div className={'kielitutkinto column'}>
        <span className={'instruction-span'}>Valitse kielitutkinto:</span>
        <ContentfulOptionRenderer options={this.getKielitutkintoOptions()} onChange={selectKielitutkinto}
                                  renderContent={this.renderTutkintoContent}/>
      </div>
      <div className={'kielitaito column'}>
        <span className={'instruction-span'}>Kielitaidon voi osoittaa / saa vapautuksen jos:</span>
        <CheckboxSelector options={this.getKielitaitoOptions()} onChange={selectKielitaito}
                          onInput={updateCustomKielitaito}/>
      </div>
    </div>
  );

}
