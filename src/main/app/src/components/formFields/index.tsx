import _ from 'lodash';

import { AsyncKoodistoSelect } from '#/src/components/AsyncKoodistoSelect';
import { DateInput } from '#/src/components/DateInput';
import { DateTimeInput } from '#/src/components/DateTimeInput';
import { ImageInput } from '#/src/components/ImageInput';
import { KoulutusalaSelect } from '#/src/components/KoulutusalaSelect';
import { KoulutustyyppiSelect } from '#/src/components/KoulutustyyppiSelect';
import { LanguageSelect } from '#/src/components/LanguageSelect';
import { LexicalEditorUI } from '#/src/components/LexicalEditorUI';
import { FloatInput, IntegerInput } from '#/src/components/NumberInput';
import { PostinumeroSelect } from '#/src/components/PostinumeroSelect';
import {
  AsyncCreatableSelect,
  Select,
  AsyncSelect,
} from '#/src/components/Select';
import { SoraKuvausSelect } from '#/src/components/SoraKuvausSelect';
import { Switch } from '#/src/components/Switch';
import { TimeInput } from '#/src/components/TimeInput';
import { UrlInput } from '#/src/components/UrlInput';
import {
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
} from '#/src/components/virkailija';
import { YearSelect } from '#/src/components/YearSelect';

import { createComponent } from './utils';

export const simpleMapProps = ({ input, ...props }) => ({
  ...input,
  ...props,
});

// HUOM: rivien järjestys on merkityksellinen, eikä onBlur-nollausta saa poistaa.
//
// Field.tsx kääree siirretyn polun kenttien inputin ja lisää onBlur-käsittelijän,
// joka kirjoittaa tapahtuman arvon kentän arvoksi. Se on redux-formin BLUR-semantiikka
// ja sitä tarvitaan tekstikentissä: UrlInput lisää puuttuvan http://-etuliitteen
// juuri blurissa.
//
// Select-kentille sama käsittelijä olisi väärin. Niiden input.value on olio, kun taas
// DOM:n blur-tapahtuman target.value on merkkijono (selectin hakukentän sisältö, usein
// tyhjä). Arvot eroaisivat siis aina, ja käsittelijä ylikirjoittaisi valinnan
// hakutekstillä joka blurilla - eli hukkaisi dataa.
//
// Näillä kuudella select-mapperilla se ei tapahdu, koska onBlur nollataan TÄSSÄ
// input-levityksen JÄLKEEN ja kääreen käsittelijä jää siten käyttämättä.
// simpleMapProps päästää sen läpi, mikä on tekstikentille oikein.
//
// Jos ...input siirretään onBlur-rivin alle, tämä muuttuu hiljaisesta no-opista
// datahäviöksi.
export const selectMapProps = ({ input, ...props }) => ({
  ...input,
  onBlur: _.noop,
  ...props,
});

export const createFormFieldComponent = createComponent;

export const FormFieldInput = createComponent(Input, simpleMapProps);

export const FormFieldUrlInput = createComponent(UrlInput, simpleMapProps);

export const FormFieldRadio = createComponent(
  Radio,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    checked: Boolean(value),
    ...props,
  })
);

export const FormFieldRadioGroup = createComponent(RadioGroup, simpleMapProps);

export const FormFieldCheckbox = createComponent(
  Checkbox,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    checked: Boolean(value),
    ...props,
  })
);

export const FormFieldSwitch = createComponent(
  Switch,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    checked: Boolean(value),
    ...props,
  })
);

export const FormFieldCheckboxGroup = createComponent(
  CheckboxGroup,
  simpleMapProps
);

export const FormFieldHardcoded = value =>
  createComponent(Select, ({ input, id, ...props }) => ({
    ...input,
    value: { value: value },
    onBlur: _.noop,
    ...props,
    id,
  }));

export const FormFieldSelect = createComponent(
  Select,
  ({ input, id, ...props }) => ({
    ...input,
    onBlur: _.noop,
    ...props,
    id,
  })
);

export const FormFieldTimeInput = createComponent(TimeInput, simpleMapProps);

export const FormFieldDateTimeInput = createComponent(
  DateTimeInput,
  simpleMapProps
);

export const FormFieldDateInput = createComponent(DateInput, simpleMapProps);

export const FormFieldEditor = createComponent(LexicalEditorUI, simpleMapProps);

export const FormFieldYearSelect = createComponent(
  YearSelect,
  ({ input, id, ...props }) => ({
    ...input,
    onBlur: _.noop,
    ...props,
    id,
  })
);

export const FormFieldImageInput = createComponent(
  ImageInput,
  ({ input, ...props }) => ({
    ...input,
    uploadedImageUrl: input.value,
    ...props,
  })
);

export const FormFieldKoulutustyyppiSelect = createComponent(
  KoulutustyyppiSelect,
  simpleMapProps
);

export const FormFieldKoulutusalaSelect = createComponent(
  KoulutusalaSelect,
  selectMapProps
);

export const FormFieldSoraKuvausSelect = createComponent(
  SoraKuvausSelect,
  ({ input, id, ...props }) => ({
    ...input,
    onBlur: _.noop,
    ...props,
    id,
  })
);

export const FormFieldLanguageSelect = createComponent(
  LanguageSelect,
  selectMapProps
);

export const FormFieldPostinumeroSelect = createComponent(
  PostinumeroSelect,
  selectMapProps
);

export const FormFieldAsyncSelect = createComponent(
  AsyncSelect,
  selectMapProps
);

export const FormFieldAsyncKoodistoSelect = createComponent(
  AsyncKoodistoSelect,
  selectMapProps
);

export const FormFieldIntegerInput = createComponent(
  IntegerInput,
  simpleMapProps
);

export const FormFieldFloatInput = createComponent(FloatInput, simpleMapProps);

export const FormFieldAsyncCreatableSelect = createComponent(
  AsyncCreatableSelect,
  selectMapProps
);
