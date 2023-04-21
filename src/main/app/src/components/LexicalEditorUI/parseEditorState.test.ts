import { parseEditorState } from './utils';

test('parseEditorState simple paragraph', () => {
  expect(parseEditorState('<p>test</p>').toJSON()).toMatchObject({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
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
    parseEditorState('<h1>otsikko1</h1><p>sisalto</p>').toJSON()
  ).toMatchObject({
    root: {
      children: [
        {
          type: 'heading',
          tag: 'h1',
          children: [
            {
              type: 'text',
              text: 'otsikko1',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              format: 0,
              text: 'sisalto',
            },
          ],
        },
      ],
    },
  });
});

test('parseEditorState list', () => {
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
              type: 'text',
              text: 'otsikko1',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              format: 0,
              text: 'sisalto',
            },
          ],
        },
      ],
    },
  });
});
