import React, { Fragment } from 'react';
import { Field, FieldArray, formValues } from 'redux-form';
import mapValues from 'lodash/mapValues';

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
import {
  getOrganisaatioByOid,
  getOrganisaatioContactInfo,
  getKoodisto,
} from '../../apiUtils';
import ApiAsync from '../ApiAsync';
import { isArray, arrayToTranslationObject, getFirstLanguageValue } from '../../utils';

const getLiitetyypit = async ({ httpClient, apiUrls }) => {
  const liitetyypit = await getKoodisto({
    koodistoUri: 'liitetyypitamm',
    httpClient,
    apiUrls,
  });

  return isArray(liitetyypit)
    ? liitetyypit.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getOrganisaatioYhteystiedot = async ({ oid, httpClient, apiUrls }) => {
  const organisaatio = await getOrganisaatioByOid({ oid, httpClient, apiUrls });

  return getOrganisaatioContactInfo(organisaatio);
};

const getLiitteetData = async ({ organisaatioOid, httpClient, apiUrls }) => {
  const [liitetyypit, yhteystiedot] = await Promise.all([
    getLiitetyypit({ httpClient, apiUrls }),
    getOrganisaatioYhteystiedot({ httpClient, apiUrls, oid: organisaatioOid }),
  ]);

  return {
    liitetyypit,
    yhteystiedot,
  };
};

const getTyyppiOptions = tyypit => tyypit.map(({ koodiUri, nimi }) => ({
  value: koodiUri,
  label: getFirstLanguageValue(nimi),
}));

const nop = () => {};

const renderCheckboxField = ({ input, label = null }) => (
  <Checkbox checked={input.value} onChange={input.onChange} children={label} />
);

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={nop} />
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

const ToimitusaikaSection = ({ getFieldName }) => (
  <>
    <Typography as="h6" marginBottom={1}>
      Toimitusaika
    </Typography>
    <Flex>
      <FlexItem grow={1}>
        <Field
          name={getFieldName('deliverDate')}
          placeholder="pp.kk.vvvv"
          component={renderInputMaskField}
          mask="99.99.9999"
        />
      </FlexItem>
      <FlexItem grow={0} basis="30%" paddingLeft={2}>
        <Field
          name={getFieldName('deliverTime')}
          placeholder="tt:mm"
          component={renderInputMaskField}
          mask="99:99"
        />
      </FlexItem>
    </Flex>
    <Typography as="div" variant="secondary" marginTop={1}>
      Toimitusajan päivämäärä ja kellonaika
    </Typography>
  </>
);

const ToimituspaikkaSection = ({ getFieldName, language }) => (
  <>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Toimitusosoite
      </Typography>
      <Field
        name={`${getFieldName('toimitusosoite')}.${language}`}
        component={renderInputField}
      />
    </Spacing>

    <Spacing marginBottom={2}>
      <Flex>
        <FlexItem grow={0} basis="30%">
          <Typography variant="h6" marginBottom={1}>
            Toimituspostinumero
          </Typography>
          <Field
            name={getFieldName('toimituspostinumero')}
            component={renderInputField}
            type="number"
          />
        </FlexItem>
        <FlexItem grow={1} paddingLeft={2}>
          <Typography variant="h6" marginBottom={1}>
            Toimituspostitoimipaikka
          </Typography>
          <Field
            name={`${getFieldName('toimituspostitoimipaikka')}.${language}`}
            component={renderInputField}
          />
        </FlexItem>
      </Flex>
    </Spacing>

    <Spacing>
      <Typography variant="h6" marginBottom={1}>
        Sähköpostiosoite
      </Typography>
      <Field
        name={getFieldName('toimitussahkoposti')}
        component={renderInputField}
        type="email"
      />
    </Spacing>
  </>
);

const renderLiitteetFields = ({
  fields,
  language,
  yhteystiedot,
  includeToimitusaika = true,
  includeToimituspaikka = true,
  tyyppiOptions,
}) => {
  return (
    <>
      {fields.map((liite, index) => (
        <Fragment key={index}>
          <Spacing marginBottom={2}>
            <Typography as="h6" marginBottom={1}>
              Tyyppi
            </Typography>
            <Field
              name={`${liite}.tyyppi`}
              component={renderSelectField}
              options={tyyppiOptions}
            />
          </Spacing>

          <Spacing marginBottom={2}>
            <Typography as="h6" marginBottom={1}>
              Nimi
            </Typography>
            <Field name={`${liite}.nimi.${language}`} component={renderInputField} />
          </Spacing>

          <Spacing marginBottom={2}>
            <Typography as="h6" marginBottom={1}>
              Kuvaus
            </Typography>
            <Field
              name={`${liite}.kuvaus.${language}`}
              component={renderTextareaField}
            />
          </Spacing>

          {includeToimitusaika ? (
            <Spacing marginBottom={2}>
              <ToimitusaikaSection
                getFieldName={baseName => `${liite}.${baseName}`}
              />
            </Spacing>
          ) : null}

          {includeToimituspaikka ? (
            <Spacing marginBottom={2}>
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
              Poista
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
      >
        Lisää liite
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
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <ApiAsync
          promiseFn={getLiitteetData}
          organisaatioOid={organisaatioOid}
          watch={organisaatioOid}
        >
          {({ data }) => (
            <YhteinenToimitusFieldValues>
              {({ yhteinenToimitusaika, yhteinenToimituspaikka }) => (
                <>
                  <Spacing marginBottom={2}>
                    <FieldArray
                      name="liitteet"
                      component={renderLiitteetFields}
                      language={activeLanguage}
                      yhteystiedot={data ? data.yhteystiedot : {}}
                      includeToimitusaika={!yhteinenToimitusaika}
                      includeToimituspaikka={!yhteinenToimituspaikka}
                      tyyppiOptions={getTyyppiOptions(data ? data.liitetyypit : [])}
                    />
                  </Spacing>
                  <Spacing>
                    <Field
                      name="yhteinenToimitusaika"
                      component={renderCheckboxField}
                      label="Käytä liitteille yhteistä toimitusaikaa"
                    />
                    {yhteinenToimitusaika ? (
                      <Spacing marginTop={1} marginBottom={2}>
                        <ToimitusaikaSection
                          getFieldName={baseName => baseName}
                        />
                      </Spacing>
                    ) : null}
                  </Spacing>
                  <Spacing>
                    <Field
                      name="yhteinenToimituspaikka"
                      component={renderCheckboxField}
                      label="Käytä liitteille yhteistä toimituspaikkaa"
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
        </ApiAsync>
      )}
    </LanguageSelector>
  );
};

export default LiitteetSection;
