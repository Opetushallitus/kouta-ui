import React, {Component} from 'react';
import {HakukohteenPohjakoulutusvaatimusSection} from './sections/HakukohteenPohjakoulutusvaatimusSection';
import {HakukohteenKieliversioSection} from './sections/HakukohteenKieliversioSection';
import {HakukohteenPerustiedotSection} from './sections/HakukohteenPerustiedotSection';
import {HakukohteenHakuajatSection} from './sections/HakukohteenHakuajatSection';
import {HakukohteenLomakeSection} from './sections/HakukohteenLomakeSection';
import {HakukohteenAlkamiskausiSection} from './sections/HakukohteenAlkamiskausiSection';
import {HakukohteenAloituspaikatSection} from './sections/HakukohteenAloituspaikatSection';
import {HakukohteenValintaperusteenKuvausSection} from './sections/HakukohteenValintaperusteenKuvausSection';
import {HakukohteenValintakoeSection} from './sections/HakukohteenValintakoeSection';
import {HakukohteenTarvittavatLiitteetSection} from './sections/HakukohteenTarvittavatLiitteetSection';

export class HakukohdeView extends Component {

  render = () => (
      <div className={"workflow-view"}>
        <HakukohteenKieliversioSection orderNumber={"1"}/>
        <HakukohteenPohjakoulutusvaatimusSection orderNumber={"2"}/>
        <HakukohteenPerustiedotSection orderNumber={'3'}/>
        <HakukohteenHakuajatSection orderNumber={"4"}/>
        <HakukohteenLomakeSection orderNumber={"5"}/>
        <HakukohteenAlkamiskausiSection orderNumber={"6"}/>
        <HakukohteenAloituspaikatSection orderNumber={"7"}/>
        <HakukohteenValintaperusteenKuvausSection orderNumber={"8"}/>
        <HakukohteenValintakoeSection orderNumber={"9"}/>
        <HakukohteenTarvittavatLiitteetSection orderNumber={'10'}/>
      </div>
  )

}
