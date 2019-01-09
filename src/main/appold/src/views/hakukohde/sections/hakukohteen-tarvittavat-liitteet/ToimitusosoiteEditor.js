import React, {Component} from "react";
import {InputField} from "../../../../components/InputField";

export class ToimitusosoiteEditor extends Component {

    getValue = (propName) => this.props.toimitusosoite[propName];

    onChange = (propertyName, value) => this.props.onChange({
        ...this.props.toimitusosoite,
        [propertyName]: value
    });

    onJarjestajanNimiChange = (change) => this.onChange('jarjestajanNimi', change.value);
    onKatuosoiteChange = (change) => this.onChange('katuosoite', change.value);
    onPostinumeroChange = (change) => this.onChange('postinumero', change.value);
    onPostitoimipaikkaChange = (change) => this.onChange('postitoimipaikka', change.value);
    onSahkopostiChange = (change) => this.onChange('sahkoposti', change.value);

    render = () => (
        <div className={'toimitusosoite-editor'}>
            <InputField label={'Järjestästäjän nimi'} value={this.getValue('jarjestajanNimi')}
                        onChange={this.onJarjestajanNimiChange}/>
            <InputField label={'Katuosoite'} value={this.getValue('katuosoite')}
                        onChange={this.onKatuosoiteChange}/>
            <InputField label={'Postinumero'} value={this.getValue('postinumero')}
                        onChange={this.onPostinumeroChange}/>
            <InputField label={'Postitoimipaikka'} value={this.getValue('postitoimipaikka')}
                        onChange={this.onPostitoimipaikkaChange}/>
            <InputField label={'Sähköposti'} value={this.getValue('sahkoposti')}
                        onChange={this.onSahkopostiChange}/>
        </div>
    );
}
