import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { RouterAnchor } from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import { Box, FormControl } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

export const EntityFields = ({
  fields,
  options,
  organisaatioOid,
  fieldName,
  entityType,
  entityLinkTranslationKey,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl>
        {fields.map((field, index) => {
          const fieldData = fields.get(index);
          const oid =
            !_.isEmpty(fieldData) && !_.isEmpty(fieldData[fieldName])
              ? fieldData[fieldName].value
              : undefined;
          return (
            <Box
              display="flex"
              width={0.8}
              key={index}
              marginTop={2}
              {...getTestIdProps(`{fieldName}-${index}`)}
            >
              <Box width={'70%'} flexShrink={1} marginRight={2}>
                <Field
                  component={FormFieldSelect}
                  name={`${field}.${fieldName}`}
                  options={options}
                  label={t(`toteutuslomake.${fieldName}`)}
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
                      to={`/organisaatio/${organisaatioOid}/${entityType}/${oid}/muokkaus`}
                    >
                      {t(entityLinkTranslationKey)}
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
          {t(`toteutuslomake.lisaa${_.capitalize(fieldName)}`)}
        </IconButton>
      </Box>
    </>
  );
};
