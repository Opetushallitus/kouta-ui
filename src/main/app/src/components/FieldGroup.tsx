import React, { ReactNode } from 'react';

import _ from 'lodash';
import { SpaceProps } from 'styled-system';

import Heading from '#/src/components/Heading';
import { Box } from '#/src/components/virkailija';

type FieldGroupProps = {
  title: string;
  HeadingComponent?: React.ComponentType;
  name?: string;
  required?: boolean;
  children: ReactNode;
} & SpaceProps;

const DefaultHeadingComponent = ({ children, ...props }) => (
  <Heading hasDivider {...props}>
    {children}
  </Heading>
);

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  children,
  HeadingComponent = DefaultHeadingComponent,
  required = false,
  ...props
}) => {
  const headerId = _.snakeCase(title) + '_FieldGroup_header';
  const contentId = _.snakeCase(title) + '_FieldGroup_content';

  return (
    <Box marginBottom={4} {...props}>
      <HeadingComponent id={headerId}>
        {title} {required ? '*' : ''}
      </HeadingComponent>
      <div id={contentId} aria-labelledby={headerId} role="region">
        {children}
      </div>
    </Box>
  );
};
