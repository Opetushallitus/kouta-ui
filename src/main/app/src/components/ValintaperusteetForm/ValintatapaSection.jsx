import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Typography from '../Typography';
import Input from '../Input';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import Textarea from '../Textarea';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import Flex from '../Flex';
import { getKoodisto } from '../../apiUtils';
import ApiAsync from '../ApiAsync';
import ValintatapaContentFields from '../ValintatapaContentFields';
import Editor from '../Editor';

import {
  getFirstLanguageValue,
  isArray,
  arrayToTranslationObject,
} from '../../utils';

const getValintatavat = async ({ httpClient, apiUrls }) => {
  const valintatavat = await getKoodisto({
    koodistoUri: 'valintatapajono',
    httpClient,
    apiUrls,
  });

  return isArray(valintatavat)
    ? valintatavat.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getValintatapaOptions = valintatavat =>
  valintatavat.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const nop = () => {};

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} onBlur={nop} />
);

const renderTextareaField = ({ input }) => <Textarea {...input} />;

const renderEditorField = ({ input }) => <Editor {...input} />

const renderValintatapaFields = ({ valintatapa, tapaOptions, language }) => (
  <>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Valitse tapa
      </Typography>
      <Field
        name={`${valintatapa}.tapa`}
        component={renderSelectField}
        options={tapaOptions}
      />
    </Spacing>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Valitse kuvaus
      </Typography>
      <Field
        name={`${valintatapa}.kuvaus.${language}`}
        component={renderTextareaField}
      />
    </Spacing>
    <Spacing marginBottom={2}>
      <ValintatapaContentFields name={`${valintatapa}.sisalto.${language}`} />
    </Spacing>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Kynnysehto
      </Typography>
      <Field
        name={`${valintatapa}.kynnysehto.${language}`}
        component={renderEditorField}
      />
    </Spacing>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Enimmäispistemäärä
      </Typography>
      <Field
        name={`${valintatapa}.enimmaispistemaara`}
        component={renderInputField}
        type="number"
      />
    </Spacing>
    <Spacing>
      <Typography variant="h6" marginBottom={1}>
        Vähimmäispistemäärä
      </Typography>
      <Field
        name={`${valintatapa}.vahimmaispistemaara`}
        component={renderInputField}
        type="number"
      />
    </Spacing>
  </>
);

const renderValintavat = ({ fields, tapaOptions, language }) => (
  <>
    {fields.map((valintatapa, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2}>
          {renderValintatapaFields({ valintatapa, tapaOptions, language })}
        </Spacing>
        <Flex justifyEnd>
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
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
      Lisää valintapa
    </Button>
  </>
);

const ValintatapaSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <ApiAsync promiseFn={getValintatavat}>
          {({ data }) => (
            <FieldArray
              name="valintatavat"
              component={renderValintavat}
              tapaOptions={getValintatapaOptions(data || [])}
              language={activeLanguage}
            />
          )}
        </ApiAsync>
      )}
    </LanguageSelector>
  );
};

export default ValintatapaSection;
