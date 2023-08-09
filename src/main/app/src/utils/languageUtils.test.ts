import { formValueExists } from '.';
import { getInvalidTranslations } from './languageUtils';
import { createEmptyEditorState } from '../components/LexicalEditorUI/utils';

describe('getInvalidTranslations', () => {
  test.each([[{ fi: createEmptyEditorState() }, ['fi', 'sv'], []]])(
    'Should return empty array when optional and given empty editor state',
    (obj: any, languages: any, invalidTranslations: any) => {
      expect(
        getInvalidTranslations(obj, languages, formValueExists, true)
      ).toEqual(invalidTranslations);
    }
  );
});
