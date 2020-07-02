import { isObject, isArray, mapValues } from 'lodash';
import parseEditorState from './draft/parseEditorState';

const parseSisaltoField = sisalto => {
  if (!isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    if (tyyppi === 'teksti') {
      return {
        tyyppi,
        data: isObject(data) ? mapValues(data, parseEditorState) : {},
      };
    }

    return { tyyppi, data };
  });
};

export default parseSisaltoField;
