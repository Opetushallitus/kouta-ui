import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    APP_STATE_HAKUKOHTEEN_LOMAKKEET,
    HAKULOMAKE_TYPE,
    changeLomakkeenTyyppiSelection,
    clearSelections,
    selectHakemuspalvelunLomake,
    selectJarjestelmalomake,
    updateMuuLomakeValue
} from '../../../stores/hakukohde/HakukohteenLomakeStore';
import {DropdownSelector} from "../../../components/DropdownSelector";
import {RadiobuttonSelector} from "../../../components/RadiobuttonSelector";

export class HakukohteenLomakeSection extends AbstractSection {

    onMount = () => connectComponent(this, {
        [APP_STATE_HAKUKOHTEEN_LOMAKKEET]: (incomingState) => this.setState({
            ...this.state,
            ...incomingState
        })
    });

    getClassName = () => 'HakukohteenLomakeSection';

    getHeader = () => 'Lomake';

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

    onClearButtonClick = () => clearSelections();

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
