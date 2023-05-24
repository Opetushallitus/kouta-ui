import { parseEditorState } from './utils';

test('parseEditorState default for unsupported tags', () => {
  expect(parseEditorState('<blink>test</blink>').toJSON()).toMatchObject({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'CustomTextNode',
              format: 0,
              text: 'test',
            },
          ],
        },
      ],
    },
  });
});

test('parseEditorState simple paragraph', () => {
  expect(parseEditorState('<p>test</p>').toJSON()).toMatchObject({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'CustomTextNode',
              format: 0,
              text: 'test',
            },
          ],
        },
      ],
    },
  });
});

test('parseEditorState heading and paragraph', () => {
  expect(
    parseEditorState('<h3>otsikko1</h3><p>sisalto</p>').toJSON()
  ).toMatchObject({
    root: {
      children: [
        {
          type: 'heading',
          tag: 'h3',
          children: [
            {
              type: 'CustomTextNode',
              text: 'otsikko1',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'CustomTextNode',
              format: 0,
              text: 'sisalto',
            },
          ],
        },
      ],
    },
  });
});

test('parseEditorState preserves basic unsupported HTML', () => {
  expect(
    parseEditorState('<h1>otsikko1</h1><p>sisalto</p>').toJSON()
  ).toMatchObject({
    root: {
      children: [
        {
          type: 'heading',
          tag: 'h1',
          children: [
            {
              type: 'CustomTextNode',
              text: 'otsikko1',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'CustomTextNode',
              format: 0,
              text: 'sisalto',
            },
          ],
        },
      ],
    },
  });
});

test('parseEditorState unordered list', () => {
  expect(
    parseEditorState('<ul><li>Item1</li><li>Item2</li2></ul>').toJSON()
  ).toMatchObject({
    root: {
      children: [
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Item1',
                  type: 'CustomTextNode',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Item2',
                  type: 'CustomTextNode',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 2,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'list',
          version: 1,
          listType: 'bullet',
          start: 1,
          tag: 'ul',
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
});

test('parseEditorState ordered list', () => {
  expect(
    parseEditorState('<ol><li>Item1</li><li>Item2</li2></ol>').toJSON()
  ).toMatchObject({
    root: {
      children: [
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Item1',
                  type: 'CustomTextNode',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Item2',
                  type: 'CustomTextNode',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 2,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'list',
          version: 1,
          listType: 'number',
          start: 1,
          tag: 'ol',
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
});
