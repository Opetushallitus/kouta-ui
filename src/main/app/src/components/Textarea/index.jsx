import React from 'react';
import styled from 'styled-components';

import { InputBase } from '../Input';

const TextareaBase = styled(InputBase).attrs({ as: 'textarea' })``;

const Textarea = ({ rows = 3, ...props }) => (
  <TextareaBase rows={rows} {...props} />
);

export default Textarea;
