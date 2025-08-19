import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import FormHeader from './index';
import LargeStatusTag from '../StatusTag/LargeStatusTag';

export default {
  title: 'FormHeader',
};

export const Basic = () => (
  <BrowserRouter>
    <FormHeader
      title="Tutkintoon johtava koulutus"
      status={<LargeStatusTag status="saved">Julkaistu</LargeStatusTag>}
    />
  </BrowserRouter>
);
