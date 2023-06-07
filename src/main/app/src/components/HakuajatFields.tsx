import React from 'react';

import _ from 'lodash';

import DateTimeRange from '#/src/components/DateTimeRange';
import FormButton from '#/src/components/FormButton';
import { Box, FormControl } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

export const HakuajatFields = ({ fields, t, meta: { error } }) => (
  <>
    <FormControl
      error={!_.isNil(error)}
      helperText={error && _.isArray(error) ? t(...error) : t(error)}
    >
      {fields.map((hakuaika, index) => (
        <DateTimeRange
          key={index}
          startProps={{ name: `${hakuaika}.alkaa` }}
          endProps={{ name: `${hakuaika}.paattyy` }}
          onRemove={() => fields.remove(index)}
        />
      ))}
    </FormControl>
    <Box marginTop={2}>
      <FormButton
        type="button"
        variant="outlined"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('yleiset.lisaaHakuaika')}
      </FormButton>
    </Box>
  </>
);
