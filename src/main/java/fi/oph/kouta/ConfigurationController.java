package fi.oph.kouta;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/rest/config")
public class ConfigurationController {

    @Autowired
    private UrlConfiguration urlConfiguration;

    @GetMapping(value = "/frontProperties", produces = "application/json")
    public String frontProperties() {
        return urlConfiguration.frontPropertiesToJson();
    }
}
