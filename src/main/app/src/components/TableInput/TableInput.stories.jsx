import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TableInput from './index';

const columns = [{ text: 'Hello' }, { text: 'World' }];

const value = {
  rows: [{ columns }, { columns }],
};

class StatefulTableInput extends Component {
  constructor() {
    super();

    this.state = {
      value,
    };
  }

  onValueChange = (value) => {
    this.setState({ value });
  }

  render() {
    return <TableInput value={this.state.value} onChange={this.onValueChange} />
  }
}

storiesOf('TableInput', module)
  .add('Basic', () => <StatefulTableInput />)
