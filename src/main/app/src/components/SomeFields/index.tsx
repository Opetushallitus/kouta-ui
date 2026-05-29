import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import { FormFieldUrlInput } from '#/src/components/formFields';
import Heading from '#/src/components/Heading';
import useKoodisto from '#/src/hooks/useKoodisto';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

type SomeFieldsProps = {
  name: string;
};

export const SomeFields = ({ name }: SomeFieldsProps) => {
  const { t } = useTranslation();
  const { data: somekanavat } = useKoodisto({ koodisto: 'sosiaalinenmedia' });

  return (
    <>
      <Heading mt={4}>{t('oppilaitoslomake.some')}</Heading>

      <Grid style={{ marginBottom: '2rem' }}>
        {somekanavat?.map(somekanava => {
          const nimi = getKoodiNimiTranslation(somekanava);
          return (
            <Cell width={4} key={`key-some-${nimi}`}>
              <Field
                component={FormFieldUrlInput}
                name={`${name}.some.${somekanava.koodiUri}`}
                label={nimi}
              />
            </Cell>
          );
        })}
      </Grid>
    </>
  );
};
