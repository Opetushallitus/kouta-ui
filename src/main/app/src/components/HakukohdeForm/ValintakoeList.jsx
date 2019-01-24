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

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

const renderTextareaField = ({ input }) => <Textarea {...input} />;


const renderValintakoeFields = ({ fields, language }) => (
  <>
    {fields.map((koe, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2}>
          <Typography variant="h6" marginBottom={1}>
            Osoite
          </Typography>
          <Field name={`${koe}.osoite.${language}`} component={renderInputField} />
        </Spacing>

        <Spacing marginBottom={2}>
          <Flex>
            <FlexItem grow={0} basis="30%">
              <Typography variant="h6" marginBottom={1}>
                Postinumero
              </Typography>
              <Field
                name={`${koe}.postinumero`}
                component={renderInputField}
                type="number"
              />
            </FlexItem>
            <FlexItem grow={1} paddingLeft={2}>
              <Typography variant="h6" marginBottom={1}>
                Postitoimipaikka
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
            <FlexItem grow={1} marginRight={2}>
              <Typography variant="h6" marginBottom={1}>
                Alkaa
              </Typography>
              <Flex>
                <FlexItem grow={1}>
                  <Field
                    name={`${koe}.fromDate`}
                    component={renderInputMaskField}
                    placeholder="pp.kk.vvvv"
                    mask="99.99.9999"
                  />
                </FlexItem>
                <FlexItem grow={0} basis="30%" paddingLeft={2}>
                  <Field
                    name={`${koe}.fromTime`}
                    component={renderInputMaskField}
                    placeholder="tt:mm"
                    mask="99:99"
                  />
                </FlexItem>
              </Flex>
              <Typography variant="secondary" as="div" marginTop={1}>
                Alkuajan päivämäärä ja kellonaika
              </Typography>
            </FlexItem>
            <FlexItem grow={1} marginLeft={2}>
              <Typography variant="h6" marginBottom={1}>
                Päättyy
              </Typography>
              <Flex>
                <FlexItem grow={1}>
                  <Field
                    name={`${koe}.toDate`}
                    component={renderInputMaskField}
                    placeholder="pp.kk.vvvv"
                    mask="99.99.9999"
                  />
                </FlexItem>
                <FlexItem grow={0} basis="30%" paddingLeft={2}>
                  <Field
                    name={`${koe}.toTime`}
                    component={renderInputMaskField}
                    placeholder="tt:mm"
                    mask="99:99"
                  />
                </FlexItem>
              </Flex>
              <Typography variant="secondary" as="div" marginTop={1}>
                Päättymisajan päivämäärä ja kellonaika
              </Typography>
            </FlexItem>
          </Flex>
        </Spacing>

        <Spacing>
          <Typography variant="h6" marginBottom={1}>
            Lisätietoja
          </Typography>
          <Field name={`${koe}.lisatietoja.${language}`} component={renderTextareaField} />
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
            Poista
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
      >
        Lisää tilaisuus
      </Button>
    </Spacing>
  </>
);

const ValintakoeList = ({ language }) => (
  <FieldArray name="kokeet" component={renderValintakoeFields} language={language} />
);

export default ValintakoeList;
