import React, { Fragment } from 'react';
import { FieldArray, Field } from 'redux-form';

import Spacing from '../Spacing';
import Button from '../Button';
import Divider from '../Divider';
import Flex, { FlexItem } from '../Flex';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

import {
  FormFieldInput,
  FormFieldDateTimeInput,
  FormFieldTextarea,
} from '../FormFields';

const renderValintakoeFields = ({ fields, language, t }) => (
  <>
    {fields.map((koe, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2} {...getTestIdProps('osoite')}>
          <Field
            name={`${koe}.osoite.${language}`}
            component={FormFieldInput}
            label={t('yleiset.osoite')}
          />
        </Spacing>

        <Spacing marginBottom={2}>
          <Flex>
            <FlexItem grow={0} basis="30%" {...getTestIdProps('postinumero')}>
              <Field
                name={`${koe}.postinumero`}
                component={FormFieldInput}
                type="number"
                label={t('yleiset.postinumero')}
              />
            </FlexItem>
            <FlexItem
              grow={1}
              paddingLeft={2}
              {...getTestIdProps('postitoimipaikka')}
            >
              <Field
                name={`${koe}.postitoimipaikka.${language}`}
                component={FormFieldInput}
                label={t('yleiset.postitoimipaikka')}
              />
            </FlexItem>
          </Flex>
        </Spacing>

        <Flex marginBottom={2} alignCenter>
          <FlexItem grow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
            <Field
              name={`${koe}.alkaa`}
              component={FormFieldDateTimeInput}
              label={t('yleiset.alkaa')}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={2} {...getTestIdProps('paattyy')}>
            <Field
              name={`${koe}.paattyy`}
              component={FormFieldDateTimeInput}
              label={t('yleiset.paattyy')}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FlexItem>
        </Flex>

        <Spacing {...getTestIdProps('lisatietoa')}>
          <Field
            name={`${koe}.lisatietoja.${language}`}
            component={FormFieldTextarea}
            label={t('yleiset.lisatietoja')}
          />
        </Spacing>

        <Flex marginTop={2} justifyEnd>
          <Button
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
            variant="outlined"
            color="secondary"
          >
            {t('yleiset.poista')}
          </Button>
        </Flex>
        {index < fields.length - 1 ? (
          <Divider marginBottom={3} marginTop={3} />
        ) : null}
      </Fragment>
    ))}
    <Spacing marginTop={2}>
      <Button
        type="button"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('hakukohdelomake.lisaaTilaisuus')}
      </Button>
    </Spacing>
  </>
);

const ValintakoeList = ({ language }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('valintakoelista')}>
      <FieldArray
        name="kokeet"
        component={renderValintakoeFields}
        language={language}
        t={t}
      />
    </div>
  );
};

export default ValintakoeList;
