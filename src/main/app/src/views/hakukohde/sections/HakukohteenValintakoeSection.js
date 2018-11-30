import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    addNewEiValintakoetta,
    addNewHaastattelu,
    addNewLisanaytto,
    addNewLisapiste,
    addNewSoveltuvuuskoe,
    APP_STATE_HAKUKOHTEEN_VALINTAKOE,
    clearSelections,
    getEiValintakoettaEntries,
    getHaastatteluEntries,
    getLisanayttoEntries,
    getLisapisteEntries,
    getSoveltuvuuskoeEntries,
    getValintakokeenTyyppiOptions,
    isValintakokeenTyyppiActive,
    updateEiValintakoetta,
    updateHaastattelu,
    updateLisanaytto,
    updateLisapiste,
    updateSoveltuvuuskoe,
    updateValintakokeenTyyppiselection
} from '../../../stores/hakukohde/HakukohteenValintakoeStore';
import {APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from "../../../stores/hakukohde/HakukohteenKieliversioStore";
import {CheckboxSelector} from "../../../components/CheckboxSelector";
import {Division} from "../../../components/Division";
import {ValintakoeEditor} from "./hakukohteen-valintakoe/ValintakoeEditor";
import {ActionLink} from "../../../components/ActionLink";

export class HakukohteenValintakoeSection extends AbstractSection {

    onMount = () => connectComponent(this, {
        [APP_STATE_HAKUKOHTEEN_VALINTAKOE]: (incomingState) => this.setState({
            ...this.state,
            ...incomingState
        })
    });

    getStateNameForSupportedLanguages = () => APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

    getClassName = () => 'HakukohteenValintakoeSection';

    getHeader = () => 'Valintakoe';

    onClearButtonClick = () => clearSelections();

    renderValintakoeEditor = (valintakoe, index, updaterFunction) => <ValintakoeEditor key={index}
                                                                                       valintakoe={valintakoe}
                                                                                       onChange={updaterFunction}/>;

    getActionLinkLabel = () => 'Lisää uusi tilaisuus';

    renderSoveltuvuuskoeEntries = () => isValintakokeenTyyppiActive('soveltuvuuskoe') && (
        <Division label={'Pääsy- ja soveltuvuuskoe'} expanded={true}>
            {getSoveltuvuuskoeEntries().map((valintakoe, index) => this.renderValintakoeEditor(valintakoe, index, updateSoveltuvuuskoe))}
            <ActionLink label={this.getActionLinkLabel()} onClick={addNewSoveltuvuuskoe}/>
        </Division>
    );

    renderLisanayttoEntries = () => isValintakokeenTyyppiActive('lisanaytto') && (
        <Division label={'Lisänäyttö'} expanded={true}>
            {getLisanayttoEntries().map((valintakoe, index) => this.renderValintakoeEditor(valintakoe, index, updateLisanaytto))}
            <ActionLink label={this.getActionLinkLabel()} onClick={addNewLisanaytto}/>
        </Division>
    );

    renderLisapisteEntries = () => isValintakokeenTyyppiActive('lisapiste') && (
        <Division label={'Lisäpiste'} expanded={true}>
            {getLisapisteEntries().map((valintakoe, index) => this.renderValintakoeEditor(valintakoe, index, updateLisapiste))}
            <ActionLink label={this.getActionLinkLabel()} onClick={addNewLisapiste}/>
        </Division>
    );

    renderHaastatteluEntries = () => isValintakokeenTyyppiActive('haastattelu') && (
        <Division label={'Haastattelu'} expanded={true}>
            {getHaastatteluEntries().map((valintakoe, index) => this.renderValintakoeEditor(valintakoe, index, updateHaastattelu))}
            <ActionLink label={this.getActionLinkLabel()} onClick={addNewHaastattelu}/>
        </Division>
    );
    renderEiValintakoettaEntries = () => isValintakokeenTyyppiActive('ei-valintakoetta') && (
        <Division label={'Ei valintakoetta'} expanded={true}>
            {getEiValintakoettaEntries().map((valintakoe, index) => this.renderValintakoeEditor(valintakoe, index, updateEiValintakoetta))}
            <ActionLink label={this.getActionLinkLabel()} onClick={addNewEiValintakoetta}/>
        </Division>
    );

    renderContent = () => (
        <div className={'content'}>
            <div className={'valintakokeen-tyyppi'}>
                <span className={'instruction-span'}>Valitse valintakokeen tyyppi</span>
                <CheckboxSelector options={getValintakokeenTyyppiOptions()}
                                  onChange={updateValintakokeenTyyppiselection}/>
            </div>
            <div className={'valintakokeen-editointi'}>
                {this.renderSoveltuvuuskoeEntries()}
                {this.renderLisanayttoEntries()}
                {this.renderLisapisteEntries()}
                {this.renderHaastatteluEntries()}
                {this.renderEiValintakoettaEntries()}
            </div>
            <div className={'notes'}></div>
        </div>
    );
}
