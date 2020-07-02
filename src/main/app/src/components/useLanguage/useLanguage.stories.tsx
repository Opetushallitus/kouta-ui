import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  makeLocalisationDecorator,
  makeApiDecorator,
} from '../../storybookUtils';

import Button from '../Button';
import useLanguage from './index';
import { useTranslation } from 'react-i18next';

const Story = () => {
  const language = useLanguage();
  const { i18n } = useTranslation();

  return (
    <>
      <div>Kieli on: {language}</div>
      <Button onClick={() => i18n.changeLanguage('sv')}>Vaihda kieltä</Button>
    </>
  );
};

storiesOf('useLanguage', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Story />);
