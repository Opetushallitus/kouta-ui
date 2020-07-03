import React from 'react';
import { storiesOf } from '@storybook/react';
import { useTranslation } from 'react-i18next';

import {
  makeLocalizationDecorator,
  makeApiDecorator,
} from '#/src/storybookUtils';

import Button from '#/src/components/Button';
import useLanguage from './index';

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
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Story />);
