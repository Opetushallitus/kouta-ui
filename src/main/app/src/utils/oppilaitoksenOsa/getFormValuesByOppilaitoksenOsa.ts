import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';

export const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kielivalinta,
    teemakuva,
    tila,
    metadata = {},
    oppilaitosOid,
    esikatselu = false,
  } = oppilaitoksenOsa;

  const {
    esittely,
    opiskelijoita,
    kampus,
    wwwSivu,
    jarjestaaUrheilijanAmmKoulutusta,
  } = metadata;

  return {
    tila,
    oppilaitosOid,
    kieliversiot: kielivalinta,
    esittely: _.mapValues(esittely || {}, parseEditorState),
    perustiedot: {
      opiskelijoita: _.isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
      wwwSivuUrl: wwwSivu?.url || {},
      wwwSivuNimi: wwwSivu?.nimi || {},
      jarjestaaUrheilijanAmmKoulutusta,
    },
    teemakuva,
    esikatselu,
  };
};
