import React from 'react';
import {AbstractModalBox} from '../../../../components/AbstractModalBox';
import {connectComponent} from '../../../../utils/stateUtils';
import {InfoDropdown} from '../../../../components/InfoDropdown';
import {APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI} from "../../../../stores/hakukohde/HakukohteenAlkamiskausiStore";
import {getStatefulOptions} from "../../../../utils/optionListUtils";
import {InputField} from "../../../../components/InputField";
import {TextAreaField} from "../../../../components/TextAreaField";

export class ValintaperusteenKuvausEditorModalBox extends AbstractModalBox {

    constructor(props) {
        super(props);
        this.state = {
            lukuvuosiSelection: {},
            lukukausiSelection: {},
            nimi: '',
            kuvaus: ''
        };
    }

    componentDidMount = () => connectComponent(this, {
        [APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI]: (alkamiskausi) => this.setState({
            ...this.state,
            lukuvuosiOptions: alkamiskausi.lukuvuosiOptions,
            lukukausiOptions: alkamiskausi.lukukausiOptions,
        })
    });

    getNimi = () => this.state.nimi;

    getKuvaus = () => this.state.kuvaus;

    getLukuvuosiOptions = () => getStatefulOptions(this.state, 'lukuvuosiOptions', 'lukuvuosiSelection');

    getLukukausiOptions = () => getStatefulOptions(this.state, 'lukukausiOptions', 'lukukausiSelection');

    getTitle = () => 'Uusi valintaperustekuvaus';

    selectLukuvuosi = (selectedOption) => this.setState({
        ...this.state,
        lukuvuosiSelection: {
            [selectedOption.key]: true
        }
    });

    selectLukukausi = (selectedOption) => this.setState({
        ...this.state,
        lukukausiSelection: {
            [selectedOption.key]: true
        }
    });

    updateNimi = (change) => this.setState({
        ...this.state,
        nimi: change.value
    });

    updateKuvaus = (change) => this.setState({
        ...this.state,
        kuvaus: change.value
    });

    getSubmitText = () => 'Tallenna';

    onSubmit = (event) => this.props.onSubmit({
        lukuvuosiSelection: this.state.lukuvuosiSelection,
        lukukausiSelection: this.state.lukukausiSelection,
        nimi: this.state.nimi,
        kuvaus: this.state.kuvaus
    });

    renderContent = () => (
        <div className={'modal-box-content'}>
            <InputField label={'Kuvauksen nimi'} value={this.getNimi()} onChange={this.updateNimi}/>
            <InfoDropdown label={'Koulutuksen alkamiskausi'} options={this.getLukukausiOptions()}
                          onChange={this.selectLukukausi}/>
            <InfoDropdown label={'Koulutuksen alkamisvuosi'} options={this.getLukuvuosiOptions()}
                          onChange={this.selectLukuvuosi}/>
            <TextAreaField label={'Kirjoita valintaperustekuvaus'} value={this.getKuvaus()}
                           onChange={this.updateKuvaus}/>
        </div>
    );

}
