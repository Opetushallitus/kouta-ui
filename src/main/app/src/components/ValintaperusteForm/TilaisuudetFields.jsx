import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import Box from '@opetushallitus/virkailija-ui-components/Box';
import { getTestIdProps } from '#/src/utils';
import FieldArrayList from '#/src/components/FieldArrayList';
import DateTimeRange from '#/src/components/DateTimeRange';
import { spacing } from '#/src/theme';

import {
  FormFieldInput,
  FormFieldTextarea,
  FormFieldPostinumeroSelect,
} from '#/src/components/formFields';
import IconButton from '#/src/components/IconButton';
import { getThemeProp } from '#/src/theme';
import Heading from '#/src/components/Heading';
import RemoveButton from '#/src/components/RemoveButton';

const SubSectionBox = styled(Box)`
  background-color: ${getThemeProp('colors.grayLighten6')};
  padding: ${spacing(4)};
`;

export const TilaisuusFields = ({ field, language, index, removeSelf }) => {
  const { t } = useTranslation();
  return (
    <>
      <Heading marginBottom={1}>
        {t('valintaperustelomake.tilaisuusTitle', { index: index + 1 })}
      </Heading>
      <SubSectionBox>
        <Box display="flex" justifyContent="between">
          <DateTimeRange
            startProps={{
              name: `${field}.alkaa`,
              label: t('valintaperustelomake.tilaisuusAlkaa'),
            }}
            endProps={{
              name: `${field}.paattyy`,
              label: t('valintaperustelomake.tilaisuusPaattyy'),
            }}
          />
          <Box mt={4} ml={4}>
            <RemoveButton onClick={removeSelf} />
          </Box>
        </Box>
        <Box mb={2} {...getTestIdProps('jarjestamispaikka')}>
          <Field
            name={`${field}.jarjestamispaikka`}
            component={FormFieldInput}
            label={t('valintaperustelomake.jarjestamispaikka')}
          />
        </Box>
        <Box mb={2} {...getTestIdProps('osoite')}>
          <Field
            name={`${field}.osoite.${language}`}
            component={FormFieldInput}
            label={t('yleiset.osoite')}
          />
        </Box>
        <Box mb={2} {...getTestIdProps('postinumero')}>
          <Field
            name={`${field}.postinumero`}
            component={FormFieldPostinumeroSelect}
            label={t('yleiset.postinumero')}
          />
        </Box>
        <Box {...getTestIdProps('tilaisuudenLisatiedot')}>
          <Field
            name={`${field}.lisatiedot.${language}`}
            component={FormFieldTextarea}
            label={t('valintaperustelomake.tilaisuudenLisatiedot')}
          />
        </Box>
      </SubSectionBox>
    </>
  );
};

export const TilaisuudetFields = ({ fields, language, t, meta }) => (
  <>
    <FieldArrayList
      fields={fields}
      meta={meta}
      hasDivider={false}
      hasRemoveButton={false}
    >
      {({ field, index }) => (
        <TilaisuusFields
          index={index}
          field={field}
          language={language}
          removeSelf={() => fields.remove(index)}
        />
      )}
    </FieldArrayList>
    <Box mt={4} mb={4}>
      <IconButton
        variant="outlined"
        type="button"
        iconType="add"
        onClick={() => fields.push({})}
        {...getTestIdProps('lisaaTilaisuusButton')}
      >
        {t('yleiset.lisaaTilaisuus')}
      </IconButton>
    </Box>
  </>
);

export default TilaisuudetFields;
