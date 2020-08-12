import React from 'react';
import { Box } from '#/src/components/virkailija';
import DividerHeading from '#/src/components/DividerHeading';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';

export const FieldGroup = ({
  title,
  children,
  HeadingComponent = DividerHeading,
  name = undefined,
  ...props
}) => {
  const fieldConfig = useFieldConfig(name);
  const required = useFieldIsRequired(fieldConfig);

  return !name || fieldConfig ? (
    <Box marginBottom={4} {...props}>
      <HeadingComponent>
        {title} {required ? '*' : ''}
      </HeadingComponent>
      {children}
    </Box>
  ) : (
    <div></div>
  );
};

export default FieldGroup;
