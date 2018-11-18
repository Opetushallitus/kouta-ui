import React from 'react';
import {AbstractModalBox} from '../../../../components/AbstractModalBox';
import {connectComponent} from '../../../../utils/stateUtils';
import {
  APP_STATE_HAUN_POHJA_ENTRY_OPTIONS,
  APP_STATE_HAUN_POHJA_MODE_OPTIONS
} from '../../../../stores/haku/HaunPohjaStore';
import {SelectorButton} from '../../../../components/SelectorButton';
import {ENTITY_MODIFICATION_MODE} from '../../../../config/constants';

import {withRouter} from 'react-router-dom';
import {workflowUrlHaku, workflowUrlHakukohde} from '../../../../config/urls';
import {InfoDropdown} from '../../../../components/InfoDropdown';
import {selectWorkflow} from '../../../../stores/generic/WorkflowStore';

class ToteutuksenHautBox extends AbstractModalBox {

  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false
    };
  }

  componentDidMount = () => connectComponent(this, {
    [APP_STATE_HAUN_POHJA_MODE_OPTIONS]: (options) => this.setState({
      ...this.state,
      options
    }),
    [APP_STATE_HAUN_POHJA_ENTRY_OPTIONS]: (entryOptions) => this.setState({
      ...this.state,
      entryOptions
    })
  });

  getIcon = () => 'grid_on';

  getTitle = () => 'Haun liittäminen toteutukseen';

  redirectToHaku = () => {
    selectWorkflow(workflowUrlHaku());
    this.props.history.push(workflowUrlHaku());
  };

  redirectToHakukohde = () => {
    selectWorkflow(workflowUrlHakukohde());
    this.props.history.push(workflowUrlHakukohde());
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

  handleDropdownChange = () => {}

  renderInfoDropdown = () => this.state.dropdownVisible &&
    <InfoDropdown label={'Valitse listasta'} selection={this.getEntry()}
                  onChange={this.handleDropdownChange}
                  options={this.getEntryOptions()}/>;

  selectAction = (event) => this.hideDropdown(({
    [ENTITY_MODIFICATION_MODE.CREATE_ENTITY]: () => this.redirectToHaku(),
    [ENTITY_MODIFICATION_MODE.INHERIT_ENTITY]: () => this.showDropdown(event),
    [ENTITY_MODIFICATION_MODE.USE_ENTITY]: () => this.showDropdown(event)
  }[event]()));

  getButtonOptions = () => this.state.options || [];

  getEntryOptions = () => this.state.entryOptions || [];

  onSubmit = () => this.state.activeDropdown === ENTITY_MODIFICATION_MODE.USE_ENTITY
    ? this.redirectToHakukohde() : this.redirectToHaku();

  renderContent = () => (
    <div className={'modal-box-content'}>
      <span className={'instruction-title'}>Valitse haku, jonka haluat liittää toteutukseen.</span>
      <span className={'instruction-body'}>Voit luoda uuden haun tai liittää aiemman haun.</span>
      <div className={'row'}>
        <SelectorButton layerAlign={'left'} label={'Valitse pohja'} onSelect={this.selectAction}
                        options={this.getButtonOptions()}/>
        {this.renderInfoDropdown()}
      </div>
    </div>
  );

}

export default withRouter(ToteutuksenHautBox);
