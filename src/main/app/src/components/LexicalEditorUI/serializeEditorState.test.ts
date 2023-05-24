import { parseEditorState, serializeEditorState } from './utils';

test('serializeEditorState headings', () => {
  const es = parseEditorState('<h3>test</h3><h4>title</h4>');
  expect(serializeEditorState(es)).toEqual('<h3>test</h3><h4>title</h4>');
});

test('serializeEditorState simple paragraph', () => {
  const es = parseEditorState('<p>test</p>');
  expect(serializeEditorState(es)).toEqual('<p>test</p>');
});

test('serializeEditorState paragraph with line break', () => {
  const es = parseEditorState('<p>test<br></p>');
  expect(serializeEditorState(es)).toEqual('<p>test<br></p>');
});

test('serializeEditorState paragraph with em', () => {
  const es = parseEditorState('<p><em>test</em></p>');
  expect(serializeEditorState(es)).toEqual('<p><em>test</em></p>');
});

test('serializeEditorState <strong>', () => {
  const es = parseEditorState('<strong>test</strong>');
  expect(serializeEditorState(es)).toEqual('<p><strong>test</strong></p>');
});

test('serializeEditorState paragraph with <a>', () => {
  const es = parseEditorState(
    '<p><a href="http://example.com" target="_blank">example</a></p><p></p>'
  );
  expect(serializeEditorState(es)).toEqual(
    '<p><a href="http://example.com" target="_blank">example</a></p><p><br></p>'
  );
});

test('serializeEditorState headings with paragraphs', () => {
  const es = parseEditorState(
    '<h3>heading1</h3><p>paragraph1</p><h4>heading2</h4><p>paragraph2</p>'
  );
  expect(serializeEditorState(es)).toEqual(
    '<h3>heading1</h3><p>paragraph1</p><h4>heading2</h4><p>paragraph2</p>'
  );
});

test('serializeEditorState span', () => {
  const es = parseEditorState('<strong>qwe</strong><span>asd</span>');
  expect(serializeEditorState(es)).toEqual('<p><strong>qwe</strong>asd</p>');
});

test('serializeEditorState whitespace in HTML', () => {
  const es = parseEditorState(
    '<h1>heading1</h1> <p>paragraph1</p> <h2>heading2</h2> <p>paragraph2</p>'
  );
  expect(serializeEditorState(es)).toEqual(
    '<h1>heading1</h1><p>paragraph1</p><h2>heading2</h2><p>paragraph2</p>'
  );
});
