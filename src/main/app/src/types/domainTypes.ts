import { components } from './kouta-backend.api';

export type KoulutusModel = components['schemas']['Koulutus'];

export type ToteutusModel = components['schemas']['Toteutus'];

export type HakuModel = components['schemas']['Haku'];

export type HakukohdeModel = components['schemas']['Hakukohde'];

export type ValintaperusteModel = components['schemas']['Valintaperuste'];

export type SoraKuvausModel = components['schemas']['Sorakuvaus'];

export type OppilaitosModel = components['schemas']['Oppilaitos'] & {
  lastModified: string | null;
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
