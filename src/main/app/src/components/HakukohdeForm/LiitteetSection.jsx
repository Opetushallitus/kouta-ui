import React, { Fragment } from 'react';
import { Field, FieldArray, formValues } from 'redux-form';

import Typography from '../Typography';
import Spacing from '../Spacing';
import LanguageSelector from '../LanguageSelector';
import Checkbox from '../Checkbox';
import InputMask from '../InputMask';
import Button from '../Button';
import Flex, { FlexItem } from '../Flex';
import Input from '../Input';
import Textarea from '../Textarea';
import Select from '../Select';
import Divider from '../Divider';
import { noop, getTestIdProps } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

const renderCheckboxField = ({ input, label = null }) => (
  <Checkbox checked={input.value} onChange={input.onChange} children={label} />
);

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderTextareaField = ({ input, ...props }) => (
  <Textarea {...input} {...props} />
);

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

const ToimitusaikaSection = ({ getFieldName }) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography as="h6" marginBottom={1}>
        {t('hakukohdelomake.toimitusaika')}
      </Typography>
      <Flex>
        <FlexItem grow={1} {...getTestIdProps('paivamaara')}>
          <Field
            name={getFieldName('deliverDate')}
            placeholder="pp.kk.vvvv"
            component={renderInputMaskField}
            mask="99.99.9999"
          />
        </FlexItem>
        <FlexItem grow={0} basis="30%" paddingLeft={2} {...getTestIdProps('kellonaika')}>
          <Field
            name={getFieldName('deliverTime')}
            placeholder="tt:mm"
            component={renderInputMaskField}
            mask="99:99"
          />
        </FlexItem>
      </Flex>
      <Typography as="div" variant="secondary" marginTop={1}>
        {t('yleiset.paivamaaraJaKellonaika')}
      </Typography>
    </>
  );
};

const ToimituspaikkaSection = ({ getFieldName, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('osoite')}>
        <Typography variant="h6" marginBottom={1}>
          {t('yleiset.osoite')}
        </Typography>
        <Field
          name={`${getFieldName('toimitusosoite')}.${language}`}
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
              name={getFieldName('toimituspostinumero')}
              component={renderInputField}
              type="number"
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={2} {...getTestIdProps('postitoimipaikka')}>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.postitoimipaikka')}
            </Typography>
            <Field
              name={`${getFieldName('toimituspostitoimipaikka')}.${language}`}
              component={renderInputField}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing {...getTestIdProps('sahkoposti')}>
        <Typography variant="h6" marginBottom={1}>
          {t('yleiset.sahkoposti')}
        </Typography>
        <Field
          name={getFieldName('toimitussahkoposti')}
          component={renderInputField}
          type="email"
        />
      </Spacing>
    </>
  );
};

const renderLiitteetFields = ({
  fields,
  language,
  includeToimitusaika = true,
  includeToimituspaikka = true,
  tyyppiOptions,
  t,
}) => {
  return (
    <>
      {fields.map((liite, index) => (
        <Fragment key={index}>
          <Spacing marginBottom={2} {...getTestIdProps('tyyppi')}>
            <Typography as="h6" marginBottom={1}>
              {t('yleiset.tyyppi')}
            </Typography>
            <Field
              name={`${liite}.tyyppi`}
              component={renderSelectField}
              options={tyyppiOptions}
            />
          </Spacing>

          <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
            <Typography as="h6" marginBottom={1}>
              {t('yleiset.nimi')}
            </Typography>
            <Field
              name={`${liite}.nimi.${language}`}
              component={renderInputField}
            />
          </Spacing>

          <Spacing marginBottom={2} {...getTestIdProps('kuvaus')}>
            <Typography as="h6" marginBottom={1}>
              {t('yleiset.kuvaus')}
            </Typography>
            <Field
              name={`${liite}.kuvaus.${language}`}
              component={renderTextareaField}
            />
          </Spacing>

          {includeToimitusaika ? (
            <Spacing marginBottom={2} {...getTestIdProps('toimitusaika')}>
              <ToimitusaikaSection
                getFieldName={baseName => `${liite}.${baseName}`}
              />
            </Spacing>
          ) : null}

          {includeToimituspaikka ? (
            <Spacing marginBottom={2} {...getTestIdProps('toimituspaikka')}>
              <ToimituspaikkaSection
                language={language}
                getFieldName={baseName => `${liite}.${baseName}`}
              />
            </Spacing>
          ) : null}

          <Flex justifyEnd>
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
          <Divider marginTop={3} marginBottom={3} />
        </Fragment>
      ))}
      <Button
        type="button"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('hakukohdelomake.lisaaLiite')}
      </Button>
    </>
  );
};

const YhteinenToimitusFieldValues = formValues({
  yhteinenToimitusaika: 'yhteinenToimitusaika',
  yhteinenToimituspaikka: 'yhteinenToimituspaikka',
})(({ yhteinenToimitusaika, yhteinenToimituspaikka, children }) =>
  children({
    yhteinenToimitusaika,
    yhteinenToimituspaikka,
  }),
);

const LiitteetSection = ({ languages, organisaatioOid }) => {
  const { options: tyyppiOptions } = useKoodistoOptions({
    koodisto: 'liitetyypitamm',
  });

  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <YhteinenToimitusFieldValues>
          {({ yhteinenToimitusaika, yhteinenToimituspaikka }) => (
            <>
              <Spacing marginBottom={2} {...getTestIdProps('liitelista')}>
                <FieldArray
                  name="liitteet"
                  component={renderLiitteetFields}
                  language={activeLanguage}
                  includeToimitusaika={!yhteinenToimitusaika}
                  includeToimituspaikka={!yhteinenToimituspaikka}
                  tyyppiOptions={tyyppiOptions}
                  t={t}
                />
              </Spacing>
              <Spacing>
                <Field
                  name="yhteinenToimitusaika"
                  component={renderCheckboxField}
                  label={t(
                    'hakukohdelomake.kaytaLiitteilleYhteistaToimitusaikaa',
                  )}
                />
                {yhteinenToimitusaika ? (
                  <Spacing marginTop={1} marginBottom={2}>
                    <ToimitusaikaSection getFieldName={baseName => baseName} />
                  </Spacing>
                ) : null}
              </Spacing>
              <Spacing>
                <Field
                  name="yhteinenToimituspaikka"
                  component={renderCheckboxField}
                  label={t(
                    'hakukohdelomake.kaytaLiitteilleYhteistaToimituspaikkaa',
                  )}
                />
                {yhteinenToimituspaikka ? (
                  <Spacing marginTop={1}>
                    <ToimituspaikkaSection
                      getFieldName={baseName => baseName}
                      language={activeLanguage}
                    />
                  </Spacing>
                ) : null}
              </Spacing>
            </>
          )}
        </YhteinenToimitusFieldValues>
      )}
    </LanguageSelector>
  );
};

export default LiitteetSection;
