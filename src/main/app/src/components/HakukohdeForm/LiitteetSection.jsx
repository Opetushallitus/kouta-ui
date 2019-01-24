import React, { Fragment } from 'react';
import { Field, FieldArray, formValues } from 'redux-form';
import get from 'lodash/get';

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
import { getOrganisaatioByOid, getOrganisaatioContactInfo } from '../../apiUtils';
import ApiAsync from '../ApiAsync';

const getOrganisaatioYhteystiedot = async ({ oid, httpClient, apiUrls }) => {
  const organisaatio = await getOrganisaatioByOid({ oid, httpClient, apiUrls });

  return getOrganisaatioContactInfo(organisaatio);
};

const getYhteystiedotFieldValues = ({ yhteystiedot, language }) => ({
  toimitusosoite: { [language]: get(yhteystiedot, 'osoite') || '' },
  toimituspostinumero: get(yhteystiedot, 'postinumero') || '',
  toimituspostitoimipaikka: {
    [language]: get(yhteystiedot, 'postitoimipaikka') || '',
  },
  toimitussahkoposti: get(yhteystiedot, 'sahkoposti') || '',
});

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

const typeOptions = [{ value: 'tyyppi_a', label: 'Tyyppi A' }];

const nameOptions = [{ value: 'name_a', label: 'Nimi A' }];

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
              name="tyyppi"
              component={renderSelectField}
              options={typeOptions}
            />
          </Spacing>

          <Spacing marginBottom={2}>
            <Typography as="h6" marginBottom={1}>
              Nimi
            </Typography>
            <Field
              name="nimi"
              component={renderSelectField}
              options={nameOptions}
            />
          </Spacing>

          <Spacing marginBottom={2}>
            <Typography as="h6" marginBottom={1}>
              Kuvaus
            </Typography>
            <Field name="kuvaus" component={renderTextareaField} />
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
              <ToimituspaikkaSection language={language} getFieldName={baseName => `${liite}.${baseName}`} />
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
          fields.push(getYhteystiedotFieldValues({ yhteystiedot, language }));
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
          promiseFn={getOrganisaatioYhteystiedot}
          oid={organisaatioOid}
          watch={organisaatioOid}
        >
          {({ data }) => (
            <YhteinenToimitusFieldValues>
              {({ yhteinenToimitusaika, yhteinenToimituspaikka }) => (
                <>
                  <Spacing marginBottom={1}>
                    <Field
                      name="yhteinenToimitusaika"
                      component={renderCheckboxField}
                      label="Käytä liitteille yhteistä toimitusaikaa"
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
                      label="Käytä liitteille yhteistä toimituspaikkaa"
                    />
                    {yhteinenToimituspaikka? (
                      <Spacing marginTop={1}>
                        <ToimituspaikkaSection getFieldName={baseName => baseName} language={activeLanguage} />
                      </Spacing>
                    ) : null}
                  </Spacing>
                  <Divider marginTop={3} marginBottom={3} />
                  <Spacing>
                    <FieldArray
                      name="liitteet"
                      component={renderLiitteetFields}
                      language={activeLanguage}
                      yhteystiedot={data}
                      includeToimitusaika={!yhteinenToimitusaika}
                      includeToimituspaikka={!yhteinenToimituspaikka}
                    />
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
