export { test } from '@playwright/test';

// Tässä oli aiemmin automaattinen fixture, joka kaatoi jokaisen testin, jos
// kenttärekisterien varjovertailu raportoi eron. Vertailu poistui redux-formin
// mukana: vertailukohtaa ei ole, joten väite ei voinut enää kaatua. Sellainen
// väite on huonompi kuin ei väitettä lainkaan, koska se näyttää turvaverkolta.
//
// Moduuli jää olemassa pelkkänä uudelleenvientinä, jotta ~15 spec-tiedostoa ei
// tarvitse muuttaa. Jos uusia jaettuja fixtureita tarvitaan, ne kuuluvat tänne.
