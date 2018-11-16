import React from 'react';
import {AbstractModalBox} from '../../../../components/AbstractModalBox';

export class ToteutuksenHautBox extends AbstractModalBox {

  getIcon = () => 'grid_on';

  getTitle = () => 'Haun liittäminen toteutukseen';

  renderContent = () => (
    <div className={'modal-box'}>
      Toteutuksen haut Modal Box
    </div>
  );

}
