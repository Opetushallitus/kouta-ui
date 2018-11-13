import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {DateTimeEditor} from '../../../components/DateTimeEditor';
import {InfoHeader} from '../../../components/InfoHeader';

export class HaunAikataulutSection extends AbstractSection {

  getClassName = () => 'HaunAikataulutSection';

  getHeader = () => 'Haun aikataulut';

  changeHakuajanAlku = (event) => {}

  changeHakuajanLoppu = (event) => {}

  changeHakukohteenPerumisenTakaraja = (event) => {}

  changeHakukohteenMuokkauksenTakaraja = (event) => {}

  renderContent = () => (
    <div className={'content'}>
      <InfoHeader label={'Hakuaika'}/>

      <div className={'hakuaika-editors'}>
        <DateTimeEditor label={'Alkaa'} onChange={this.changeHakuajanAlku}/>
        <DateTimeEditor label={'Päättyy'} onChange={this.changeHakuajanLoppu}/>
      </div>

      <div className={'add-hakuaika'}>
        <i className={'material-icons'}></i>
        <label className={'add-hakuaika-link'}>Lisää uusi hakuaika</label>
      </div>

      <InfoHeader label={'Hakukohteen lisäämisen ja perumisen takaraja'}  />

      <DateTimeEditor onChange={this.changeHakukohteenPerumisenTakaraja}/>

      <InfoHeader label={'Hakukohteen muokkauksen takaraja'} />

      <DateTimeEditor onChange={this.changeHakukohteenMuokkauksenTakaraja}/>

    </div>
  );

}
