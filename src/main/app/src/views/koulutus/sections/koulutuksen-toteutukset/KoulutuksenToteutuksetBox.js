import React from 'react';
import {AbstractModalBox} from '../../../../components/AbstractModalBox';
import {connectComponent} from '../../../../utils/stateUtils';
import {SelectorButton} from '../../../../components/SelectorButton';
import {ENTITY_MODIFICATION_MODE} from '../../../../config/constants';

import {withRouter} from 'react-router-dom';
import {InfoDropdown} from '../../../../components/InfoDropdown';
import {selectWorkflow} from '../../../../stores/generic/WorkflowStore';
import {
    APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS,
    APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS
} from "../../../../stores/koulutus/KoulutuksenPohjaStore";

class KoulutuksenToteutuksetBox extends AbstractModalBox {

    constructor(props) {
        super(props);
        this.state = {
            dropdownVisible: false
        };
    }

    componentDidMount = () => connectComponent(this, {
        [APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS]: (options) => this.setState({
            ...this.state,
            options
        }),
        [APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS]: (entryOptions) => this.setState({
            ...this.state,
            entryOptions
        })
    });

    getIcon = () => 'grid_on';

    getTitle = () => 'Toteutuksen liittäminen koulutukseen';

    redirectToToteutus = () => {
        selectWorkflow('/toteutus');
        this.props.history.push('/toteutus');
    };

    redirectToHaku = () => {
        selectWorkflow('/haku');
        this.props.history.push('/haku');
    };

    getEntry = () => this.state.entry;

    showDropdown = (event) => this.setState({
        ...this.state,
        dropdownVisible: true,
        activeDropdown: event
    });

    hideDropdown = (callback) => this.setState({
        ...this.state,
        dropdownVisible: true
    }, callback);

    //TODO: replace this with state update in store when the desired functionality has been confirmed.
    handleDropdownChange = () => {
    };

    renderInfoDropdown = () => this.state.dropdownVisible &&
        <InfoDropdown label={'Valitse listasta'} selection={this.getEntry()}
                      onChange={this.handleDropdownChange}
                      options={this.getEntryOptions()}/>;

    selectAction = (event) => this.hideDropdown(({
        [ENTITY_MODIFICATION_MODE.CREATE_ENTITY]: () => this.redirectToToteutus(),
        [ENTITY_MODIFICATION_MODE.INHERIT_ENTITY]: () => this.showDropdown(event),
        [ENTITY_MODIFICATION_MODE.USE_ENTITY]: () => this.showDropdown(event)
    }[event]()));

    getButtonOptions = () => this.state.options || [];

    getEntryOptions = () => this.state.entryOptions || [];

    onSubmit = () => this.state.activeDropdown === ENTITY_MODIFICATION_MODE.USE_ENTITY
        ? this.redirectToHaku() : this.redirectToToteutus();

    renderContent = () => (
        <div className={'modal-box-content'}>
            <span className={'instruction-title'}>Valitse toteutus, jonka haluat liittää koulutukseen.</span>
            <span className={'instruction-body'}>Voit luoda uuden toteutuksen tai liittää aiemman toteutuksen.</span>
            <div className={'row'}>
                <SelectorButton layerAlign={'left'} label={'Valitse pohja'} onSelect={this.selectAction}
                                options={this.getButtonOptions()}/>
                {this.renderInfoDropdown()}
            </div>
        </div>
    );
}

export default withRouter(KoulutuksenToteutuksetBox);
