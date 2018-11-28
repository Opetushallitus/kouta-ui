import {sortBy} from 'lodash';
import React, {Component} from 'react';

const classNames = require('classnames');

//TODO: tarkistetaan voisiko toteuttaa jostakin kirjastosta tulevalla komponentilla.
export class KoutaGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: props.currentPageIndex || 0,
      pageSize: props.pageSize || 10
    };
  }

  getColumns = () => this.props.columns || [];

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
    this.props.onColumnChange(columns);
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
      <span className={'header-column-title'}>
        {column.title}
      </span>
      {this.renderSortIcon(column)}
    </th>
  );

  getColumnsSortedBySortIndex = () => sortBy(this.getVisibleColumns(), 'sortIndex', 'asc');

  getData = () => this.props.data || [];

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
    <td className={'data-cell'}>
      {dataItem[colId]}
    </td>
  );

  renderDataCell = (column, dataCell) => {
    const renderFunction = column.renderCell || this.renderCell;
    return renderFunction(dataCell, column.id);
  };

  getRowClass = (dataItem) => dataItem.active && 'active';

  renderDataItemAsRow = (dataItem, index) => (
    <tr key={index} className={classNames('data-row', this.getRowClass(dataItem))}>
      {this.getVisibleColumns().map(column => this.renderDataCell(column, dataItem))}
    </tr>
  );

    renderDataRows = () => this.getSortedData().map(this.renderDataItemAsRow);

  renderHeaderRow = () => (
    <tr className={'header-row'}>
      {this.getVisibleColumns().map(this.renderHeaderColumn)}
    </tr>
  );

  render = () => (
    <table className={'kouta-grid'}>
      <tbody>
      {this.renderHeaderRow()}
      {this.renderDataRows()}
      </tbody>
    </table>
  );
}
