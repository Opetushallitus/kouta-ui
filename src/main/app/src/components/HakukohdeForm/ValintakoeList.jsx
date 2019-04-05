import React, { Fragment } from 'react';
import { FieldArray, Field } from 'redux-form';

import Spacing from '../Spacing';
import Typography from '../Typography';
import Input from '../Input';
import Button from '../Button';
import Divider from '../Divider';
import InputMask from '../InputMask';
import Textarea from '../Textarea';
import Flex, { FlexItem } from '../Flex';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

const renderTextareaField = ({ input }) => <Textarea {...input} />;

const renderValintakoeFields = ({ fields, language, t }) => (
  <>
    {fields.map((koe, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2} {...getTestIdProps('osoite')}>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.osoite')}
          </Typography>
          <Field
            name={`${koe}.osoite.${language}`}
            component={renderInputField}
          />
        </Spacing>

        <Spacing marginBottom={2}>
          <Flex>
            <FlexItem grow={0} basis="30%" {...getTestIdProps('postinumero')}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.postinumero')}
              </Typography>
              <Field
                name={`${koe}.postinumero`}
                component={renderInputField}
                type="number"
              />
            </FlexItem>
            <FlexItem
              grow={1}
              paddingLeft={2}
              {...getTestIdProps('postitoimipaikka')}
            >
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.postitoimipaikka')}
              </Typography>
              <Field
                name={`${koe}.postitoimipaikka.${language}`}
                component={renderInputField}
              />
            </FlexItem>
          </Flex>
        </Spacing>

        <Spacing marginBottom={2}>
          <Flex>
            <FlexItem grow={1} marginRight={2} {...getTestIdProps('alkaa')}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.alkaa')}
              </Typography>
              <Flex>
                <FlexItem grow={1} {...getTestIdProps('paivamaara')}>
                  <Field
                    name={`${koe}.fromDate`}
                    component={renderInputMaskField}
                    placeholder="pp.kk.vvvv"
                    mask="99.99.9999"
                  />
                </FlexItem>
                <FlexItem
                  grow={0}
                  basis="30%"
                  paddingLeft={2}
                  {...getTestIdProps('kellonaika')}
                >
                  <Field
                    name={`${koe}.fromTime`}
                    component={renderInputMaskField}
                    placeholder="tt:mm"
                    mask="99:99"
                  />
                </FlexItem>
              </Flex>
              <Typography variant="secondary" as="div" marginTop={1}>
                {t('yleiset.paivamaaraJaKellonaika')}
              </Typography>
            </FlexItem>
            <FlexItem grow={1} marginLeft={2} {...getTestIdProps('paattyy')}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.paattyy')}
              </Typography>
              <Flex>
                <FlexItem grow={1} {...getTestIdProps('paivamaara')}>
                  <Field
                    name={`${koe}.toDate`}
                    component={renderInputMaskField}
                    placeholder="pp.kk.vvvv"
                    mask="99.99.9999"
                  />
                </FlexItem>
                <FlexItem
                  grow={0}
                  basis="30%"
                  paddingLeft={2}
                  {...getTestIdProps('kellonaika')}
                >
                  <Field
                    name={`${koe}.toTime`}
                    component={renderInputMaskField}
                    placeholder="tt:mm"
                    mask="99:99"
                  />
                </FlexItem>
              </Flex>
              <Typography variant="secondary" as="div" marginTop={1}>
                {t('yleiset.paivamaaraJaKellonaika')}
              </Typography>
            </FlexItem>
          </Flex>
        </Spacing>

        <Spacing {...getTestIdProps('lisatietoa')}>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.lisatietoja')}
          </Typography>
          <Field
            name={`${koe}.lisatietoja.${language}`}
            component={renderTextareaField}
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
