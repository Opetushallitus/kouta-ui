import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import { isArray } from 'lodash';

import useKoodistoOptions from '../useKoodistoOptions';
import Spacing from '../Spacing';
import Flex, { FlexItem } from '../Flex';
import FieldArrayList from '../FieldArrayList';
import Button from '../Button';
import useTranslation from '../useTranslation';
import DividerHeading from '../DividerHeading';
import { getTestIdProps } from '../../utils';

import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldTextarea,
  FormFieldDateTimeInput,
  FormFieldPostinumeroSelect,
} from '../formFields';

const TilaisuudetField = ({ fields, language, t, meta }) => (
  <>
    <FieldArrayList fields={fields} meta={meta}>
      {({ field }) => (
        <>
          <Spacing marginBottom={2} {...getTestIdProps('osoite')}>
            <Field
              name={`${field}.osoite.${language}`}
              component={FormFieldInput}
              label={t('yleiset.osoite')}
            />
          </Spacing>

          <Spacing marginBottom={2} {...getTestIdProps('postinumero')}>
            <Field
              name={`${field}.postinumero`}
              component={FormFieldPostinumeroSelect}
              label={t('yleiset.postinumero')}
              type="number"
            />
          </Spacing>

          <Flex marginBottom={2} alignCenter>
            <FlexItem grow={1} paddingRight={1} {...getTestIdProps('alkaa')}>
              <Field
                name={`${field}.alkaa`}
                component={FormFieldDateTimeInput}
                label={t('yleiset.alkaa')}
                helperText={t('yleiset.paivamaaraJaKellonaika')}
              />
            </FlexItem>
            <FlexItem grow={1} paddingLeft={1} {...getTestIdProps('paattyy')}>
              <Field
                name={`${field}.paattyy`}
                component={FormFieldDateTimeInput}
                label={t('yleiset.paattyy')}
                helperText={t('yleiset.paivamaaraJaKellonaika')}
              />
            </FlexItem>
          </Flex>

          <div {...getTestIdProps('lisatietoja')}>
            <Field
              name={`${field}.lisatietoja.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.lisatietoja')}
            />
          </div>
        </>
      )}
    </FieldArrayList>
    <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
      <Button
        variant="outlined"
        type="button"
        onClick={() => fields.push({})}
        {...getTestIdProps('lisaaTilaisuusButton')}
      >
        {t('yleiset.lisaaTilaisuus')}
      </Button>
    </Flex>
  </>
);

const TyypitListField = ({ input: { value }, baseName, language, t }) => {
  const tyypit = isArray(value) ? value : [];
  return (
    <>
      <Spacing marginTop={tyypit.length > 0 ? 4 : 0}>
        {tyypit.map(({ value, label }, index) => (
          <Fragment key={value}>
            {label ? <DividerHeading>{label}</DividerHeading> : null}
            <Spacing marginBottom={index < tyypit.length - 1 ? 4 : 0}>
              <FieldArray
                name={`${baseName}.tilaisuudet.${value}`}
                component={TilaisuudetField}
                language={language}
                t={t}
              />
            </Spacing>
          </Fragment>
        ))}
      </Spacing>
    </>
  );
};

export const ValintakoeFields = ({ name = 'valintakoe', language }) => {
  const { options } = useKoodistoOptions({ koodisto: 'valintakokeentyyppi' });
  const { t } = useTranslation();

  const tyypitName = `${name}.tyypit`;

  return (
    <>
      <div {...getTestIdProps('tyypit')}>
        <Field
          name={tyypitName}
          component={FormFieldSelect}
          options={options}
          label={t('yleiset.valitseValintakoetyypit')}
          isMulti
        />
      </div>
      <Field
        name={tyypitName}
        baseName={name}
        component={TyypitListField}
        language={language}
        t={t}
      />
    </>
  );
};

export default ValintakoeFields;
