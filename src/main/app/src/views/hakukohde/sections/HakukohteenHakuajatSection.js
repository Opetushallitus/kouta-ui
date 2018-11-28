import React, {Component} from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    addHakuaika,
    APP_STATE_HAKUKOHTEEN_HAKUAJAT,
    clearSelections,
    setPoikkeavaHakuaika,
    updateHakuaika
} from '../../../stores/hakukohde/HakukohteenHakuajatStore';
import {DateTimeEditor} from "../../../components/DateTimeEditor";
import {ActionLink} from "../../../components/ActionLink";
import {InfoHeader} from "../../../components/InfoHeader";

class HakukohteenHakuaikaEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props.hakuaika
        };
    }

    getAlkamishetki = () => this.state.alkamishetki || {date: '', time: ''};

    getPaattymishetki = () => this.state.paattymishetki || {date: '', time: ''};

    updateAlkamishetki = (alkamishetki) => this.props.onChange({
        ...this.state,
        alkamishetki
    });

    updatePaattymishetki = (paattymishetki) => this.props.onChange({
        ...this.state,
        paattymishetki
    });

    render = () => (
        <div className={'hakukohteen-hakuaika-editor row'}>
            <DateTimeEditor label={'Alkaa'} date={this.getAlkamishetki().date} time={this.getAlkamishetki().time}
                            onChange={this.updateAlkamishetki}/>
            <DateTimeEditor label={'Päättyy'} date={this.getPaattymishetki().date} time={this.getPaattymishetki().time}
                            onChange={this.updatePaattymishetki}/>
        </div>
    );
}

export class HakukohteenHakuajatSection extends AbstractSection {

    onMount = () => connectComponent(this, {
        [APP_STATE_HAKUKOHTEEN_HAKUAJAT]: (incomingState) => this.setState({
            ...this.state,
            ...incomingState
        })
    });

    getClassName = () => 'HakukohteenHakuajatSection';

    getHeader = () => 'Hakuajat';

    getHakukohteenHakuaikaEntries = () => this.state.hakukohteenHakuaikaEntries || [];

    renderHakuaikaEditor = (hakuaika) => <HakukohteenHakuaikaEditor hakuaika={hakuaika} onChange={updateHakuaika}/>;

    renderHakuaikaEditors = () => this.getHakukohteenHakuaikaEntries().map(this.renderHakuaikaEditor);

    getHakuajanAlkamispaiva = () => this.state.hakuaika.alkamishetki.date;

    getHakuajanPaattymispaiva = () => this.state.hakuaika.paattymishetki.date;

    onClearButtonClick = () => clearSelections();

    getPoikkeavaHakukohteenHakuaika = () => this.state.poikkeavaHakukohteenHakuaika;

    togglePoikkeavaHakukohteenHakuaika = (event) => setPoikkeavaHakuaika(event.target.checked);


    renderContent = () => (
        <div className={'content'}>
            <div className={'form-column'}>
                <span
                    className={'title-span'}>Hakuaika on: {this.getHakuajanAlkamispaiva()} - {this.getHakuajanPaattymispaiva()}</span>
                <div className={'poikkeava-aikataulu row'}>
                    <input type={'checkbox'} checked={this.getPoikkeavaHakukohteenHakuaika()}
                           onChange={this.togglePoikkeavaHakukohteenHakuaika}/>
                    Hakukohteen hakuaika on eri kuin haun aikataulu
                </div>
                <div className={'hakukohteen-hakuajat'}>
                    <InfoHeader label={'Hakukohteen hakuaika'}/>
                    {this.renderHakuaikaEditors()}
                    <ActionLink label={'Lisää uusi hakuaika'} onClick={addHakuaika}/>
                </div>

            </div>
            <div className={'notification-column'}>
            </div>

        </div>
    );

}
