package fi.oph.kouta;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
public class KoutaUIController {

    @GetMapping(value = {
            "/"})
    public String frontProperties() {
        return "/index.html";
    }
}