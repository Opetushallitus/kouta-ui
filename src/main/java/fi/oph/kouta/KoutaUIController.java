package fi.oph.kouta;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class KoutaUIController {

    @GetMapping(value = {
            "/",
            "/koulutus",
            "/koulutus/*",
            "/toteutus",
            "/toteutus/*",
            "/haku",
            "/haku/*",
            "/hakukohde",
            "/hakukohde/*",
            "/valintaperusteet",
            "/valintaperusteet/*"
    })

    public String frontProperties() {
        return "/index.html";
    }
}
