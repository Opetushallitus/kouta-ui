import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import FieldArrayList from '#/src/components/FieldArrayList';
import {
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldInput,
  FormFieldEditor,
} from '#/src/components/formFields';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import { SectionInnerCollapse } from '#/src/components/SectionInnerCollapse';
import { Box, Divider } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { useValintakokeentyyppiKoodistoOptions } from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

import { TilaisuudetFields } from './TilaisuudetFields';

export const KoeTaiLisanayttoFields = ({
  index,
  field,
  language,
  removeSelf,
  haku,
  koulutuskoodit = [],
  osaamisalat = [],
}) => {
  const { t } = useTranslation();
  const { options } = useValintakokeentyyppiKoodistoOptions({
    koulutuskoodit,
    hakutapa: haku.hakutapaKoodiUri,
    haunkohdejoukko: haku.kohdejoukkoKoodiUri,
    osaamisalat,
  });

  const liittyyEnnakkovalmistautumista = useFieldValue(
    `${field}.liittyyEnnakkovalmistautumista`
  );
  const erityisjarjestelytMahdollisia = useFieldValue(
    `${field}.erityisjarjestelytMahdollisia`
  );

  return (
    <>
      <SectionInnerCollapse
        header={t(`koeTaiLisanaytto.title`, { index })}
        defaultOpen={true}
      >
        <Box display="flex" ml={12}>
          <Box flexGrow={1}>
            <Box display="flex" mb={2}>
              <Box flexGrow={1}>
                <Box {...getTestIdProps('kokeenTaiLisanaytonTyyppi')}>
                  <Field
                    name={`${field}.tyyppi`}
                    component={FormFieldSelect}
                    options={options}
                    label={t('koeTaiLisanaytto.tyyppi')}
                    required
                  />
                </Box>
              </Box>
              <Box flexGrow={1} ml={4}>
                <Box {...getTestIdProps('hakijalleNakyvaNimi')}>
                  <Field
                    name={`${field}.nimi.${language}`}
                    component={FormFieldInput}
                    label={t('koeTaiLisanaytto.hakijalleNakyvaNimi')}
                  />
                </Box>
              </Box>
            </Box>
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
          </Box>
          <Box mt={4} ml={4}>
            <RemoveButton onClick={removeSelf} />
          </Box>
        </Box>
      </SectionInnerCollapse>
    </>
  );
};

export const KokeetTaiLisanaytotFields = ({
  fields,
  language,
  t,
  meta,
  readonlyAmount = 0,
  haku,
  koulutuskoodit = [],
  osaamisalat = [],
}) => {
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
            index={index + 1 + readonlyAmount}
            removeSelf={() => fields.remove(index)}
            haku={haku}
            koulutuskoodit={koulutuskoodit}
            osaamisalat={osaamisalat}
          />
        )}
      </FieldArrayList>
      {!_.isEmpty(fields) && <Divider />}
      <Box
        display="flex"
        justifyContent="center"
        marginTop={fields.length > 0 ? 4 : 0}
      >
        <IconButton
          variant="outlined"
          type="button"
          iconType="add"
          onClick={() => fields.push({})}
          {...getTestIdProps('lisaaKoeTaiLisanayttoButton')}
        >
          {t('koeTaiLisanaytto.lisaa')}
        </IconButton>
      </Box>
    </div>
  );
};
