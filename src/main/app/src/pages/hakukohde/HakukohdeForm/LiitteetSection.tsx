import React from 'react';

import { LiitteetFields } from './LiitteetFields';

export const LiitteetSection = ({ language, name, organisaatioOid }) => (
  <LiitteetFields
    name={name}
    language={language}
    organisaatioOid={organisaatioOid}
  />
);
