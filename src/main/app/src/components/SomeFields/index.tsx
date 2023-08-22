import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldUrlInput } from '#/src/components/formFields';
import { Box, Typography } from '#/src/components/virkailija';
import useKoodisto from '#/src/hooks/useKoodisto';

type SomeFieldsProps = {
  name: string;
};

export const SomeFields = ({ name }: SomeFieldsProps) => {
  const { t } = useTranslation();
  const { data: somekanavat } = useKoodisto({ koodisto: 'sosiaalinenmedia' });

  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoslomake.some')}
      </Typography>

      <Box m={-1} display="flex">
        {somekanavat?.map(somekanava => (
          <Field
            component={FormFieldUrlInput}
            name={`${name}.some.${somekanava.koodiUri}`}
            label={somekanava.metadata[0].nimi}
            key={`key-some-${somekanava.metadata[0].nimi}`}
          />
        ))}
      </Box>
    </>
  );
};
