import React, { Component } from 'react';

import { action } from '@storybook/addon-actions';

import { FormButton } from '#/src/components/FormButton';

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
        <FormButton
          onClick={() => {
            this.onLanguageChange('fi');
          }}
        >
          Suomeksi
        </FormButton>
        <FormButton
          onClick={() => {
            this.onLanguageChange('sv');
          }}
        >
          På svenska
        </FormButton>
      </>
    );
  }
}

export default {
  title: 'TableInput',
};

export const Basic = () => <StatefulTableInput />;
