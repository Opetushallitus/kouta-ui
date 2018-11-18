import React, {Component} from 'react';
import {getItemsOnPage} from '../utils/objectUtils';
import {logResult} from '../utils/logging';

export class KoutaGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      data: props.data,
      currentPageIndex: props.currentPageIndex || 0,
      pageSize: props.pageSize || 10
    };
  }

  getColumns = () => logResult(this.state.columns, 'KoutaGrid columns') || [];

  getVisibleColumns = () => this.getColumns().filter(column => column.visible);

  getSortIconName = (column) => ({
    'ASCENDING': 'arrow_drop_up',
    'DESCENDING': 'arrow_drop_down'
  }[column.sortOrder]);

  changeSortOrder = (column) => {
    //TODO: implementoi changeSortOrder
  };

  renderSortIcon = (column) => column.sortOrder && (
    <i className={'material-icons kouta-grid-header-column-sort-icon'}
       onClick={() => this.changeSortOrder(column)}
    >
      {this.getSortIconName(column)}
    </i>
  );

  renderHeaderColumn = (column) => (
    <th>
      <span className={'kouta-grid-header-column-title'}>
        {column.title}
      </span>
      {this.renderSortIcon(column)}
    </th>
  );

  getColumnByIndex = (colIndex) => this.getColumns()[colIndex];

  getData = () => this.state.data || [];

  sortData = (data) => {
    //TODO: implement data sorting;
    return [...data];
  };

  getSortedData = () => this.sortData(this.getData());

  renderCell = (dataCell, colId) => (
    <td className={'kouta-grid-data-cell'}>
      {dataCell[colId]}
    </td>
  );

  renderDataCell = (column, dataCell) => {
    const renderFunction = column.renderCell || this.renderCell;
    return renderFunction(dataCell, column.id);
  };

  renderDataItemAsRow = (dataItem) => (
    <tr className={'kouta-grid-data-row'}>
      {this.getVisibleColumns().map(column => this.renderDataCell(column, dataItem))}
    </tr>
  );

  getCurrentPageIndex = () => this.state.currentPageIndex;

  getPageSize = () => this.state.pageSize;

  getEntriesOnCurrentPage = () => {
    const sortedData = this.getSortedData();
    const currentPageIndex = this.getCurrentPageIndex();
    const pageSize = this.getPageSize();
    return getItemsOnPage(sortedData, pageSize, currentPageIndex);
  };

  renderDataRows = () => this.getEntriesOnCurrentPage().map(this.renderDataItemAsRow);

  renderHeaderRow = () => (
    <tr className={'kouta-grid-header-row'}>
      {this.getVisibleColumns().map(this.renderHeaderColumn)}
    </tr>
  );

  render = () => (
    <table className={'kouta-grid'}>
      {this.renderHeaderRow()}
      {this.renderDataRows()}
    </table>
  );
}
