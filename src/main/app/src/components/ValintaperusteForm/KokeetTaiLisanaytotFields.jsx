import React from 'react';
import _ from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';
import Box from '@opetushallitus/virkailija-ui-components/Box';
import { getTestIdProps } from '#/src/utils';
import Flex, { FlexItem } from '#/src/components/Flex';
import FieldArrayList from '#/src/components/FieldArrayList';
import useKoodistoOptions from '#/src/components/useKoodistoOptions';

import {
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldInput,
  FormFieldEditor,
} from '#/src/components/formFields';
import IconButton from '#/src/components/IconButton';
import { useFieldValue } from '#/src/hooks/form';
import TilaisuudetFields from './TilaisuudetFields';
import Divider from '#/src/components/Divider';
import RemoveButton from '#/src/components/RemoveButton';
import Heading from '#/src/components/Heading';

export const KoeTaiLisanayttoFields = ({
  index,
  field,
  language,
  meta,
  translationBase,
  removeSelf,
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
    <>
      <Heading hasDivider>
        {t(`${translationBase}.title`, { index: index + 1 })}
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
                  label={t(`${translationBase}.tyyppi`)}
                />
              </Box>
            </FlexItem>
            <FlexItem grow={1} ml={4}>
              <Box>
                <Field
                  name={`${field}.nimi`}
                  component={FormFieldInput}
                  label={t(`${translationBase}.hakijalleNakyvaNimi`)}
                />
              </Box>
            </FlexItem>
          </Flex>
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
                name={`${field}.ohjeetEnnakkovalmistautumiseen`}
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
        </FlexItem>
        <FlexItem mt={4} ml={4}>
          <RemoveButton onClick={removeSelf} />
        </FlexItem>
      </Flex>
    </>
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
          {t(`${translationBase}.lisaa`)}
        </IconButton>
      </Flex>
    </>
  );
};

export default KokeetTaiLisanaytotFields;
