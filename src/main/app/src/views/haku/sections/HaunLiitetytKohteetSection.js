import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES,
  APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG
} from '../../../stores/haku/HaunLiitetytHakukohteetStore';
import {KoutaGrid} from '../../../components/KoutaGrid';

export class HaunLiitetytKohteetSection extends AbstractSection {

  getClassName = () => 'HaunLiitetytKohteetSection';

  getHeader = () => 'Liitetyt hakukohteet';

  onMount = () => connectComponent(this, {
    [APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES]: (entries) => this.setState({
      ...this.state,
      entries
    }),
    [APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG]: (gridConfig) => this.setState({
      ...this.state,
      gridColumns: gridConfig.columns
    })
  });

  getGridColumns = () => {
    return this.state.gridColumns || [];
  };

  getEntries = () => this.state.entries || [];

  renderContent = () => (
    <div className={'column'}>
      <KoutaGrid columns={this.getGridColumns()} data={this.getEntries()} pageIndex={0} pageSize={100}/>
    </div>
  );
}
