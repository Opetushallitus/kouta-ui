import { createComponent } from './utils';
import { noop } from '../../utils';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Checkbox from '../Checkbox';
import CheckboxGroup from '../CheckboxGroup';
import Textarea from '../Textarea';
import Select from '../Select';
import DatePicker from '../DatePicker';
import DateTimeInput from '../DateTimeInput';
import TimeInput from '../TimeInput';
import Editor from '../Editor';

const simpleMapProps = ({ meta, input, ...props }) => ({
  ...input,
  ...props,
});

export const createFormFieldComponent = createComponent;

export const FormFieldInput = createComponent(Input, simpleMapProps);

export const FormFieldRadio = createComponent(
  Radio,
  ({ meta, input: { value, ...input }, ...props }) => ({
    ...input,
    value: !!value,
    ...props,
  }),
);

export const FormFieldRadioGroup = createComponent(RadioGroup, simpleMapProps);

export const FormFieldCheckbox = createComponent(
  Checkbox,
  ({ meta, input: { value, ...input }, ...props }) => ({
    ...input,
    value: !!value,
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
