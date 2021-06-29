import React from 'react';

import _ from 'lodash';

import DividerHeading from '#/src/components/DividerHeading';
import { Box } from '#/src/components/virkailija';

type FieldGroupProps = {
  title: string;
  HeadingComponent?: React.ComponentType;
  name?: string;
  required?: boolean;
};

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  children,
  HeadingComponent = DividerHeading,
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
