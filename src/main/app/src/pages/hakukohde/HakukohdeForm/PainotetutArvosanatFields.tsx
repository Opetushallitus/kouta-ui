import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect, FormFieldInput } from '#/src/components/formFields';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import { Box, FormControl } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { usePainotetutOppiaineetOptions } from './hooks/usePainotetutOppiaineetOptions';

const PainotetutArvosanatFields = ({ fields, toteutus }) => {
  const { t } = useTranslation();
  const lukionKielivalikoima = toteutus?.metadata?.kielivalikoima;

  const painotetutOppiaineetOptions =
    usePainotetutOppiaineetOptions(lukionKielivalikoima);

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
            <Box display="flex" alignSelf="flex-end">
              <RemoveButton
                type="button"
                variant="outlined"
                onClick={() => {
                  fields.remove(index);
                }}
                {...getTestIdProps('poistaButton')}
              >
                {t('yleiset.poistaRivi')}
              </RemoveButton>
            </Box>
          </Box>
        ))}
      </FormControl>
      <Box marginTop={2}>
        <IconButton
          type="button"
          variant="outlined"
          iconType="add"
          onClick={() => {
            fields.push({});
          }}
          {...getTestIdProps('lisaaButton')}
        >
          {t('hakukohdelomake.lisaaPainotettavaOppiaine')}
        </IconButton>
      </Box>
    </>
  );
};

export default PainotetutArvosanatFields;
