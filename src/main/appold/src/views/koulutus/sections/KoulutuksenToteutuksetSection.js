import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import KoulutuksenToteutuksetBox from './koulutuksen-toteutukset/KoulutuksenToteutuksetBox';

export class KoulutuksenToteutuksetSection extends AbstractSection {

    onMount = () => this.setState({
        ...this.state,
        modalBoxVisible: false
    });

    getClassName = () => 'KoulutuksenToteutuksetSection';

    getHeader = () => 'Koulutukseen liitetyt toteutukset';

    getSubmitButtonText = () => 'Liitä koulutukseen';

    showModalBox = () => this.setState({
        ...this.state,
        modalBoxVisible: true
    });

    hideModalBox = () => this.setState({
        ...this.state,
        modalBoxVisible: false
    });

    renderModalBox = () => this.state.modalBoxVisible && <KoulutuksenToteutuksetBox onCancel={this.hideModalBox}/>;

    onSubmitButtonClick = () => this.showModalBox();

    renderContent = () => (
        <div className={'content'}>
            <span className={'instruction-span'}>Tähän koulutukseen ei ole vielä liitetty toteutuksia.</span>
            {this.renderModalBox()}
        </div>
    );
}
