import React, {Component} from 'react';
import {ToteutuksenPohjanValintaSection} from './sections/ToteutuksenPohjanValintaSection';
import {ToteutuksenKieliversioSection} from './sections/ToteutuksenKieliversioSection';
import {ToteutuksenOsaamisalatSection} from './sections/ToteutuksenOsaamisalatSection';
import {ToteutuksenJarjestamistiedotSection} from './sections/ToteutuksenJarjestamistiedotSection';
import {ToteutuksenJarjestamispaikkaSection} from './sections/ToteutuksenJarjestamispaikkaSection';
import {ToteutuksenNimiSection} from './sections/ToteutuksenNimiSection';
import {ToteutuksenYhteystiedotSection} from './sections/ToteutuksenYhteystiedotSection';
import {ToteutuksenHautSection} from './sections/ToteutuksenHautSection';
import {ToteutuksenNayttamistiedotSection} from './sections/ToteutuksenNayttamistiedotSection';

export class ToteutusView extends Component {

  render = () => (
      <div className={"workflow-view"}>
          <ToteutuksenPohjanValintaSection orderNumber={"1"}/>
          <ToteutuksenKieliversioSection orderNumber={"2"}/>
          <ToteutuksenOsaamisalatSection orderNumber={"3"}/>
          <ToteutuksenJarjestamistiedotSection orderNumber={"4"}/>
          <ToteutuksenNayttamistiedotSection orderNumber={"5"}/>
          <ToteutuksenJarjestamispaikkaSection orderNumber={"6"}/>
          <ToteutuksenNimiSection orderNumber={"7"}/>
          <ToteutuksenYhteystiedotSection orderNumber={"8"}/>
          <ToteutuksenHautSection orderNumber={"9"}/>
      </div>
  )

}
