import { parseEditorState } from './utils';

const testHeading = (tag: string, text: string) => ({
  type: 'heading',
  tag: tag,
  children: [
    {
      type: 'text',
      text: text,
    },
  ],
});

const testParagraphNode = (text: string) => ({
  type: 'paragraph',
  children: [
    {
      type: 'text',
      format: 0,
      text: text,
    },
  ],
});

const testList = (tag: string) => ({
  root: {
    children: [
      {
        children: listItems,
        direction: null,
        format: '',
        indent: 0,
        type: 'list',
        version: 1,
        listType: tag === 'ul' ? 'bullet' : 'number',
        start: 1,
        tag: tag,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

const listItems = [
  {
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: 'Item1',
        type: 'text',
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
        type: 'text',
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
];

test('parseEditorState default for unsupported tags', () => {
  expect(parseEditorState('<blink>test</blink>').toJSON()).toMatchObject({
    root: {
      children: [testParagraphNode('test')],
    },
  });
});

test('parseEditorState simple paragraph', () => {
  expect(parseEditorState('<p>test</p>').toJSON()).toMatchObject({
    root: {
      children: [testParagraphNode('test')],
    },
  });
});

test('parseEditorState heading and paragraph', () => {
  expect(
    parseEditorState('<h3>otsikko3</h3><p>test</p>').toJSON()
  ).toMatchObject({
    root: {
      children: [testHeading('h3', 'otsikko3'), testParagraphNode('test')],
    },
  });
});

test('parseEditorState preserves basic unsupported HTML', () => {
  expect(
    parseEditorState('<h1>otsikko1</h1><p>test</p>').toJSON()
  ).toMatchObject({
    root: {
      children: [testHeading('h1', 'otsikko1'), testParagraphNode('test')],
    },
  });
});

test('parseEditorState unordered list', () => {
  expect(
    parseEditorState('<ul><li>Item1</li><li>Item2</li2></ul>').toJSON()
  ).toMatchObject(testList('ul'));
});

test('parseEditorState ordered list', () => {
  expect(
    parseEditorState('<ol><li>Item1</li><li>Item2</li2></ol>').toJSON()
  ).toMatchObject(testList('ol'));
});
