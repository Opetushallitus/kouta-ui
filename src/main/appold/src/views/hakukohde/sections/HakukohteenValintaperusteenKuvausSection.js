import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
    APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS,
    createValintaperusteenKuvaus,
    selectHakukohteenValintaperuste
} from '../../../stores/hakukohde/HakukohteenValintaperusteenKuvausStore';
import {ActionLink} from "../../../components/ActionLink";
import {InfoDropdown} from "../../../components/InfoDropdown";
import {APP_STATE_KOULUTUSKOODI_LIST} from "../../../stores/koulutus/KoulutuskoodiListStore";
import {getStatefulOptions} from "../../../utils/optionListUtils";
import {ValintaperusteenKuvausEditorModalBox} from "./hakukohteen-valintaperusteen-kuvaus/ValintaperusteenKuvausEditorModalBox";

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

    getKoulutusOptions = () => getStatefulOptions(this.state, 'koulutusOptions', 'valintaperusteSelection');

    getClassName = () => 'HakukohteenValintaperusteenKuvausSection';

    getHeader = () => 'Valintaperusteen kuvaus';

    createNewKuvaus = () => {};

    showModalBox = () => this.setState({
        ...this.state,
        modalBoxVisible: true
    });

    hideModalBox = () => this.setState({
        ...this.state,
        modalBoxVisible: false
    });

    onModalBoxSubmit = (newValintaperusteenKuvaus) => {
        this.hideModalBox();
        createValintaperusteenKuvaus(newValintaperusteenKuvaus);
    };

    renderModalBox = () => this.state.modalBoxVisible &&
        <ValintaperusteenKuvausEditorModalBox onSubmit={this.onModalBoxSubmit} onCancel={this.hideModalBox}/>;

    renderContent = () => (
        <div className={'content'}>
            <div className={'tutkinto-column'}>
                <InfoDropdown label={'Valitse kuvaus'} options={this.getKoulutusOptions()} onChange={selectHakukohteenValintaperuste}/>
                <ActionLink label={'Luo uusi kuvaus'} onClick={this.showModalBox}/>
            </div>
            <div className={'kuvaus-column'}>
            </div>
            {this.renderModalBox()}
        </div>
    );

}
