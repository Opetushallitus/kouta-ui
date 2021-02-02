import _ from 'lodash';
import { parseEditorState } from '#/src/components/Editor/utils';

const parseSisaltoField = sisalto => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }: { tyyppi: string; data: any }) => {
    if (tyyppi === 'teksti') {
      return {
        tyyppi,
        data: _.isObject(data) ? _.mapValues(data, parseEditorState) : {},
      };
    }

    return { tyyppi, data };
  });
};

export default parseSisaltoField;
