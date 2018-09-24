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
        this.addOverride("host-tarjonta", environment.getRequiredProperty("host.host-tarjonta"));
        this.frontProperties.setProperty("kouta-backend.base-url", this.require("kouta-backend.base-url"));
        this.frontProperties.setProperty("kouta-backend.koulutus", this.require("kouta-backend.koulutus"));
        this.frontProperties.setProperty("kouta-backend.toteutus", this.require("kouta-backend.toteutus"));
        this.frontProperties.setProperty("kouta-backend.haku", this.require("kouta-backend.haku"));
    }
}