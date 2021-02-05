import React, { Component } from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import Button from '#/src/components/Button';
import { makeLocalizationDecorator } from '#/src/storybookUtils';

import TableInput from './index';

const columns = [{ text: { fi: 'Hello' } }, { text: { fi: 'World' } }];
const changeAction = action('change');

const value = {
  rows: [{ columns }, { columns }],
};

class StatefulTableInput extends Component {
  constructor() {
    super();

    this.state = {
      value,
      language: 'fi',
    };
  }

  onValueChange = value => {
    changeAction(value);

    this.setState({ value });
  };

  onLanguageChange = language => {
    this.setState({ language });
  };

  render() {
    return (
      <>
        <TableInput
          value={this.state.value}
          onChange={this.onValueChange}
          language={this.state.language}
        />
        <Button
          onClick={() => {
            this.onLanguageChange('fi');
          }}
        >
          Suomeksi
        </Button>
        <Button
          onClick={() => {
            this.onLanguageChange('sv');
          }}
        >
          På svenska
        </Button>
      </>
    );
  }
}

storiesOf('TableInput', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <StatefulTableInput />);
