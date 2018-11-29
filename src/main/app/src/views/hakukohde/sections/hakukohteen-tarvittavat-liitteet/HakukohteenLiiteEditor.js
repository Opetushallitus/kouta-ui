import React, {Component} from "react";
import {ContentfulOptionRenderer} from "../../../../components/ContentfulOptionSelector";
import {DateTimeEditor} from "../../../../components/DateTimeEditor";
import {TextAreaField} from "../../../../components/TextAreaField";
import {InputField} from "../../../../components/InputField";
import {InfoDropdown} from "../../../../components/InfoDropdown";
import {ToimitusosoiteEditor} from "./ToimitusosoiteEditor";
import {getActiveOption, updateSingleSelectionOptionActivation} from "../../../../utils/optionListUtils";

export class HakukohteenLiiteEditor extends Component {

    getValue = (propName) => this.props.hakukohteenLiite[propName];

    onChange = (propertyName, value) => this.props.onChange({
        ...this.props.hakukohteenLiite,
        [propertyName]: value
    });

    onLiitteenKuvausChange = (change) => this.onChange('liitteenKuvaus', change.value);

    onLiitteenNimiChange = (change) => this.onChange('liitteenNimi', change.value);

    onSamaOsoiteCheckoxChange = (event) => this.onChange('samaOsoiteKaikissaLiitteissa', event.target.checked);

    onLiitteenTakarajaChange = (change) => this.onChange('liitteenTakaraja', change);

    onVaihtoehtoinenToimitusosoiteChange = (change) => this.onChange('vaihtoehtoinenToimitusosoite', change);

    selectOption = (optionsName, option) => this.props.onChange({
        ...this.props.hakukohteenLiite,
        [optionsName]: updateSingleSelectionOptionActivation(this.getValue(optionsName), option)
    });

    selectToimitusosoiteOption = (option) => this.selectOption('toimitusosoiteOptions', option);

    selectLiitteenTyyppiOption = (option) => this.selectOption('liitteenTyyppiOptions', option);

    renderToimitusosoiteOptionContent = (address) => (
        <div className={'toimitusosoite-option-content'}>
            <span>{address.jarjestajanNimi}</span>
            <span>{address.katuosoite}, {address.postinumero} {address.postitoimipaikka}</span>
            <span>sähköpostiosoite: {address.sahkoposti}</span>
        </div>
    );

    getToimitusosoiteOptions = () => this.getValue('toimitusosoiteOptions');

    getVaihtoehtoinenToimitusosoite = () => this.getValue('vaihtoehtoinenToimitusosoite');

    getActiveToimitusosoiteOption = () => getActiveOption(this.getToimitusosoiteOptions()) || {};

    isVaihtoehtoinenToimitusosoiteSelected = () => this.getActiveToimitusosoiteOption().key === 'vaihtoehtoinen-toimitusosoite';

    renderVaihtoehtoinenToimitusosoiteEditor = () => this.isVaihtoehtoinenToimitusosoiteSelected() && (
        <ToimitusosoiteEditor toimitusosoite={this.getVaihtoehtoinenToimitusosoite()}
                              onChange={this.onVaihtoehtoinenToimitusosoiteChange}/>
    );

    render = () => (
        <div key={this.props.id} className={'hakukohteen-liite-editor'}>
            <InfoDropdown label={'Liitteen tyyppi'} options={this.getValue('liitteenTyyppiOptions')}
                          onChange={this.selectLiitteenTyyppiOption}/>
            <InputField label={'Liitteen nimi'} value={this.getValue('liitteenNimi')}
                        onChange={this.onLiitteenNimiChange}/>
            <TextAreaField label={'Kuvaus'} value={this.getValue('liitteenKuvaus')}
                           onChange={this.onLiitteenKuvausChange}/>
            <DateTimeEditor dateTime={this.getValue('liitteenTakaraja')} onChange={this.onLiitteenTakarajaChange}/>
            <div className={'osoitteet'}>
                <ContentfulOptionRenderer label={'Toimitusosoite'}
                                          renderContent={this.renderToimitusosoiteOptionContent}
                                          options={this.getToimitusosoiteOptions()}
                                          onChange={this.selectToimitusosoiteOption}/>
                <input type={'checkbox'} onChange={this.onSamaOsoiteCheckoxChange}/>Käytä samaa osoiteta kaikissa
                liitteissä
            </div>
            {this.renderVaihtoehtoinenToimitusosoiteEditor()}
            <hr/>
        </div>
    );
}
