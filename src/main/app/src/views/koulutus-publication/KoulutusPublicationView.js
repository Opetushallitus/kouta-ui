import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepIndicator} from './MultiStepIndicator';
import {Accordion} from './Accordion';
import {FooterActionButtons} from './FooterActionButtons';

export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"koulutus-publication-view"}>
        <StatusBar/>
        <MultiStepIndicator/>
        <Accordion/>
        <FooterActionButtons/>
      </div>
  )

}