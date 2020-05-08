import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import { isArray } from 'lodash';

import useKoodistoOptions from '../useKoodistoOptions';
import Spacing from '../Spacing';
import Flex from '../Flex';
import FieldArrayList from '../FieldArrayList';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import DividerHeading from '../DividerHeading';
import { getTestIdProps } from '../../utils';
import DateTimeRange from '#/src/components/DateTimeRange';

import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldTextarea,
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

          <DateTimeRange
            startProps={{ name: `${field}.alkaa` }}
            endProps={{ name: `${field}.paattyy` }}
          />
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
