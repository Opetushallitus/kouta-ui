import { createComponent } from './utils';
import { noop } from '../../utils';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Checkbox from '../Checkbox';
import CheckboxGroup from '../CheckboxGroup';
import Textarea from '../Textarea';
import Select, { AsyncSelect } from '../Select';
import DatePicker from '../DatePicker';
import DatePickerInput from '../DatePickerInput';
import DateTimeInput from '../DateTimeInput';
import TimeInput from '../TimeInput';
import Editor from '../Editor';
import YearSelect from '../YearSelect';
import FileInput from '../FileInput';
import KieliversiotSelect from '../KieliversiotSelect';
import KoulutustyyppiSelect from '../KoulutustyyppiSelect';
import SoraKuvausSelect from '../SoraKuvausSelect';
import LanguageSelect from '../LanguageSelect';
import PostinumeroSelect from '../PostinumeroSelect';
import AsyncKoodistoSelect from '../AsyncKoodistoSelect';

export const simpleMapProps = ({ meta, input, ...props }) => ({
  ...input,
  ...props,
});

export const selectMapProps = ({ input, ...props }) => ({
  ...input,
  onBlur: noop,
  ...props,
});

export const createFormFieldComponent = createComponent;

export const FormFieldInput = createComponent(Input, simpleMapProps);

export const FormFieldRadio = createComponent(
  Radio,
  ({ meta, input: { value, ...input }, ...props }) => ({
    ...input,
    checked: !!value,
    ...props,
  }),
);

export const FormFieldRadioGroup = createComponent(RadioGroup, simpleMapProps);

export const FormFieldCheckbox = createComponent(
  Checkbox,
  ({ meta, input: { value, ...input }, ...props }) => ({
    ...input,
    checked: !!value,
    ...props,
  }),
);

export const FormFieldCheckboxGroup = createComponent(
  CheckboxGroup,
  simpleMapProps,
);

export const FormFieldTextarea = createComponent(Textarea, simpleMapProps);

export const FormFieldSelect = createComponent(
  Select,
  ({ meta, input, id, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
    id,
  }),
);

export const FormFieldDatePicker = createComponent(DatePicker, simpleMapProps);

export const FormFieldTimeInput = createComponent(TimeInput, simpleMapProps);

export const FormFieldDateTimeInput = createComponent(
  DateTimeInput,
  simpleMapProps,
);

export const FormFieldEditor = createComponent(Editor, simpleMapProps);

export const FormFieldYearSelect = createComponent(
  YearSelect,
  ({ meta, input, id, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
    id,
  }),
);

export const FormFieldFileInput = createComponent(FileInput, simpleMapProps);

export const FormFieldKieliversiotSelect = createComponent(
  KieliversiotSelect,
  simpleMapProps,
);

export const FormFieldKoulutustyyppiSelect = createComponent(
  KoulutustyyppiSelect,
  simpleMapProps,
);

export const FormFieldSoraKuvausSelect = createComponent(
  SoraKuvausSelect,
  ({ meta, input, id, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
    id,
  }),
);

export const FormFieldLanguageSelect = createComponent(
  LanguageSelect,
  selectMapProps,
);

export const FormFieldDatePickerInput = createComponent(
  DatePickerInput,
  simpleMapProps,
);

export const FormFieldPostinumeroSelect = createComponent(
  PostinumeroSelect,
  selectMapProps,
);

export const FormFieldAsyncSelect = createComponent(
  AsyncSelect,
  selectMapProps,
);

export const FormFieldAsyncKoodistoSelect = createComponent(
  AsyncKoodistoSelect,
  selectMapProps,
);
