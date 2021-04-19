import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import {
  FormFieldInput,
  FormFieldPostinumeroSelect,
} from '#/src/components/formFields';
import { Divider } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { Button } from './Button';
import { FieldArrayList } from './FieldArrayList';
import { Flex } from './Flex';

export const YhteystietoSection = ({ description, name, language }) => {
  const { t } = useTranslation();

  return (
    <Grid>
      {description && (
        <Cell css={'margin-top: 24px'} width={12}>
          {description}
        </Cell>
      )}
      <Cell css={'margin-top: 24px'} width={12}>
        <Field
          required
          component={FormFieldInput}
          name={`${name}.nimi.${language}`}
          label={t('oppilaitoslomake.yhteystiedonNimi')}
        />
      </Cell>
      <Cell css={'margin-top: 24px'} width={12}>
        {t('yleiset.postiosoite')}
      </Cell>
      <Cell width={12}>
        <Divider margin={1} />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.postiosoite.${language}`}
          label={t('yleiset.postiosoite')}
        />
      </Cell>
      <Cell width={6} {...getTestIdProps('postinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.postinumero`}
          label={t('yleiset.postinumero')}
        />
      </Cell>
      <Cell css={'margin-top: 24px'} width={12}>
        {t('yleiset.kayntiosoite')}
      </Cell>
      <Cell width={12}>
        <Divider margin={1} />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.kayntiosoite.${language}`}
          label={t('yleiset.kayntiosoite')}
        />
      </Cell>
      <Cell width={6} {...getTestIdProps('kayntiosoitePostinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.kayntiosoitePostinumero`}
          label={t('yleiset.postinumero')}
        />
      </Cell>
      <Cell css={'margin-top: 24px'} width={12}>
        {t('oppilaitoslomake.muutYhteystiedot')}
      </Cell>
      <Cell width={12}>
        <Divider margin={1} />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.sahkoposti.${language}`}
          label={t('yleiset.sahkoposti')}
        />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.puhelinnumero.${language}`}
          label={t('yleiset.puhelinnumero')}
        />
      </Cell>
    </Grid>
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
