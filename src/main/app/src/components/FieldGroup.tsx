import React from 'react';

import _ from 'lodash';

import DividerHeading from '#/src/components/DividerHeading';
import { Box } from '#/src/components/virkailija';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';

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
  name,
  required: requiredProp = false,
  ...props
}) => {
  const fieldConfig = useFieldConfig(name);
  const required = useFieldIsRequired(fieldConfig) || requiredProp;

  const headerId = _.snakeCase(title) + '_FieldGroup_header';
  const contentId = _.snakeCase(title) + '_FieldGroup_content';

  return !name || fieldConfig ? (
    <Box marginBottom={4} {...props}>
      <HeadingComponent id={headerId}>
        {title} {required ? '*' : ''}
      </HeadingComponent>
      <div id={contentId} aria-labelledby={headerId} role="region">
        {children}
      </div>
    </Box>
  ) : (
    <div></div>
  );
};

export default FieldGroup;
