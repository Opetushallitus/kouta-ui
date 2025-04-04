import type { EditorThemeClasses } from 'lexical';

import './EditorTheme.css';

const theme: EditorThemeClasses = {
  blockCursor: 'EditorTheme__blockCursor',
  characterLimit: 'EditorTheme__characterLimit',
  heading: {
    h3: 'EditorTheme__h3',
    h4: 'EditorTheme__h4',
  },
  indent: 'EditorTheme__indent',
  link: 'EditorTheme__link',
  list: {
    listitem: 'EditorTheme__listItem',
    nested: {
      listitem: 'EditorTheme__nestedListItem',
    },
    olDepth: [
      'EditorTheme__ol1',
      'EditorTheme__ol2',
      'EditorTheme__ol3',
      'EditorTheme__ol4',
      'EditorTheme__ol5',
    ],
    ul: 'EditorTheme__ul',
  },
  ltr: 'EditorTheme__ltr',
  paragraph: 'EditorTheme__paragraph',
  rtl: 'EditorTheme__rtl',
  text: {
    bold: 'EditorTheme__textBold',
  },
};

export default theme;
