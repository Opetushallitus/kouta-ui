package fi.oph.kouta;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class KoutaUIController {

    @GetMapping(value = {
        "/",
        "/organisaatio/**",
        "/koulutus/**",
        "/toteutus/**",
        "/haku/**",
        "/hakukohde/**",
        "/valintaperusteet/**"
    })

    public String frontProperties() {
        return "/index.html";
    }
}
