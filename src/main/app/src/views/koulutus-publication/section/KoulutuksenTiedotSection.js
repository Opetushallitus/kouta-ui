import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';

export class KoulutuksenTiedotSection extends AbstractSection {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getHeader = () => "3 Koulutuksen tiedot";

}