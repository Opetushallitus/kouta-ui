import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Button from '#/src/components/Button';
import { FormFieldSelect, FormFieldInput } from '#/src/components/formFields';
import { Box, FormControl } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

const PainotetutArvosanatFields = ({ fields }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({
    koodisto: 'oppiaineetyleissivistava',
  });

  return (
    <>
      <FormControl>
        {fields.map((hakukohteenLinja, index) => (
          <Box display="flex" width={0.5} key={index} marginTop={2}>
            <Box
              width={'70%'}
              flexShrink={0}
              marginRight={2}
              {...getTestIdProps('painotettuOppiaine')}
            >
              <Field
                component={FormFieldSelect}
                name={`${hakukohteenLinja}.painotettuOppiaine`}
                options={options}
                label={t('hakukohdelomake.oppiaine')}
              />
            </Box>
            <Box marginRight={2} {...getTestIdProps('painokerroin')}>
              <Field
                component={FormFieldInput}
                name={`${hakukohteenLinja}.painokerroin`}
                type="number"
                label={t('hakukohdelomake.painokerroin')}
              />
            </Box>
            <Box display="flex" style={{ alignSelf: 'end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  fields.remove(index);
                }}
                {...getTestIdProps('poistaButton')}
              >
                {t('yleiset.poistaRivi')}
              </Button>
            </Box>
          </Box>
        ))}
      </FormControl>
      <Box marginTop={2}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            fields.push({});
          }}
          {...getTestIdProps('lisaaButton')}
        >
          {t('hakukohdelomake.lisaaPainotettavaOppiaine')}
        </Button>
      </Box>
    </>
  );
};

export default PainotetutArvosanatFields;
