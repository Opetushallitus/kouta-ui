import React from 'react';
import Box from '#/src/components/Box';
import DividerHeading from '#/src/components/DividerHeading';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';

export const FieldGroup = ({ title, children, name = undefined, ...props }) => {
  const fieldConfig = useFieldConfig(name);
  const required = useFieldIsRequired(fieldConfig);

  return !name || fieldConfig ? (
    <Box marginBottom={4} {...props}>
      <DividerHeading>
        {title} {required ? '*' : ''}
      </DividerHeading>
      {children}
    </Box>
  ) : (
    <div></div>
  );
};

export default FieldGroup;
