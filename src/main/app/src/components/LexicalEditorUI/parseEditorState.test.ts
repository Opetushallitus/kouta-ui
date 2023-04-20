import { parseEditorState } from './utils';

test.skip('parseEditorState 1', () => {
  expect(parseEditorState('<p><em>test</em></p>')).toMatchObject({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              format: 2,
              text: 'test',
            },
          ],
        },
      ],
    },
  });
});

test.skip('parseEditorState 2', () => {
  expect(parseEditorState('<p>test</p>')).toMatchObject({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'test',
            },
          ],
        },
      ],
    },
  });
});
