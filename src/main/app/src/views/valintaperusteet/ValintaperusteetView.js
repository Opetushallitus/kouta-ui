import React, {Component} from 'react';
import {ValintaperusteenPohjanValintaSection} from './sections/ValintaperusteenPohjanValintaSection';
import {ValintaperusteenKohdeSection} from './sections/ValintaperusteenKohdeSection';
import {ValintaperusteenKieliversioSection} from './sections/ValintaperusteenKieliversioSection';
import {ValintaperusteenNimiSection} from './sections/ValintaperusteenNimiSection';
import {ValintaperusteenOsaamistaustaSection} from './sections/ValintaperusteenOsaamistaustaSection';
import {ValintaperusteenVahimmaisehdotSection} from './sections/ValintaperusteenVahimmaisehdotSection';
import {ValintaperusteenSoraKuvausSection} from './sections/ValintaperusteenSoraKuvausSection';
import {ValintaperusteenValintatapaSection} from './sections/ValintaperusteenValintatapaSection';
import {ValintaperusteenKielitaitovaatimuksetSection} from './sections/ValintaperusteenKielitaitovaatimuksetSection';

export class ValintaperusteetView extends Component {

  render = () => (
      <div className={"workflow-view"}>
        <ValintaperusteenKohdeSection orderNumber={"1"}/>
        <ValintaperusteenPohjanValintaSection orderNumber={'2'}/>
        <ValintaperusteenKieliversioSection orderNumber={"3"}/>
        <ValintaperusteenNimiSection orderNumber={"4"}/>
        <ValintaperusteenOsaamistaustaSection orderNumber={"5"}/>
        <ValintaperusteenVahimmaisehdotSection orderNumber={"6"}/>
        <ValintaperusteenValintatapaSection orderNumber={"7"}/>
        <ValintaperusteenKielitaitovaatimuksetSection orderNumber={"8"}/>
        <ValintaperusteenSoraKuvausSection orderNumber={"9"}/>
      </div>
  )

}
