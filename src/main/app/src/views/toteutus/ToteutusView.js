import React, {Component} from 'react';
import {ToteutuksenPohjanValintaSection} from './sections/ToteutuksenPohjanValintaSection';
import {ToteutuksenKieliversioSection} from './sections/ToteutuksenKieliversioSection';
import {OsaamisalaSection} from './sections/OsaamisalaSection';
import {ToteutuksenJarjestamistiedotSection} from './sections/ToteutuksenJarjestamistiedotSection';
import {JarjestamispaikkaSection} from './sections/JarjestamispaikkaSection';
import {ToteutuksenNimiSection} from './sections/ToteutuksenNimiSection';
import {ToteutuksenYhteystiedotSection} from './sections/ToteutuksenYhteystiedotSection';
import {ToteutuksenHautSection} from './sections/ToteutuksenHautSection';
import {KoulutuksenNayttamistiedotSection} from './sections/KoulutuksenNayttamistiedotSection';

export class ToteutusView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <ToteutuksenPohjanValintaSection orderNumber={"1"}/>
          <ToteutuksenKieliversioSection orderNumber={"2"}/>
          <OsaamisalaSection orderNumber={"3"}/>
          <ToteutuksenJarjestamistiedotSection orderNumber={"4"}/>
          <KoulutuksenNayttamistiedotSection orderNumber={"5"}/>
          <JarjestamispaikkaSection orderNumber={"6"}/>
          <ToteutuksenNimiSection orderNumber={"7"}/>
          <ToteutuksenYhteystiedotSection orderNumber={"8"}/>
          <ToteutuksenHautSection orderNumber={"9"}/>
      </div>
  )

}
