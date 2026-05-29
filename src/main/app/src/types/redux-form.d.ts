import 'redux-form';

declare module 'redux-form' {
  interface FormState {
    initial?: { [fieldName: string]: any };
  }
}
