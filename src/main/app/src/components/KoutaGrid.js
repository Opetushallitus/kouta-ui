import {sortBy} from 'lodash';
import React, {Component} from 'react';
import {getItemsOnPage} from '../utils/objectUtils';

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

  getColumns = () => this.state.columns;

  getVisibleColumns = () => this.getColumns().filter(column => column.visible);

  getSortIconName = (column) => ({
    'asc': 'arrow_drop_down',
    'desc': 'arrow_drop_up'
  }[column.sortDirection]);

  changeSortOrder = (changeColumn) => {
    const sortDirection = changeColumn.sortDirection || 'asc';
    const newsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    const columns = this.getColumns().map(column => column.id === changeColumn.id ? ({
      ...column,
      sortDirection: newsortDirection,
      sortIndex: 0
    }) : ({
      ...column,
      sortIndex: column.sortIndex + 1
    }));
    this.setState({
      ...this.state,
      columns
    });
  };

  renderSortIcon = (column) => column.sortDirection && (
    <i className={'material-icons column-sort-icon'}
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

  getColumnsSortedBySortIndex = () => sortBy(this.getVisibleColumns(), 'sortIndex', 'asc');

  getData = () => this.state.data || [];

  sortData = (data) => {
    const columns = this.getColumnsSortedBySortIndex();
    return this.sortAlphabetically(data, columns[0]);
  };

  //TODO: implement sort based on multiple fields
  sortAlphabetically = (array, column) => array.sort((a, b) => {
    const sortDirectionAmplifier = column.sortDirection === 'desc' ? -1 : 1;
    const nameA = a[column.id].toLowerCase();
    const nameB = b[column.id].toLowerCase();
    if (nameA < nameB) {
      return -1 * sortDirectionAmplifier;
    }
    if (nameA > nameB) {
      return 1 * sortDirectionAmplifier;
    }
    return 0;
  });

  getSortedData = () => this.sortData(this.getData());

  renderCell = (dataItem, colId) => (
    <td className={'kouta-grid-data-cell'}>
      {dataItem[colId]}
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
