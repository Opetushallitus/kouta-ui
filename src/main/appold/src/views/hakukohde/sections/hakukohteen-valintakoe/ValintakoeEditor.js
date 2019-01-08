import React, {Component} from "react";
import {TextAreaField} from "../../../../components/TextAreaField";
import {InputField} from "../../../../components/InputField";
import {DateTimeEditor} from "../../../../components/DateTimeEditor";
import {Tag} from "../../../../components/Tag";

export class ValintakoeEditor extends Component {

    getValue = (propName) => this.props.valintakoe[propName];

    onChange = (propertyName, value) => this.props.onChange({
        ...this.props.valintakoe,
        [propertyName]: value
    });

    onKatuosoiteChange = (change) => this.onChange('katuosoite', change.value);

    onPostinumeroChange = (change) => this.onChange('postinumero', change.value);

    onPostitoimipaikkaChange = (change) => this.onChange('postitoimipaikka', change.value);

    onAlkamishetkiChange = (change) => this.onChange('alkamishetki', change);

    onPaattymishetkiChange = (change) => this.onChange('paattymishetki', change);

    onLisatiedotChange = (change) => this.onChange('lisatiedot', change.value);

    getKatuosoite = () => this.getValue('katuosoite');

    getPostinumero = () => this.getValue('postinumero');

    getPostitoimipaikka = () => this.getValue('postitoimipaikka');

    getAlkamishetki = () => this.getValue('alkamishetki');

    getPaattymishetki = () => this.getValue('paattymishetki');

    getLisatiedot = () => this.getValue('lisatiedot');

    deleteValintakoe = () => this.onChange('_delete', true);

    render = () => (
        <div className={'valintakoe-editor row'}>
            <div className={'column'}>
                <InputField label={'Katuosoite'} value={this.getKatuosoite()}
                            onChange={this.onKatuosoiteChange}/>
                <div className={'row'}>
                    <InputField label={'Postinumero'} value={this.getPostinumero()}
                                onChange={this.onPostinumeroChange}/>
                    <InputField label={'Postitoimipaikka'} value={this.getPostitoimipaikka()}
                                onChange={this.onPostitoimipaikkaChange}/>
                </div>
                <div className={'date-time-row row'}>
                    <DateTimeEditor label={'Alkaa'} dateTime={this.getAlkamishetki()}
                                    onChange={this.onAlkamishetkiChange}/>
                    <DateTimeEditor label={'Päättyy'} dateTime={this.getPaattymishetki()}
                                    onChange={this.onPaattymishetkiChange}/>
                </div>
                <TextAreaField value={this.getLisatiedot()} onChange={this.onLisatiedotChange}/>
            </div>
            <Tag label={'Poista'} onClick={this.deleteValintakoe}/>
        </div>
    );
}
