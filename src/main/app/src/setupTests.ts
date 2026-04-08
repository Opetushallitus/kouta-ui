import 'jest-styled-components';
import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';

import {
  isEditorState,
  serializeEditorState,
} from '#/src/components/LexicalEditorUI/utils';

// https://react.i18next.com/misc/testing
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Serialize Lexical editor
expect.addSnapshotSerializer({
  test: isEditorState,
  print: (value: any, serialize) => serialize(serializeEditorState(value)),
});
