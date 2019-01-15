import React, { Component } from 'react';

import LanguageTabs from './LanguageTabs';
import Spacing from '../Spacing';

class LanguageSelector extends Component {
  static defaultProps = {
    children: () => null,
    languages: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  onChange = value => {
    this.setState({
      value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    const { languages } = props;

    if (languages.length === 0) {
      return null;
    }

    const active = languages.find(({ value }) => value === state.value);

    if (active) {
      return null;
    }

    return { value: languages[0].value };
  }

  render() {
    const { languages, children } = this.props;
    const { value } = this.state;

    return (
      <>
        <LanguageTabs
          onChange={this.onChange}
          value={value}
          languages={languages}
        />
        <Spacing paddingTop={2}>{value ? children({ value }) : null}</Spacing>
      </>
    );
  }
}

export default LanguageSelector;
