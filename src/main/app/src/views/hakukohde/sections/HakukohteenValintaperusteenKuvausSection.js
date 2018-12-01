import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS,
    selectHakukohteenValintaperuste
} from '../../../stores/hakukohde/HakukohteenValintaperusteenKuvausStore';
import {ActionLink} from "../../../components/ActionLink";
import {InfoDropdown} from "../../../components/InfoDropdown";
import {APP_STATE_KOULUTUSKOODI_LIST} from "../../../stores/koulutus/KoulutuskoodiListStore";
import {getStatefulOptions} from "../../../utils/optionListUtils";

export class HakukohteenValintaperusteenKuvausSection extends AbstractSection {

    onMount = () => connectComponent(this, {
        [APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS]: (incomingState) => this.setState({
            ...this.state,
            ...incomingState
        }),
        [APP_STATE_KOULUTUSKOODI_LIST]: (incomingState) => this.setState({
            ...this.state,
            koulutusOptions: incomingState.koulutusOptions
        })
    });

    getSelections = () => this.state.valintaperusteSelections || [];

    getKoulutusOptions = () => getStatefulOptions((this.state.koulutusOptions || []), this.getSelections());

    getClassName = () => 'HakukohteenValintaperusteenKuvausSection';

    getHeader = () => 'Valintaperusteen kuvaus';

    createNewKuvaus = () => {};

    renderContent = () => (
        <div className={'content'}>
            <div className={'tutkinto-column'}>
                <InfoDropdown label={'Valitse kuvaus'} options={this.getKoulutusOptions()} onChange={selectHakukohteenValintaperuste}/>
                <ActionLink label={'Luo uusi kuvaus'} onClick={this.createNewKuvaus}/>
            </div>
            <div className={'kuvaus-column'}>
            </div>
        </div>
    );

}
