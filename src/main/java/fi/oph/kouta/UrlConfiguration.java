package fi.oph.kouta;

import fi.vm.sade.properties.OphProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class UrlConfiguration extends OphProperties {

    @Autowired
    public UrlConfiguration(Environment environment) {
        addFiles("/kouta-ui-oph.properties");
        this.addOverride("host-virkailija", environment.getRequiredProperty("host.host-virkailija"));
        this.addOverride("host-oppija", environment.getRequiredProperty("host.host-oppija"));
        this.addOverride("host-eperusteet", environment.getRequiredProperty("host.host-eperusteet"));

        this.frontProperties.setProperty("eperusteet.base-url", this.require("eperusteet.base-url"));
        this.frontProperties.setProperty("kouta-backend.base-url", this.require("kouta-backend.base-url"));

        this.frontProperties.setProperty("konfo-ui.koulutus", this.require("konfo-ui.koulutus"));
        this.frontProperties.setProperty("kouta-backend.koulutus", this.require("kouta-backend.koulutus"));
        this.frontProperties.setProperty("kouta-backend.koulutus-by-oid", this.require("kouta-backend.koulutus-by-oid"));
        this.frontProperties.setProperty("kouta-backend.koulutus-list", this.require("kouta-backend.koulutus-list"));
        this.frontProperties.setProperty("kouta-backend.koulutus-toteutukset", this.require("kouta-backend.koulutus-toteutukset"));
        this.frontProperties.setProperty("kouta-backend.oppilaitostyypit-by-koulutustyypit", this.require("kouta-backend.oppilaitostyypit-by-koulutustyypit"));

        this.frontProperties.setProperty("konfo-ui.toteutus", this.require("konfo-ui.toteutus"));
        this.frontProperties.setProperty("kouta-backend.toteutus", this.require("kouta-backend.toteutus"));
        this.frontProperties.setProperty("kouta-backend.toteutus-by-oid", this.require("kouta-backend.toteutus-by-oid"));
        this.frontProperties.setProperty("kouta-backend.toteutus-list", this.require("kouta-backend.toteutus-list"));
        this.frontProperties.setProperty("kouta-backend.toteutus-hakukohteet", this.require("kouta-backend.toteutus-hakukohteet"));
        this.frontProperties.setProperty("kouta-backend.toteutus-copy", this.require("kouta-backend.toteutus-copy"));

        this.frontProperties.setProperty("kouta-backend.haku", this.require("kouta-backend.haku"));
        this.frontProperties.setProperty("kouta-backend.haku-by-oid", this.require("kouta-backend.haku-by-oid"));
        this.frontProperties.setProperty("kouta-backend.haku-list", this.require("kouta-backend.haku-list"));
        this.frontProperties.setProperty("kouta-backend.haku-hakukohteet", this.require("kouta-backend.haku-hakukohteet"));

        this.frontProperties.setProperty("kouta-backend.hakukohde", this.require("kouta-backend.hakukohde"));
        this.frontProperties.setProperty("kouta-backend.hakukohde-by-oid", this.require("kouta-backend.hakukohde-by-oid"));

        this.frontProperties.setProperty("konfo-ui.valintaperuste", this.require("konfo-ui.valintaperuste"));
        this.frontProperties.setProperty("kouta-backend.valintaperuste", this.require("kouta-backend.valintaperuste"));
        this.frontProperties.setProperty("kouta-backend.valintaperuste-by-oid", this.require("kouta-backend.valintaperuste-by-oid"));
        this.frontProperties.setProperty("kouta-backend.valintaperuste-list", this.require("kouta-backend.valintaperuste-list"));
        this.frontProperties.setProperty("kouta-backend.ammattinimike-search", this.require("kouta-backend.ammattinimike-search"));
        this.frontProperties.setProperty("kouta-backend.asiasana-search", this.require("kouta-backend.asiasana-search"));
        this.frontProperties.setProperty("kouta-backend.login", this.require("kouta-backend.login"));
        this.frontProperties.setProperty("kouta-backend.session", this.require("kouta-backend.session"));

        this.frontProperties.setProperty("kouta-backend.soraKuvaus", this.require("kouta-backend.soraKuvaus"));
        this.frontProperties.setProperty("kouta-backend.soraKuvaus-by-oid", this.require("kouta-backend.soraKuvaus-by-oid"));
        this.frontProperties.setProperty("kouta-backend.soraKuvaus-list", this.require("kouta-backend.soraKuvaus-list"));

        this.frontProperties.setProperty("konfo-ui.oppilaitos", this.require("konfo-ui.oppilaitos"));
        this.frontProperties.setProperty("kouta-backend.oppilaitos", this.require("kouta-backend.oppilaitos"));
        this.frontProperties.setProperty("kouta-backend.oppilaitos-by-oid", this.require("kouta-backend.oppilaitos-by-oid"));
        this.frontProperties.setProperty("kouta-backend.oppilaitokset-by-oids", this.require("kouta-backend.oppilaitokset-by-oids"));

        this.frontProperties.setProperty("konfo-ui.oppilaitoksenOsa", this.require("konfo-ui.oppilaitoksenOsa"));
        this.frontProperties.setProperty("kouta-backend.oppilaitoksenOsa", this.require("kouta-backend.oppilaitoksenOsa"));
        this.frontProperties.setProperty("kouta-backend.oppilaitoksenOsa-by-oid", this.require("kouta-backend.oppilaitoksenOsa-by-oid"));

        this.frontProperties.setProperty("kouta-backend.search.koulutukset", this.require("kouta-backend.search.koulutukset"));
        this.frontProperties.setProperty("kouta-backend.search.koulutus", this.require("kouta-backend.search.koulutus"));
        this.frontProperties.setProperty("kouta-backend.search.toteutukset", this.require("kouta-backend.search.toteutukset"));
        this.frontProperties.setProperty("kouta-backend.search.haut", this.require("kouta-backend.search.haut"));
        this.frontProperties.setProperty("kouta-backend.search.hakukohteet", this.require("kouta-backend.search.hakukohteet"));
        this.frontProperties.setProperty("kouta-backend.search.valintaperusteet", this.require("kouta-backend.search.valintaperusteet"));
        this.frontProperties.setProperty("kouta-backend.upload-teemakuva", this.require("kouta-backend.upload-teemakuva"));
        this.frontProperties.setProperty("kouta-backend.upload-logo", this.require("kouta-backend.upload-logo"));

        this.frontProperties.setProperty("koodisto-service.base-url", this.require("koodisto-service.base-url"));
        this.frontProperties.setProperty("koodisto-service.sisaltyy-alakoodit", this.require("koodisto-service.sisaltyy-alakoodit"));
        this.frontProperties.setProperty("koodisto-service.sisaltyy-ylakoodit", this.require("koodisto-service.sisaltyy-ylakoodit"));
        this.frontProperties.setProperty("koodisto-service.koodi", this.require("koodisto-service.koodi"));
        this.frontProperties.setProperty("koodisto-service.codeelement", this.require("koodisto-service.codeelement"));

        this.frontProperties.setProperty("eperusteet.kooste", this.require("eperusteet.kooste"));
        this.frontProperties.setProperty("eperusteet.sisalto", this.require("eperusteet.sisalto"));
        this.frontProperties.setProperty("eperusteet.tutkinnonosat", this.require("eperusteet.tutkinnonosat"));

        this.frontProperties.setProperty("eperusteet-service.base-url", this.require("eperusteet-service.base-url"));
        this.frontProperties.setProperty("eperusteet-service.peruste-by-id", this.require("eperusteet-service.peruste-by-id"));
        this.frontProperties.setProperty("eperusteet-service.perusteet-koulutuskoodilla", this.require("eperusteet-service.perusteet-koulutuskoodilla"));
        this.frontProperties.setProperty("eperusteet-service.osaamisalakuvaukset", this.require("eperusteet-service.osaamisalakuvaukset"));
        this.frontProperties.setProperty("eperusteet-service.peruste-tutkinnonosat", this.require("eperusteet-service.peruste-tutkinnonosat"));
        this.frontProperties.setProperty("eperusteet-service.tutkinnonosankuvaukset", this.require("eperusteet-service.tutkinnonosankuvaukset"));
        this.frontProperties.setProperty("eperusteet-service.peruste-rakenne", this.require("eperusteet-service.peruste-rakenne"));
        this.frontProperties.setProperty("eperusteet-service.peruste-sisalto", this.require("eperusteet-service.peruste-sisalto"));
        this.frontProperties.setProperty("eperusteet-service.lukiodiplomit", this.require("eperusteet-service.lukiodiplomit"));
        this.frontProperties.setProperty("eperusteet-service.lukiodiplomi-tiedot", this.require("eperusteet-service.lukiodiplomi-tiedot"));

        this.frontProperties.setProperty("organisaatio-service.base-url", this.require("organisaatio-service.base-url"));
        this.frontProperties.setProperty("organisaatio-service.children", this.require("organisaatio-service.children"));
        this.frontProperties.setProperty("organisaatio-service.organisaatio-by-oid", this.require("organisaatio-service.organisaatio-by-oid"));
        this.frontProperties.setProperty("organisaatio-service.organisaatiot-by-oids", this.require("organisaatio-service.organisaatiot-by-oids"));
        this.frontProperties.setProperty("organisaatio-service.hierarkia-haku", this.require("organisaatio-service.hierarkia-haku"));

        this.frontProperties.setProperty("lokalisaatio-service.localisation", this.require("lokalisaatio-service.localisation"));
    
        this.frontProperties.setProperty("virkailija-raamit.raamitJs", this.require("virkailija-raamit.raamitJs"));
        
        this.frontProperties.setProperty("kayttooikeus-service.me", this.require("kayttooikeus-service.me"));
        this.frontProperties.setProperty("kayttooikeus-service.kayttajan-organisaatiot", this.require("kayttooikeus-service.kayttajan-organisaatiot"));

        this.frontProperties.setProperty("cas.login", this.require("cas.login"));

        this.frontProperties.setProperty("lomake-editori.lomakkeet", this.require("lomake-editori.lomakkeet"));
        this.frontProperties.setProperty("lomake-editori.cas", this.require("lomake-editori.cas"));
        this.frontProperties.setProperty("lomake-editori.muokkaus-sivu", this.require("lomake-editori.muokkaus-sivu"));

        this.frontProperties.setProperty("oppijanumerorekisteri-service.henkilo", this.require("oppijanumerorekisteri-service.henkilo"));
        this.frontProperties.setProperty("oppijanumerorekisteri-service.asiointiKieli", this.require("oppijanumerorekisteri-service.asiointiKieli"));

        this.frontProperties.setProperty("hakukohderyhmapalvelu.haun-asetukset", this.require("hakukohderyhmapalvelu.haun-asetukset"));
        this.frontProperties.setProperty("organisaatiopalvelu.organisaation-muokkaus-ui", this.require("organisaatiopalvelu.organisaation-muokkaus-ui"));
    }
}
