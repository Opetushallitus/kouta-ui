import React, {Component} from 'react';
import MultiStepIndicator from './header/MultiStepIndicator';
import {StatusBar} from './header/StatusBar';

export class Header extends Component {

  render = () => (
      <div className={"header"}>
        <StatusBar/>
        <MultiStepIndicator/>
        <div className={"button-container button-container-right organisaatio-div"}>
              Organisaatio: Salpaus
        </div>
      </div>
    )
}
