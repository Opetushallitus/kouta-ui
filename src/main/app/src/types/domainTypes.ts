import { ENTITY } from '../constants';
import { components } from './kouta-backend.api';

export type KoulutusModel = components['schemas']['Koulutus'];

export type ToteutusModel = components['schemas']['Toteutus'];

export type HakuModel = components['schemas']['Haku'];

export type HakukohdeModel = components['schemas']['Hakukohde'];

export type ValintaperusteModel = components['schemas']['Valintaperuste'];

export type SoraKuvausModel = components['schemas']['Sorakuvaus'];

export type OppilaitosModel = components['schemas']['Oppilaitos'] & {
  lastModified?: string | null;
};

export type OppilaitoksetResponseModel =
  components['schemas']['OppilaitoksetResponse'];

export type OppilaitoksenOsaModel =
  components['schemas']['OppilaitoksenOsa'] & { lastModified: string | null };

export type Valintakokeet = Array<components['schemas']['Valintakoe']>;

export type ValintakoetilaisuusModel =
  components['schemas']['Valintakoetilaisuus'];

export type SisaltoModel = components['schemas']['Valintatapa']['sisalto'];

export type SisaltoTaulukkoModel = components['schemas']['SisaltoTaulukko'];

export type Kielivalinta = Array<components['schemas']['Kieli']>;

export type OrganisaatioModel = components['schemas']['Organisaatio'];

export type OrganisaatioHierarkiaModel =
  components['schemas']['OrganisaatioHierarkia'];

export type Osoite = components['schemas']['Osoite'];

export type EntityModelBase = {
  nimi?: components['schemas']['Nimi'];
  tila?: components['schemas']['Julkaisutila'];
  _enrichedData?: {
    esitysnimi?: components['schemas']['Nimi'];
  };
  muokkaaja?: string;
  modified?: string;
};

export type KoulutustyyppiModel = components['schemas']['Koulutustyyppi'];

// Merges all fields from a discriminated union into a single flat optional type.
// This lets us access any field from any of the metadata variants without
// narrowing to a specific variant first.
type WideUnion<T> = {
  [K in T extends any ? keyof T : never]?: T extends any
    ? K extends keyof T
      ? T[K]
      : never
    : never;
};

// All possible fields from the backend metadata variants, all optional.
// Fields missing from the OpenAPI schema are appended manually.
export type AnyToteutusMetadata = WideUnion<
  NonNullable<ToteutusModel['metadata']>
>;

export type LukiolinjaTieto = NonNullable<
  AnyToteutusMetadata['painotukset']
>[number];

export type LukiodiplomiTieto = NonNullable<
  AnyToteutusMetadata['diplomit']
>[number];

export type Osaamisala = NonNullable<
  AnyToteutusMetadata['osaamisalat']
>[number];

export type Opetus = NonNullable<AnyToteutusMetadata['opetus']>;

export type Lisatieto = NonNullable<Opetus['lisatiedot']>[number];

export type EntityTypeMap = {
  [ENTITY.KOULUTUS]: KoulutusModel;
  [ENTITY.TOTEUTUS]: ToteutusModel;
  [ENTITY.HAKU]: HakuModel;
  [ENTITY.HAKUKOHDE]: HakukohdeModel;
  [ENTITY.VALINTAPERUSTE]: ValintaperusteModel;
  [ENTITY.SORA_KUVAUS]: SoraKuvausModel;
  [ENTITY.OPPILAITOS]: OppilaitosModel;
  [ENTITY.OPPILAITOKSEN_OSA]: OppilaitoksenOsaModel;
};

export type OrganisaatioYhteystiedot =
  components['schemas']['Organisaatio']['yhteystiedot'];

export type PaikallinenTutkinnonOsa =
  components['schemas']['PaikallinenTutkinnonOsa'];

export type AmosaaOpetussuunnitelmatResponse =
  components['schemas']['AmosaaOpetussuunnitelmatResponse'];

export type AmosaaPaikallisetTutkinnonosatResponse =
  components['schemas']['AmosaaPaikallisetTutkinnonOsatResponse'];

export type AmosaaOmaTutkinnonosa =
  components['schemas']['AmosaaOmaTutkinnonosa'];

export type AnyKoulutusMetadata = WideUnion<
  NonNullable<KoulutusModel['metadata']>
>;
