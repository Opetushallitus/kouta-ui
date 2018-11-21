import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_STATE_HAUN_LOMAKKEET,
  changeLomakkeenTyyppiSelection,
  HAKULOMAKE_TYPE,
  selectHakemuspalvelunLomake,
  selectJarjestelmalomake,
  updateMuuLomakeValue
} from '../../../stores/haku/HaunLomakkeetStore';
import {connectComponent} from '../../../utils/stateUtils';
import {RadiobuttonSelector} from '../../../components/RadiobuttonSelector';
import {DropdownSelector} from '../../../components/DropdownSelector';

export class HaunLomakkeetSection extends AbstractSection {

  onMount = () => connectComponent(this, {
      [APP_STATE_HAUN_LOMAKKEET]: (newState) => {
        this.setState({
          ...this.state,
          ...newState
        });
      }
    }
  );

  getClassName = () => 'HaunLomakkeetSection';

  getHeader = () => 'Hakulomakkeen valinta';

  getHakemuspalvelunLomakeOptions = () => this.state.hakemuspalvelunLomakeOptions || [];

  getJarjestelmalomakeOptions = () => this.state.jarjestelmalomakeOptions || [];

  getLomakkeenTyyppiOptions = () => this.state.lomakkeenTyyppiOptions || [];

  getActiveLomakkeenTyyppi = () => this.state.activeLomakkeenTyyppi;

  renderHakemuspalvelulomakeSelector = () => (
    <div className={'hakemuspalvelun-lomake-selector column'}>
      <span className={'instruction-span'}>Valitse hakulomake</span>
      <DropdownSelector options={this.getHakemuspalvelunLomakeOptions()} prompt={'Valitse hakemuspalvelun lomake'}
                        onChange={selectHakemuspalvelunLomake}/>
    </div>
  );

  renderJarjestelmalomakeSelector = () => (
    <div className={'hakemuspalvelun-lomake-selector column'}>
      <span className={'instruction-span'}>Valitse järjestelmälomake</span>
      <DropdownSelector options={this.getJarjestelmalomakeOptions()} prompt={'Valitse järjestelmälomake'}
                        onChange={selectJarjestelmalomake}/>
    </div>
  );

  getMuuLomakeValue = () => this.state.muuLomakeValue;

  changeMuuLomakeUrl = (changedText) => {
  };

  updateMuuLomakeValue = (event) => updateMuuLomakeValue(event.target.value);

  renderMuuLomakeEditor = () => (
    <div className={'muu-lomake-editor column'}>
      <span className={'instruction-span'}>Anna lomakkeen www-osoite</span>
      <input type={'text'} placeholder={'Anna lomakkeen www-osoite'} value={this.getMuuLomakeValue()}
             onChange={this.updateMuuLomakeValue}/>
    </div>
  );

  renderEiSahkoistaHakuaInfo = () => (
    <span>Ei sähköistä hakua.</span>
  );

  renderLomakeSelector = () => {
    const lomakkeenTyyppi = this.getActiveLomakkeenTyyppi();
    if (!lomakkeenTyyppi) {
      return null;
    }
    const renderers = {
      [HAKULOMAKE_TYPE.HAKEMUSPALVELU]: this.renderHakemuspalvelulomakeSelector,
      [HAKULOMAKE_TYPE.JARJESTELMA]: this.renderJarjestelmalomakeSelector,
      [HAKULOMAKE_TYPE.MUU]: this.renderMuuLomakeEditor,
      [HAKULOMAKE_TYPE.EI_SAHKOINEN]: this.renderEiSahkoistaHakuaInfo
    };
    return renderers[lomakkeenTyyppi]();
  };

  renderLomakkeenTyyppiSelector = () => (
    <div className={'lomakkeen-tyyppi-selector column'}>
      <span className={'instruction-span'}>Valitse mitä hakulomaketta käytetään</span>
      <RadiobuttonSelector options={this.getLomakkeenTyyppiOptions()}
                           onChange={changeLomakkeenTyyppiSelection}/>
    </div>
  );

  renderContent = () => {
    return (
      <div className={'content'}>
        {this.renderLomakkeenTyyppiSelector()}
        {this.renderLomakeSelector()}
      </div>
    );
  };

}
