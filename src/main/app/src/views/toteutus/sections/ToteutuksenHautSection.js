import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import ToteutuksenHautBox from './toteutuksen-haut/ToteutuksenHautBox';

export class ToteutuksenHautSection extends AbstractSection {

  onMount = () => this.setState({
    ...this.state,
    modalBoxVisible: false
  });

  getClassName = () => 'ToteutuksenHautSection';

  getHeader = () => 'Toteutukseen liitetyt haut';

  getSubmitButtonText = () => 'Liitä hakuun';

  showModalBox = () => this.setState({
    ...this.state,
    modalBoxVisible: true
  });

  hideModalBox = () => this.setState({
    ...this.state,
    modalBoxVisible: false
  });

  renderModalBox = () => this.state.modalBoxVisible && <ToteutuksenHautBox onCancel={this.hideModalBox}/>;

  onSubmitButtonClick = () => this.showModalBox();

  renderContent = () => (
    <div className={'content'}>
      {this.renderModalBox()}
    </div>
  );
}
