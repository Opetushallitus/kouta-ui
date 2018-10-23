import React, {Component} from 'react';
import {HaunPohjanValintaSection} from './sections/HaunPohjanValintaSection';
import {HaunKieliversioSection} from './sections/HaunKieliversioSection';
import {HaunNimiSection} from './sections/HaunNimiSection';
import {HaunKohdejoukkoSection} from './sections/HaunKohdejoukkoSection';
import {HakutapaSection} from './sections/HakutapaSection';
import {HaunAikataulutSection} from './sections/HaunAikataulutSection';
import {HakulomakkeenValintaSection} from './sections/HakulomakkeenValintaSection';
import {HaunYhteystiedotSection} from './sections/HaunYhteystiedotSection';
import {HaunLiitetytKohteetSection} from './sections/HaunLiitetytKohteetSection';

export class HakuView extends Component {

  render = () => (
      <div className={"workflow-view"}>
        <HaunPohjanValintaSection orderNumber={"1"}/>
        <HaunKieliversioSection orderNumber={"2"}/>
        <HaunNimiSection orderNumber={"3"}/>
        <HaunKohdejoukkoSection orderNumber={"4"}/>
        <HakutapaSection orderNumber={"5"}/>
        <HaunAikataulutSection orderNumber={"6"}/>
        <HakulomakkeenValintaSection orderNumber={"7"}/>
        <HaunYhteystiedotSection orderNumber={"8"}/>
        <HaunLiitetytKohteetSection orderNumber={"9"}/>
      </div>
  )

}
