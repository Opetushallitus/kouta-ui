//TODO: check if AbstractModalBox can be reasonably replaced with composition pattern & compare pros and cons of both approaches.

import React from 'react';
import {AbstractModalBox} from '../../../../components/AbstractModalBox';

export class HaunLiitetytKohteetBox extends AbstractModalBox {

  getTitle = () => 'Hakukohteen liittäminen hakuun';

  getIcon = () => 'grid_on';

  renderContent = () => (
      <div className={'modal-box-content'}>
        <span className={'instruction-span'}>Valitse haku, jonka haluat liittää toteutukseen.</span>
        <div className={'row'}>
          <h1>Valitse liitettävät hakukohteet</h1>
        </div>
      </div>
  );
}
