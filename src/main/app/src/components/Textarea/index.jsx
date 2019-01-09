import React from 'react';
import styled from 'styled-components';

import Input from '../Input';

const TextareaBase = styled(Input).attrs({ as: 'textarea' })``;

const Textarea = ({ rows = 3, ...props }) => (
  <TextareaBase rows={rows} {...props} />
);

export default Textarea;
