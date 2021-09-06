import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Button from '#/src/components/Button';
import { FormFieldSelect, FormFieldInput } from '#/src/components/formFields';
import { Box, FormControl } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import { getPainotetutOppiaineetOptions } from '#/src/utils/hakukohde/getPainotetutOppiaineetOptions';

const PainotetutArvosanatFields = ({ fields, toteutus }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({
    koodisto: 'oppiaineetyleissivistava',
  });
  const kieliOptions = useKoodistoOptions({ koodisto: 'kieli' }).options;

  const lukionKielivalikoima = toteutus?.metadata?.kielivalikoima;

  const painotetutOppiaineetOptions = getPainotetutOppiaineetOptions(
    options,
    kieliOptions,
    lukionKielivalikoima
  );

  return (
    <>
      <FormControl>
        {fields.map((hakukohteenLinja, index) => (
          <Box
            display="flex"
            width={0.6}
            key={index}
            marginTop={2}
            {...getTestIdProps(`painotettuOppiaine-${index}`)}
          >
            <Box width={'70%'} flexShrink={1} marginRight={2}>
              <Field
                component={FormFieldSelect}
                name={`${hakukohteenLinja}.painotettuOppiaine`}
                options={painotetutOppiaineetOptions}
                label={t('hakukohdelomake.oppiaine')}
                required
              />
            </Box>
            <Box marginRight={2} {...getTestIdProps('painokerroin')}>
              <Field
                component={FormFieldInput}
                name={`${hakukohteenLinja}.painokerroin`}
                type="number"
                label={t('hakukohdelomake.painokerroin')}
                required
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
