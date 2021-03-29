import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import {
  FormFieldInput,
  FormFieldPostinumeroSelect,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import { Divider } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { Button } from './Button';
import { FieldArrayList } from './FieldArrayList';
import { Flex } from './Flex';
import { GridColumn } from './GridColumn';
import { GridRow } from './GridRow';

export const YhteystietoSection = ({ description, name, language }) => {
  const { t } = useTranslation();

  return (
    <GridRow>
      {description && (
        <GridColumn css={'margin-top: 24px'} md={12}>
          {description}
        </GridColumn>
      )}
      <GridColumn css={'margin-top: 24px'} md={12} {...getTestIdProps('nimi')}>
        <Field
          required
          component={FormFieldInput}
          name={`${name}.nimi.${language}`}
          label={t('oppilaitoslomake.yhteystiedonNimi')}
        />
      </GridColumn>
      <GridColumn css={'margin-top: 24px'} md={12}>
        {t('yleiset.postiosoite')}
      </GridColumn>
      <Divider margin={1} />
      <GridColumn md={6} {...getTestIdProps('postiosoite')}>
        <Field
          component={FormFieldInput}
          name={`${name}.postiosoite.${language}`}
          label={t('yleiset.postiosoite')}
        />
      </GridColumn>
      <GridColumn md={6} {...getTestIdProps('postinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.postinumero`}
          label={t('yleiset.postinumero')}
        />
      </GridColumn>
      <GridColumn css={'margin-top: 24px'} md={12}>
        {t('yleiset.kayntiosoite')}
      </GridColumn>
      <Divider margin={1} />
      <GridColumn md={6} {...getTestIdProps('kayntiosoite')}>
        <Field
          component={FormFieldInput}
          name={`${name}.kayntiosoite.${language}`}
          label={t('yleiset.kayntiosoite')}
        />
      </GridColumn>
      <GridColumn md={6} {...getTestIdProps('kayntiosoitePostinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.kayntiosoitePostinumero`}
          label={t('yleiset.postinumero')}
        />
      </GridColumn>
      <GridColumn css={'margin-top: 24px'} md={12}>
        {t('oppilaitoslomake.muutYhteystiedot')}
      </GridColumn>
      <Divider margin={1} />
      <GridColumn md={6} {...getTestIdProps('sahkoposti')}>
        <Field
          component={FormFieldInput}
          name={`${name}.sahkoposti.${language}`}
          label={t('yleiset.sahkoposti')}
        />
      </GridColumn>
      <GridColumn md={6} {...getTestIdProps('puhelinnumero')}>
        <Field
          component={FormFieldInput}
          name={`${name}.puhelinnumero.${language}`}
          label={t('yleiset.puhelinnumero')}
        />
      </GridColumn>
      <GridColumn md={6} {...getTestIdProps('verkkosivu')}>
        <Field
          component={FormFieldUrlInput}
          name={`${name}.verkkosivu.${language}`}
          label={t('yleiset.verkkosivu')}
        />
      </GridColumn>
    </GridRow>
  );
};

const YhteystiedotComponent = ({ fields, language, t }) => {
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => <YhteystietoSection name={field} language={language} />}
      </FieldArrayList>
      <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
          {...getTestIdProps('lisaaYhteystietoButton')}
        >
          {t('yleiset.lisaaYhteystieto')}
        </Button>
      </Flex>
    </>
  );
};

export const YhteystiedotSection = ({
  name = 'yhteyshenkilot',
  language = 'fi',
}) => {
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      component={YhteystiedotComponent}
      t={t}
      language={language}
    />
  );
};
