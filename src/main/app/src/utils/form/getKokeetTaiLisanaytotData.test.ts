import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { getKokeetTaiLisanaytotData } from '#/src/utils/form/getKokeetTaiLisanaytotData';
import {
  getKieleistyksetForKieliversiot,
  getSerializedKieleistyksetFromKieliversiot,
} from '#/src/utils/pickTranslations';

const kieliversiot: Array<LanguageCode> = ['fi'];

const getMetadata = koe =>
  getKokeetTaiLisanaytotData({
    valintakoeValues: { kokeetTaiLisanaytot: [koe] },
    kieleistykset: getKieleistyksetForKieliversiot(kieliversiot),
    kieleistyksetSerialized:
      getSerializedKieleistyksetFromKieliversiot(kieliversiot),
  })![0]!.metadata;

const koeWithOhjeet = {
  tyyppi: { value: 'valintakokeentyyppi_1#1' },
  nimi: { fi: 'Koe' },
  liittyyEnnakkovalmistautumista: true,
  ohjeetEnnakkovalmistautumiseen: { fi: parseEditorState('<p>Ohjeet</p>') },
  erityisjarjestelytMahdollisia: true,
  ohjeetErityisjarjestelyihin: {
    fi: parseEditorState('<p>Erityisjärjestelyt</p>'),
  },
  tilaisuudet: [],
};

test('getKokeetTaiLisanaytotData keeps the ohjeet when the checkboxes are ticked', () => {
  const metadata = getMetadata(koeWithOhjeet);

  expect(metadata.ohjeetEnnakkovalmistautumiseen).toEqual({
    fi: '<p>Ohjeet</p>',
  });
  expect(metadata.ohjeetErityisjarjestelyihin).toEqual({
    fi: '<p>Erityisjärjestelyt</p>',
  });
});

// Ilman rastia ohjekenttä on piilossa. Teksti voi silti olla arvoissa: se tulee
// initialValuesista, kun lomake avataan hakukohteelle jolle se on jäänyt kantaan.
test('getKokeetTaiLisanaytotData drops the ohjeet when the checkboxes are not ticked', () => {
  const metadata = getMetadata({
    ...koeWithOhjeet,
    liittyyEnnakkovalmistautumista: false,
    erityisjarjestelytMahdollisia: false,
  });

  expect(metadata.liittyyEnnakkovalmistautumista).toBe(false);
  expect(metadata.ohjeetEnnakkovalmistautumiseen).toEqual({});
  expect(metadata.erityisjarjestelytMahdollisia).toBe(false);
  expect(metadata.ohjeetErityisjarjestelyihin).toEqual({});
});
