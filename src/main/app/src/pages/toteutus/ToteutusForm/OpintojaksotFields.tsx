import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { RouterAnchor } from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import { Box, FormControl } from '#/src/components/virkailija';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { getTestIdProps } from '#/src/utils';
import { useOpintojaksot } from '#/src/utils/toteutus/getOpintojaksot';

export const OpintojaksotFields = ({
  fields,
  name,
  organisaatioOid,
  language,
}) => {
  const { t } = useTranslation();

  const { data: opintojaksot } = useOpintojaksot({
    organisaatioOid,
  });

  const options = useEntityOptions(opintojaksot);

  return (
    <>
      <FormControl>
        {fields.map((field, index) => {
          const fieldData = fields.get(index);
          const oid =
            !_.isEmpty(fieldData) && !_.isEmpty(fieldData.opintojakso)
              ? fieldData.opintojakso.value
              : undefined;
          return (
            <Box
              display="flex"
              width={0.8}
              key={index}
              marginTop={2}
              {...getTestIdProps(`opintojakso-${index}`)}
            >
              <Box width={'70%'} flexShrink={1} marginRight={2}>
                <Field
                  component={FormFieldSelect}
                  name={`${field}.opintojakso`}
                  options={options}
                  label={t('toteutuslomake.opintojakso')}
                  required
                />
              </Box>
              <Box width={'30%'} display="flex" alignSelf="flex-end">
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
                {organisaatioOid && oid && (
                  <Box marginLeft={2}>
                    <RouterAnchor
                      to={`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`}
                    >
                      {t('toteutuslomake.muokkaaOpintojaksoa')}
                    </RouterAnchor>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
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
          {t('toteutuslomake.lisaaOpintojakso')}
        </IconButton>
      </Box>
    </>
  );
};
