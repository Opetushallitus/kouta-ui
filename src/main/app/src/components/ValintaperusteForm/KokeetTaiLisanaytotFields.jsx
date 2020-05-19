import React from 'react';
import _ from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';
import Box from '@opetushallitus/virkailija-ui-components/Box';
import { getTestIdProps } from '#/src/utils';
import Flex from '#/src/components/Flex';
import FieldArrayList from '#/src/components/FieldArrayList';
import useKoodistoOptions from '#/src/components/useKoodistoOptions';

import {
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldInput,
  FormFieldEditor,
} from '#/src/components/formFields';
import FieldGroup from '#/src/components/FieldGroup';
import IconButton from '#/src/components/IconButton';
import { useFieldValue } from '#/src/hooks/form';
import TilaisuudetFields from './TilaisuudetFields';
import Divider from '#/src/components/Divider';

export const KoeTaiLisanayttoFields = ({
  index,
  field,
  language,
  meta,
  translationBase,
}) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'valintakokeentyyppi' });

  const liittyyEnnakkoValmistautumista = useFieldValue(
    `${field}.liittyyEnnakkovalmistautumista`
  );
  const erityisjarjestelyMahdollisia = useFieldValue(
    `${field}.erityisjarjestelytMahdollisia`
  );

  return (
    <FieldGroup title={t(`${translationBase}.title`, { index: index + 1 })}>
      <Box ml={12}>
        <Box mb={2} {...getTestIdProps('kokeenTaiLisanaytonTyyppi')}>
          <Field
            name={`${field}.kokeenTaiLisanaytonTyyppi`}
            component={FormFieldSelect}
            options={options}
            label={t(`${translationBase}.tyyppi`)}
          />
        </Box>
        <Box mb={2}>
          <Field
            name={`${field}.hakijalleNakyvaNimi`}
            component={FormFieldInput}
            label={t(`${translationBase}.hakijalleNakyvaNimi`)}
          />
        </Box>
        <Box mb={2}>
          <Field
            name={`${field}.tietoaKokeestaHakijalle`}
            component={FormFieldEditor}
            label={t(`${translationBase}.tietoaHakijalle`)}
          />
        </Box>
        <Box mb={2}>
          <Field
            name={`${field}.liittyyEnnakkovalmistautumista`}
            component={FormFieldCheckbox}
          >
            {t(`${translationBase}.liittyyEnnakkovalmistautumista`)}
          </Field>
        </Box>
        <Box mb={2}>
          {liittyyEnnakkoValmistautumista && (
            <Field
              name={`${field}.materiaaliJaValmistautumisohjeet`}
              component={FormFieldEditor}
              label={t(`${translationBase}.materiaaliJaValmistautumisohjeet`)}
            />
          )}
        </Box>
        <Box mb={2}>
          <Field
            name={`${field}.erityisjarjestelytMahdollisia`}
            component={FormFieldCheckbox}
          >
            {t(`${translationBase}.erityisjarjestelytMahdollisia`)}
          </Field>
        </Box>
        <Box mb={2}>
          {erityisjarjestelyMahdollisia && (
            <Field
              name={`${field}.ohjeetErityisjarjestelyihin`}
              component={FormFieldEditor}
              label={t(`${translationBase}.ohjeetErityisjarjestelyihin`)}
            />
          )}
        </Box>
        <FieldArray
          name={`${field}.tilaisuudet`}
          component={TilaisuudetFields}
          language={language}
          t={t}
        />
      </Box>
    </FieldGroup>
  );
};

const KokeetTaiLisanaytotFields = ({
  fields,
  language,
  t,
  meta,
  translationBase,
}) => {
  return (
    <>
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
            translationBase={translationBase}
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
          {t(`${translationBase}.lisaa`)}
        </IconButton>
      </Flex>
    </>
  );
};

export default KokeetTaiLisanaytotFields;
