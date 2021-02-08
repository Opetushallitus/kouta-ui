import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import FieldArrayList from '#/src/components/FieldArrayList';
import Flex, { FlexItem } from '#/src/components/Flex';
import {
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldInput,
  FormFieldEditor,
} from '#/src/components/formFields';
import Heading from '#/src/components/Heading';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import { Box, Divider } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

import TilaisuudetFields from './TilaisuudetFields';

export const KoeTaiLisanayttoFields = ({
  index,
  field,
  language,
  removeSelf,
}) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'valintakokeentyyppi' });

  const liittyyEnnakkovalmistautumista = useFieldValue(
    `${field}.liittyyEnnakkovalmistautumista`
  );
  const erityisjarjestelytMahdollisia = useFieldValue(
    `${field}.erityisjarjestelytMahdollisia`
  );

  return (
    <>
      <Heading hasDivider>
        {t(`koeTaiLisanaytto.title`, { index: index + 1 })}
      </Heading>
      <Flex ml={12}>
        <FlexItem grow={1}>
          <Flex mb={2}>
            <FlexItem grow={1}>
              <Box {...getTestIdProps('kokeenTaiLisanaytonTyyppi')}>
                <Field
                  name={`${field}.tyyppi`}
                  component={FormFieldSelect}
                  options={options}
                  label={t('koeTaiLisanaytto.tyyppi')}
                />
              </Box>
            </FlexItem>
            <FlexItem grow={1} ml={4}>
              <Box {...getTestIdProps('hakijalleNakyvaNimi')}>
                <Field
                  name={`${field}.nimi.${language}`}
                  component={FormFieldInput}
                  label={t('koeTaiLisanaytto.hakijalleNakyvaNimi')}
                />
              </Box>
            </FlexItem>
          </Flex>
          <Box mb={2} {...getTestIdProps('tietoaHakijalle')}>
            <Field
              name={`${field}.tietoaHakijalle.${language}`}
              component={FormFieldEditor}
              label={t('koeTaiLisanaytto.tietoaHakijalle')}
              hideHeaderSelect
            />
          </Box>
          <Box mb={2} {...getTestIdProps('vahimmaispistemaara')}>
            <Field
              name={`${field}.vahimmaispistemaara`}
              component={FormFieldInput}
              type="number"
              label={t('valintaperustelomake.vahimmaispistemaara')}
            />
          </Box>
          <Box mb={2} {...getTestIdProps('liittyyEnnakkovalmistautumista')}>
            <Field
              name={`${field}.liittyyEnnakkovalmistautumista`}
              component={FormFieldCheckbox}
            >
              {t('koeTaiLisanaytto.liittyyEnnakkovalmistautumista')}
            </Field>
          </Box>
          {liittyyEnnakkovalmistautumista && (
            <Box mb={2} {...getTestIdProps('ohjeetEnnakkovalmistautumiseen')}>
              <Field
                name={`${field}.ohjeetEnnakkovalmistautumiseen.${language}`}
                component={FormFieldEditor}
                label={t('koeTaiLisanaytto.materiaaliJaValmistautumisohjeet')}
                hideHeaderSelect
              />
            </Box>
          )}
          <Box mb={2} {...getTestIdProps('erityisjarjestelytMahdollisia')}>
            <Field
              name={`${field}.erityisjarjestelytMahdollisia`}
              component={FormFieldCheckbox}
            >
              {t('koeTaiLisanaytto.erityisjarjestelytMahdollisia')}
            </Field>
          </Box>
          {erityisjarjestelytMahdollisia && (
            <Box mb={2} {...getTestIdProps('ohjeetErityisjarjestelyihin')}>
              <Field
                name={`${field}.ohjeetErityisjarjestelyihin.${language}`}
                component={FormFieldEditor}
                label={t('koeTaiLisanaytto.ohjeetErityisjarjestelyihin')}
                hideHeaderSelect
              />
            </Box>
          )}
          <FieldArray
            name={`${field}.tilaisuudet`}
            component={TilaisuudetFields}
            language={language}
            t={t}
          />
        </FlexItem>
        <FlexItem mt={4} ml={4}>
          <RemoveButton onClick={removeSelf} />
        </FlexItem>
      </Flex>
    </>
  );
};

const KokeetTaiLisanaytotFields = ({ fields, language, t, meta }) => {
  return (
    <div {...getTestIdProps('kokeetTaiLisanaytot')}>
      <FieldArrayList
        fields={fields}
        meta={meta}
        hasDivider={false}
        hasRemoveButton={false}
      >
        {({ field, index }) => (
          <KoeTaiLisanayttoFields
            field={field}
            language={language}
            meta={meta}
            index={index}
            removeSelf={() => fields.remove(index)}
          />
        )}
      </FieldArrayList>
      {!_.isEmpty(fields) && <Divider />}
      <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
        <IconButton
          variant="outlined"
          type="button"
          iconType="add"
          onClick={() => fields.push({})}
          {...getTestIdProps('lisaaKoeTaiLisanayttoButton')}
        >
          {t('koeTaiLisanaytto.lisaa')}
        </IconButton>
      </Flex>
    </div>
  );
};

export default KokeetTaiLisanaytotFields;
