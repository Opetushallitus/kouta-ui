import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {
  APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES,
  APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG, deselectRows, toggleHakukohdeActive, updateColumns
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

  handleClearButtonClick = () => deselectRows();

  toggleCellSelection = (event) => toggleHakukohdeActive(event.target.getAttribute('data-id'));

  getRenderFunctionByColumnId = (columnId) => ({
    'nimi':  (dataItem, colId) => (
      <td className={'kouta-grid-data-cell hakukohde-cell'} data-id={dataItem.oid} onClick={this.toggleCellSelection}>
        {dataItem[colId]}
      </td>
    )
  }[columnId]);


  appendRenderFunction = (column) => ({
    ...column,
    renderCell: this.getRenderFunctionByColumnId(column.id)
  })

  getGridColumns = () => {
    return (this.state.gridColumns || []).map(this.appendRenderFunction);
  };

  onColumnChange = (columns) => updateColumns(columns);

  getEntries = () => this.state.entries || [];

  renderContent = () => (
    <div className={'content'}>
      <span>Tämä haku on liitetty seuraaviin hakukohteisiin</span>
      <KoutaGrid columns={this.getGridColumns()}
                 onColumnChange={this.onColumnChange}
                 data={this.getEntries()}
                 pageIndex={0}
                 pageSize={100}/>
    </div>
  );
}
