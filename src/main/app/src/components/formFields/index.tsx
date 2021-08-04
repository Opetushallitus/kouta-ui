import _ from 'lodash';

import { AsyncKoodistoSelect } from '#/src/components/AsyncKoodistoSelect';
import { DateTimeInput } from '#/src/components/DateTimeInput';
import { Editor } from '#/src/components/Editor';
import { ImageInput } from '#/src/components/ImageInput';
import { KoulutusalaSelect } from '#/src/components/KoulutusalaSelect';
import { KoulutustyyppiSelect } from '#/src/components/KoulutustyyppiSelect';
import { LanguageSelect } from '#/src/components/LanguageSelect';
import { PostinumeroSelect } from '#/src/components/PostinumeroSelect';
import { Select, AsyncSelect } from '#/src/components/Select';
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

export const simpleMapProps = ({ meta, input, ...props }) => ({
  ...input,
  ...props,
});

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
  ({ meta, input: { value, ...input }, ...props }) => ({
    ...input,
    checked: !!value,
    ...props,
  })
);

export const FormFieldRadioGroup = createComponent(RadioGroup, simpleMapProps);

export const FormFieldCheckbox = createComponent(
  Checkbox,
  ({ meta, input: { value, ...input }, ...props }) => ({
    ...input,
    checked: !!value,
    ...props,
  })
);

export const FormFieldSwitch = createComponent(
  Switch,
  ({ meta, input: { value, checked, ...input }, ...props }) => ({
    ...input,
    checked: !!value,
    ...props,
  })
);

export const FormFieldCheckboxGroup = createComponent(
  CheckboxGroup,
  simpleMapProps
);

export const FormFieldSelect = createComponent(
  Select,
  ({ disabled, meta, input, id, ...props }) => ({
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

export const FormFieldEditor = createComponent(Editor, simpleMapProps);

export const FormFieldYearSelect = createComponent(
  YearSelect,
  ({ meta, input, id, ...props }) => ({
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
  ({ meta, input, id, ...props }) => ({
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
