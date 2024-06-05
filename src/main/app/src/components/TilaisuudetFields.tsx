import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import DateTimeRange from '#/src/components/DateTimeRange';
import FieldArrayList from '#/src/components/FieldArrayList';
import {
  FormFieldInput,
  FormFieldPostinumeroSelect,
  FormFieldEditor,
} from '#/src/components/formFields';
import Heading from '#/src/components/Heading';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import { Box } from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';

const SubSectionBox = styled(Box)`
  background-color: ${({ backgroundColor }) =>
    backgroundColor || getThemeProp('colors.grayLighten6')};
  padding: ${spacing(4)};
`;

export const TilaisuusFields = ({
  field,
  language,
  index,
  removeSelf,
  backgroundColor,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Heading mb={1}>
        {t('koeTaiLisanaytto.tilaisuusTitle', { index })}
      </Heading>
      <SubSectionBox backgroundColor={backgroundColor}>
        <Box display="flex" justifyContent="space-between">
          <DateTimeRange
            startProps={{
              name: `${field}.alkaa`,
              label: t('koeTaiLisanaytto.tilaisuusAlkaa'),
              required: true,
            }}
            endProps={{
              name: `${field}.paattyy`,
              label: t('koeTaiLisanaytto.tilaisuusPaattyy'),
              required: true,
            }}
          />
          <Box mt={4} ml={4}>
            <RemoveButton onClick={removeSelf} />
          </Box>
        </Box>
        <Box mb={2} {...getTestIdProps('jarjestamispaikka')}>
          <Field
            name={`${field}.jarjestamispaikka.${language}`}
            component={FormFieldInput}
            label={t('koeTaiLisanaytto.jarjestamispaikka')}
          />
        </Box>
        <Box mb={2} {...getTestIdProps('osoite')}>
          <Field
            required
            name={`${field}.osoite.${language}`}
            component={FormFieldInput}
            label={t('yleiset.osoite')}
          />
        </Box>
        <Box mb={2} {...getTestIdProps('postinumero')}>
          <Field
            required
            name={`${field}.postinumero.${language}`}
            component={FormFieldPostinumeroSelect}
            label={t('yleiset.postinumero')}
          />
        </Box>
        <Box {...getTestIdProps('lisatietoja')}>
          <Field
            name={`${field}.lisatietoja.${language}`}
            component={FormFieldEditor}
            label={t('koeTaiLisanaytto.tilaisuudenLisatiedot')}
            hideHeaderSelect
          />
        </Box>
      </SubSectionBox>
    </>
  );
};

export const TilaisuudetFields = ({
  fields,
  language,
  t,
  meta,
  readonlyAmount = 0,
  backgroundColor,
}) => (
  <>
    <FieldArrayList
      fields={fields}
      meta={meta}
      hasDivider={false}
      hasRemoveButton={false}
    >
      {({ field, index }) => (
        <TilaisuusFields
          index={index + 1 + readonlyAmount}
          backgroundColor={backgroundColor || getThemeProp('colors.white')}
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
        css={{ backgroundColor: 'white' }}
        {...getTestIdProps('lisaaTilaisuusButton')}
      >
        {t('yleiset.lisaaTilaisuus')}
      </IconButton>
    </Box>
  </>
);
