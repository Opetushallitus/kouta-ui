import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    addNewHakukohteenLiite,
    APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET,
    clearSelections,
    getHakukohteenLiiteEntries,
    updateHakukohteenLiite
} from '../../../stores/hakukohde/HakukohteenTarvittavatLiitteetStore';
import {ActionLink} from "../../../components/ActionLink";
import {HakukohteenLiiteEditor} from "./hakukohteen-tarvittavat-liitteet/HakukohteenLiiteEditor";


export class HakukohteenTarvittavatLiitteetSection extends AbstractSection {

    onMount = () => connectComponent(this, {
        [APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET]: () => this.setState({...this.state})
    });

    getClassName = () => 'HakukohteenTarvittavatLiitteetSection';

    getHeader = () => 'Tarvittavat liitteet';

    renderHakukohteenLiiteEditor = (hakukohteenLiite, index) => <HakukohteenLiiteEditor key={index}
                                                                                        id={index}
                                                                                        onChange={updateHakukohteenLiite}
                                                                                        hakukohteenLiite={hakukohteenLiite}/>;

    renderHakukohteenLiiteEditors = () => getHakukohteenLiiteEntries().map(this.renderHakukohteenLiiteEditor);

    onClearButtonClick = () => clearSelections();

    renderContent = () => (
        <div className={'content'}>
            {this.renderHakukohteenLiiteEditors()}
            <ActionLink label={'Lisää uusi liite'} onClick={addNewHakukohteenLiite}/>
        </div>
    );

}
