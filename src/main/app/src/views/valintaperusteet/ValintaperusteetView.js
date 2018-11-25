import React, {Component} from 'react';
import {ValintaperusteenPohjaSection} from './sections/ValintaperusteenPohjanValintaSection';
import {ValintaperusteenKohdeSection} from './sections/ValintaperusteenKohdeSection';
import {ValintaperusteenKieliversioSection} from './sections/ValintaperusteenKieliversioSection';
import {ValintaperusteenNimiSection} from './sections/ValintaperusteenNimiSection';
import {ValintaperusteenOsaamistaustaSection} from './sections/ValintaperusteenOsaamistaustaSection';
import {ValintaperusteenVahimmaisehdotSection} from './sections/ValintaperusteenVahimmaisehdotSection';
import {ValintaperusteenSoraKuvausSection} from './sections/ValintaperusteenSoraKuvausSection';
import {ValintaperusteenValintatapaSection} from './sections/ValintaperusteenValintatapaSection';
import {ValintaperusteenKielitaitovaatimuksetSection} from './sections/ValintaperusteenKielitaitovaatimuksetSection';
import {ValintaperusteenHakutapaSection} from './sections/ValintaperusteenHakutapaSection';

export class ValintaperusteetView extends Component {

  render = () => (
      <div className={"workflow-view"}>
        <ValintaperusteenKieliversioSection orderNumber={'1'}/>
        <ValintaperusteenPohjaSection orderNumber={'2'}/>
        <ValintaperusteenHakutapaSection orderNumber={'3'}/>
        <ValintaperusteenKohdeSection orderNumber={'4'}/>
        <ValintaperusteenNimiSection orderNumber={'5'}/>
        <ValintaperusteenOsaamistaustaSection orderNumber={'6'}/>
        <ValintaperusteenVahimmaisehdotSection orderNumber={'7'}/>
        <ValintaperusteenValintatapaSection orderNumber={'8'}/>
        <ValintaperusteenKielitaitovaatimuksetSection orderNumber={'9'}/>
        <ValintaperusteenSoraKuvausSection orderNumber={'10'}/>
      </div>
  )

}
