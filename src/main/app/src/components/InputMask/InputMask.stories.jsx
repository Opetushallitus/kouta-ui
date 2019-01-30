import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import InputMask from './index';

class StatefulInputMask extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
    };
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    return this.props.children({
      value: this.state.value,
      onChange: this.onChange,
    });
  };
}

storiesOf('InputMask', module).add('Basic', () => (
  <StatefulInputMask>
    {({ value, onChange }) => (
      <InputMask mask="99.99.9999" placeholder="pp.kk.vvvv" value={value} onChange={onChange} />
    )}
  </StatefulInputMask>
));
