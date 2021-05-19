import React from 'react';

import LukionLinjatField from './LukionLinjatField';

export const LukiolinjatSection = ({ name }) => {
  return <LukionLinjatField name={`${name}.lukiolinja`} />;
};
