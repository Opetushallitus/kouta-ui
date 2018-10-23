import React, {Component} from 'react';
import {PohjanValintaSection} from './sections/PohjanValintaSection';
import {ToteutuksenKieliversioSection} from './sections/ToteutuksenKieliversioSection';
import {OsaamisalaSection} from './sections/OsaamisalaSection';
import {ToteutuksenJarjestamistiedotSection} from './sections/ToteutuksenJarjestamistiedotSection';
import {JarjestamispaikkaSection} from './sections/JarjestamispaikkaSection';
import {ToteutuksenNimiSection} from './sections/ToteutuksenNimiSection';
import {KoulutuksenYhteystiedotSection} from './sections/KoulutuksenYhteystiedotSection';
import {ToteutuksenHautSection} from './sections/ToteutuksenHautSection';
import {KoulutuksenNayttamistiedotSection} from './sections/KoulutuksenNayttamistiedotSection';

export class KoulutuksenToteutusView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <PohjanValintaSection orderNumber={"1"}/>
          <ToteutuksenKieliversioSection orderNumber={"2"}/>
          <OsaamisalaSection orderNumber={"3"}/>
          <ToteutuksenJarjestamistiedotSection orderNumber={"4"}/>
          <KoulutuksenNayttamistiedotSection orderNumber={"5"}/>
          <JarjestamispaikkaSection orderNumber={"6"}/>
          <ToteutuksenNimiSection orderNumber={"7"}/>
          <KoulutuksenYhteystiedotSection orderNumber={"8"}/>
          <ToteutuksenHautSection orderNumber={"9"}/>
      </div>
  )
}
