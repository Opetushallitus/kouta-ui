import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import Flex from '../Flex';
import ValintatapaContentFields from '../ValintatapaContentFields';
import useKoodistoOptions from '../useKoodistoOptions';
import Textarea from '../Textarea';

import { noop } from '../../utils';

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} onBlur={noop} />
);

const renderTextareaField = ({ input }) => <Textarea {...input} />;

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
        Valintapajonon nimi
      </Typography>
      <Field
        name={`${valintatapa}.nimi.${language}`}
        component={renderInputField}
      />
    </Spacing>
    <Spacing marginBottom={2}>
      <ValintatapaContentFields name={`${valintatapa}.sisalto`} language={language} />
    </Spacing>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Kynnysehto
      </Typography>
      <Field
        name={`${valintatapa}.kynnysehto.${language}`}
        component={renderTextareaField}
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
  const { options } = useKoodistoOptions({ koodisto: 'valintatapajono' });

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <FieldArray
          name="valintatavat"
          component={renderValintavat}
          tapaOptions={options}
          language={activeLanguage}
        />
      )}
    </LanguageSelector>
  );
};

export default ValintatapaSection;
