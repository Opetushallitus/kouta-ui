import React, {Component} from 'react';
import {StatusBar} from './StatusBar';
import {MultiStepBar} from './MultiStepBar';
import {Accordion} from './Accordion';
import {FooterActionButtons} from './FooterActionButtons';

export class KoulutusPublicationView extends Component {

  render = () => (
      <div className={"koulutus-publication-view"}>
        <StatusBar/>
        <MultiStepBar/>
        <Accordion/>
        <FooterActionButtons/>
      </div>
  )

}