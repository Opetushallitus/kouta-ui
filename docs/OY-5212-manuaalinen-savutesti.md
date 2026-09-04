# OY-5212 — manual regression smoke test

Scope: the `OY-5212` branch, i.e. moving all eight entity forms from **redux-form**
to **react-final-form** and deleting redux-form.

Goal of this pass: **a robustness signal**, not exhaustive coverage. Every section says
what a failure there would mean, so a red check tells you where the implementation is
thin rather than just "something broke".

Estimated time: **core pass ≈ 2 h** (sections 3–6), **extended pass ≈ +1.5 h**
(sections 7–10).

---

## 1. What actually changed, in tester's terms

| Change | What it can break |
|---|---|
| All eight forms now run on react-final-form | anything on any form |
| Every `Field` / `FieldArray` / `Fields` goes through an in-house wrapper that **re-implements redux-form's quirks by hand** | per-field mechanics: focus, emptying a field, URL prefixing on blur, selects on blur |
| The bookkeeping of "which fields are on screen" was rebuilt from scratch (`FieldRegistry`) | **what gets cleared in the backend**, and **what gets validated** |
| Form state is no longer in a global Redux store — it lives inside each form | saving spinner / form disabling, unsaved-changes warning, any component that read form state from outside the form |

The eight forms: **Koulutus, Toteutus, Hakukohde, Haku, Valintaperuste, SORA-kuvaus,
Oppilaitos, Oppilaitoksen osa.**

### The one non-obvious mechanism you must understand before section 4

kouta clears data in the backend by **hiding a field**. When a field disappears from the
screen, the save payload sends `null` for it, and the backend treats `null` as "erase
this". The list of "fields that were on screen and then weren't" used to be maintained by
redux-form internals; it is now maintained by kouta's own code.

That gives two independent failure directions, both silent in the UI:

- **Not cleared** — user hides a filled field, saves, and the old value stays in the
  backend. Visible only on reload or in the payload.
- **Wrongly cleared** — a field unmounts transiently during ordinary interaction and
  **published data the user never touched gets erased**. This is the destructive one, and
  it is the direction the automated suite covers most thinly.

Only four forms build their payload this way: **Koulutus, Toteutus, Hakukohde, Haku**.
The other four are not exposed to the clearing bug — but *all eight* get their
validation visibility from the same registry.

---

## 2. Setup

1. Environment with a real kouta-backend (QA/untuva). Have both roles available:
   - an **OPH-virkailija** account,
   - an **oppilaitos-level** account with narrower rights.
2. Open DevTools before you start and keep it open the whole session:
   - **Network** tab, filter `Fetch/XHR`, tick **Preserve log**.
   - **Console** tab visible in the drawer.
3. How to read a save: pressing **Tallenna** fires `PUT` (create) or `POST` (edit) to
   `…/kouta-backend/<entity>`. Click the request → **Payload / Request** to see the body.
   `"field": null` in the body means *clear this in the backend*.
4. Console rules for the whole session — note every occurrence:
   - **any red error** → report, with the form and the action;
   - `Warning: A component is changing an uncontrolled input to be controlled` (or the
     reverse) → note it; one known instance is expected in Toteutus (osaamisalat), the
     rest are findings;
   - `Cannot update a component while rendering a different component`, `Maximum update
     depth exceeded`, missing-key warnings → report.
5. A **blank page or a thrown error on opening a form** is a wiring failure, and it is
   deliberately loud: the new code throws rather than saving silently wrong data. Report
   it as blocking and stop that entity.

Record results in the checklists below. For anything red, capture: entity, steps, the
request body, and the console output.

---

## 2b. Known issue — do not re-report

**Stale name in an unvisited language tab (react-final-form 7.0.1, upstream, unfixed).**

Found in the first manual pass, 2026-09-03. On Koulutus with more than one kieliversio:
selecting several koulutukset in *Koulutuksen tiedot* clears **Muokkaa koulutuksen nimeä**
on the tab you are looking at, but **any language tab you have not opened still shows the
name of the koulutus that was selected first**. The field then looks filled, it is required,
so validation passes and the stale name is published.

This is a defect in the form library, not in kouta. **It is patched locally as of
2026-09-04** (`patches/react-final-form@7.0.1.patch`), so a build from the branch head
should no longer show it — if you see it, check that the build includes the patch. Full
write-up: Part 8 of `docs/redux-form-migraatio.md`.

A second, related defect in the same area was fixed in kouta's own code the same day
(editor fields lost a translation on a language tab switch).

What is still worth reporting: the same shape **anywhere else**. The exposure is a value
cleared or defaulted *programmatically*, plus a language tab the user has not visited — so
while doing passes B, C and F on a multilingual entity, open **every** language tab before
saving and check that a clear really cleared all of them. Toteutus maksullisuus and apuraha,
and Hakukohde hakuajat, are the ones to try first.

## 3. Pass A — boot and one full round trip per entity  (≈ 45 min)

The broadest coverage per minute. If the migration is fundamentally sound, all of this
is green; anything red here makes the later sections moot for that entity.

**A0 — app boot** (once)
- [ ] Log in, front page loads: organisation hierarchy renders, entity lists load.
- [ ] Add and remove an organisation favourite, reload the page — favourites persist.
      *(The Redux store lost its form reducer in this change; this checks the rest of the
      store still persists.)*
- [ ] Navigation links work; no console errors so far.

**A1–A8 — for each of the eight entities**, in this order (payload-building forms first):

Order: Koulutus → Toteutus → Hakukohde → Haku → Valintaperuste → SORA-kuvaus →
Oppilaitos → Oppilaitoksen osa.

> **Oppilaitos and Oppilaitoksen osa are different.** They have no create form and no
> "add" action anywhere in the UI — they are descriptions attached to organisations that
> already exist in the Organisaatio service. Reach them from the organisation picker on
> the front page: the pencil icon on an organisation row, or the Muokkaa button in the
> *Valittu organisaatio* box. The icon appears only for an organisation of type
> **oppilaitos** (`organisaatiotyyppi_02`) or **toimipiste** (`organisaatiotyyppi_03`),
> and only with the oppilaitos create right. The same page serves both create and edit;
> which one you get depends on whether the description has ever been saved
> (`OppilaitosPage.tsx:26-38`). For these two, read the first two checks below as "open
> the page for an organisation whose description does not exist yet".

For each:
- [ ] Open the **create** form. It renders; all sections expand; no console errors.
- [ ] Fill the required fields for the simplest valid case and save as **luonnos**.
      Save succeeds, success toast appears.
- [ ] Reopen the saved entity in the **edit** form. **Every value you entered is there**,
      in the right field.
- [ ] Change two or three values of different kinds (a plain text field, a select, a
      number or date), save, reload the page. Changes persisted; nothing else changed.
- [ ] Set the entity to **julkaistu** and save. Then set it back to **luonnos**.
- [ ] Delete the entity where the form supports it.

> Failure here = the migration is broken for that entity, not an edge case. Stop and
> report before continuing.

---

## 4. Pass B — hide / show and the save payload  (≈ 30 min) — **highest risk**

Do this on **Koulutus, Toteutus, Hakukohde, Haku** only. Use an entity in **julkaistu**
state with real data in it, so wrongful clearing would be visible as data loss.

Verified toggles to use, with **what "cleared" actually looks like in the body**. Do not
expect `null` everywhere — the payload shape differs by field, and both shapes below clear
the data in the backend. Values read off the repo's own payload snapshots.

| Form | Toggle | Cleared value in the body |
|---|---|---|
| Koulutus | Lisätiedot → remove an option from **"Valitse lisättävä osio"** | `metadata.lisatiedot` = **`[]`** |
| Toteutus | uncheck **"Apuraha käytössä"** | `opetus.apuraha` = `null`, `onkoApuraha` = `false` |
| Toteutus | maksullisuustyyppi → **maksuton** | `opetus.maksut[0].maksunMaara` = `null` (null *inside* the array element) |
| Hakukohde | switch to the **haku's shared hakuaika** | `hakuajat` = **`[]`** |
| Hakukohde | liite → switch to the **shared toimitusaika** | `liitteet[].toimitusaika` = `null` |
| Haku | switch **off** the separate koulutuksen alkamiskausi | `metadata.koulutuksenAlkamiskausi` = `null` |

**Why two shapes.** The "hidden field → `null`" rule writes into the form values, but each
footer then *rebuilds* the payload from them. Array-valued fields are rebuilt with
`osiot.map(...)` over a `?? []` fallback (`getKoulutusByFormValues.ts:60,136`), so the
`null` never survives into the body — an empty array does. That is not a defect: an
explicit `[]` replaces the stored array, so the data is cleared either way. Both shapes
must be judged by the reload, not by the word `null`.

**B1 — hiding clears** (do on all four forms)
- [ ] Confirm the field has a value and is saved. Hide it via the toggle. Press Tallenna.
- [ ] The field is cleared in the request body — the exact shape is in the table above.
- [ ] **Reload the page — the value is gone from the backend too.** This is the real
      assertion; the body shape only tells you *how* it was cleared.

**B2 — hide, then show again, does not clear**
- [ ] Hide the field, then un-hide it in the same session without saving in between.
- [ ] Save. The field still carries its value in the body — not `null`, and not `[]` for
      the two array cases — and it is intact after reload.

**B3 — nothing is cleared by mere language-tab switching**
- [ ] On a multilingual entity, switch language tabs a few times back and forth. Change
      nothing.
- [ ] Save. Compare the body against the entity as it was: **nothing is cleared** — no
      field turned `null`, no array turned `[]` — and no translation is missing.

**B4 — remove a kieliversio and add it back**
- [ ] Remove a kieliversio (e.g. sv) from Kieliversiot, then add it back.
- [ ] Save. The removed-and-restored language's texts are still in the body.

**B5 — the registry is reset after a save**

> **Corrected 2026-09-04.** This check used to read "the second save does not re-send the
> `null`". That was wrong. Most `null`s in the body come from the *converter*, not from the
> hide-and-clear rule: `getAlkamiskausiData`
> (`utils/form/aloitusajankohtaHelpers.ts:7-22`) returns `null` whenever the separate
> alkamiskausi is off, so `metadata.koulutuksenAlkamiskausi` is `null` on **every** save —
> it is `null` in the create snapshots too, where nothing was ever hidden. A re-sent
> `null` is therefore not a finding, and the branch's own test *"should send an identical
> payload after the post-save refetch"* requires the two bodies to be **identical**.

The real risk is a stale "gone" set surviving the save and clearing a field that has since
come back. That is what to test:

- [ ] Hide a field and save. Then make it **visible again and give it a value**, and save
      a second time.
- [ ] The field carries its value in the second body — it is **not** cleared even though
      it was in the "gone" set before the first save.
- [ ] Nothing else changed between the two bodies.

**B6 — leave the form and come back**
- [ ] Hide a field but **do not save**. Navigate away inside the app (breadcrumb / back),
      discard the unsaved-changes warning, then come back to the same entity.
- [ ] Change something unrelated and save. The field you hid earlier is **not** `null` —
      the discarded hide did not survive.

**B7 — the refresh after saving**
- [ ] Save once and let the page settle (it refetches in the background).
- [ ] Hide a field and save again. Only that field is `null`; nothing else changed.

**B8 — delete the middle row of a list**
- [ ] On a list with three rows (Hakukohde hakuajat, Haku hakuajat, yhteyshenkilöt,
      liitteet, valintatavat), delete the **middle** one.
- [ ] Save. The body has exactly two rows, in the right order, with the right contents —
      no phantom third row, no nulls inside the surviving rows.

**B9 — direction 2: nothing gets erased that you didn't touch**  ← *the destructive one*
- [ ] Take a **julkaistu** entity with as many fields filled as you can manage.
- [ ] Do a round of ordinary interaction without intending any change: expand and collapse
      sections, switch language tabs, open and close a couple of selects, switch a radio
      and switch it back, click through the form steps.
- [ ] Save and read the body field by field against what was there before. **Nothing
      cleared that you didn't deliberately hide** — neither a `null` nor an emptied array.
      Reload and confirm nothing disappeared.
- [ ] Repeat once on Hakukohde with a **järjestyspaikka** selected — that field is a known
      transient-unmount case.

**B10 — esikatselu survives a tila change**
- [ ] Tick the esikatselu checkbox, save. Then change the julkaisutila and save again.
- [ ] `esikatselu` still has its value in the body (it is `true`, not missing).

---

## 5. Pass C — per-field mechanics  (≈ 25 min)

These are the quirks the wrapper reimplements by hand. Do them on **two forms** —
Oppilaitoksen osa (small, quick) and Toteutus (richest field mix).

**C1 — focus does not jump while typing**
- [ ] Type a full sentence, character by character at normal speed, into: a plain text
      field, a translated text field, a rich-text editor, a text field **inside a list
      row**, and a nested list row.
- [ ] Focus stays in the field the whole time and no characters are lost or reordered.
      *(Focus loss after each keystroke is the classic symptom of the wrapper remounting.)*

**C2 — emptying a saved field**
- [ ] Clear a field that **has a saved value**, save.
- [ ] The body sends it as **empty** (`""` or `{}` for a translated field) — not missing —
      and after reload the field is empty.

**C3 — emptying a field that never had a value**
- [ ] Type into an empty field, then delete what you typed, save.
- [ ] The field is **absent** from the body (not `""`). No error.

**C4 — URL fields add the missing protocol on blur**
- [ ] In a www-address field type `www.example.fi` and press Tab (do not click Tallenna
      from the field).
- [ ] The field becomes `http://www.example.fi`. Save; the body carries the prefix; it
      survives reload.
      *(Verified regression in this migration — worth doing on every form that has a
      verkkosivu field: Oppilaitos, Oppilaitoksen osa, Toteutus, Haku, Hakukohde.)*

**C5 — selects survive blur**  ← *silent data-loss risk*
- [ ] Pick a value in a select. Reopen it, **type search text into it**, then click
      somewhere else on the page without choosing anything.
- [ ] The originally selected value is still shown — it was not replaced by your search
      text. Save and confirm the body still has it.
- [ ] Repeat on a **multi-select** and on a select **inside a list row**.

**C6 — numbers, dates, checkboxes**
- [ ] Set a numeric field (laajuus, aloituspaikat, maksun määrä), save, reload. Then clear
      it, save, reload — it is empty, not `0`.
- [ ] Set a date+time range, save, reload. Then clear the end date only, save, reload.
- [ ] Toggle a checkbox and a radio on and off; the value follows the click every time
      (no stuck states).

**C7 — file uploads**
- [ ] Upload a teemakuva (Toteutus/Koulutus) and a logo (Oppilaitos). Save, reload — the
      image is there. Remove it, save, reload — it is gone.

---

## 6. Pass D — saving, validation, errors  (≈ 20 min)

Form state moved out of the global store, so the whole save lifecycle is new plumbing.

**D1 — validation errors are shown on the right field**
- [ ] Leave a required field empty and press Tallenna.
- [ ] Save is blocked **and** the error is shown **next to that field** — not only as a
      generic toast. Section headers / navigation mark the section as erroneous.
      *(Field-level errors go through a channel that had to be rebuilt; a generic-only
      error means the user can't tell what to fix.)*
- [ ] Fix the field. The error clears and saving succeeds.

**D2 — validation only applies to visible fields**
- [ ] Hide a section that contains a required field (e.g. switch off a toggle whose
      subsection has required fields).
- [ ] Save succeeds — the hidden required field does not block it.

**D3 — the form disables itself while saving**
- [ ] Throttle the network (DevTools → Network → Slow 3G) and press Tallenna.
- [ ] While the request is in flight the form is disabled / shows the saving state, and
      you cannot type into fields or press Tallenna a second time.
      *(This was measurably broken mid-migration and fixed before the branch closed — worth an
      explicit look.)*

**D4 — backend error handling**
- [ ] Provoke a backend rejection (e.g. edit the same entity in two tabs and save the
      stale one, so the modified-since check fails).
- [ ] An error toast/modal appears, the form stays filled with your input, and pressing
      Tallenna again after resolving works. No blank page.

**D5 — unsaved-changes warning**
- [ ] Open a form, change **nothing**, navigate away → **no** warning.
- [ ] Change one field, navigate away → warning *"Lomakkeella on tallentamattomia
      muutoksia. Haluatko varmasti jatkaa?"*; **Cancel** keeps you on the form with the
      change intact.
- [ ] Change a field, **save**, then navigate away → **no** warning.
      *(The two libraries decide "has anything changed" differently; a warning after a
      successful save, or none after an edit, are both findings.)*

**D6 — esikatselu**
- [ ] Open the Esikatsele link from the form; the preview opens with the current data.

---

## 7. Pass E — lists (FieldArray)  (≈ 15 min, extended)

Lists got their own wrapper, and one known defect class here is rows remounting.

Pick three: Hakukohde **liitteet**, Haku **hakuajat**, Valintaperuste **valintatavat**
(with sisältölohkot), or Toteutus **yhteyshenkilöt**.
- [ ] Add three rows, fill each distinguishably, save, reload — three rows, correct
      contents, correct order.
- [ ] Delete the middle row, save, reload — the right two remain (see B8).
- [ ] Where reordering is supported, move a row, save, reload — new order persisted.
- [ ] Add a row, type into it, and **without leaving the field** add another row — the
      text you typed is not lost and focus behaves.
- [ ] Sisältölohkot (Valintaperuste): add a text block and a table block, fill both, save,
      reload.

---

## 8. Pass F — language versions  (≈ 10 min, extended)

- [ ] On Koulutus or Toteutus, enable fi + sv + en. Fill a translated field differently in
      each language.
- [ ] Switch tabs repeatedly; each language keeps its own text.
- [ ] Save, reload — all three languages persisted correctly, none overwritten by another.
- [ ] Remove one kieliversio, save, reload — that language's texts are gone, the others
      untouched.

---

## 9. Pass G — roles and the non-payload forms  (≈ 15 min, extended)

- [ ] As **OPH-virkailija**, open and save a **julkinen** Koulutus belonging to another
      organisation. Saving is permitted and works.
      *(The rights check for this read a form value from outside the form; that read was
      moved. If it regressed, the button is disabled or the page crashes.)*
- [ ] As **oppilaitos user**, the same entity behaves as before (read-only where it should
      be).
- [ ] As **oppilaitos user**, confirm the takaraja rules still behave: an expired
      muokkaamistakaraja blocks saving a hakukohde; an OPH-virkailija can still save.
- [ ] Create-from-base (Pohja): create a new entity using an existing one as the base —
      values copy over, but the **julkaisutila does not** (new entity is luonnos).
- [ ] Quick round trip on the four non-payload forms if not already done in Pass A:
      Valintaperuste, SORA-kuvaus, Oppilaitos, Oppilaitoksen osa.

---

## 10. Robustness probes  (≈ 15 min, extended, optional)

Deliberately awkward usage. These are the ones most likely to find something the
automated suite can't.

- [ ] **Fast clicking**: toggle a show/hide switch five times rapidly, then save. The
      payload matches the final visible state.
- [ ] **Save while typing**: start typing in a field and press Tallenna without blurring
      first. The in-progress text is included in the payload.
- [ ] **Navigate mid-save**: press Tallenna on a throttled connection and immediately try
      to navigate away. No crash; state afterwards is coherent (either saved or not, and
      the UI says which).
- [ ] **Browser back/forward** through several form pages, then edit and save. No stale
      data from the previous entity leaks into the payload.
- [ ] **Two tabs**, same entity: edit and save in tab A, then edit and save in tab B — the
      stale-write check fires with a clear error rather than silently overwriting.
- [ ] **Reload mid-edit**: fill a form, reload with F5 → browser's own leave-page prompt
      appears; after reloading, the form is back to saved state (no half-persisted values).
- [ ] Console clean-up review: skim the whole session's console output for warnings you
      noted along the way and attach them to the report even if nothing looked broken.

---

## 11. Reporting

For each finding: entity · form mode (create/edit) · steps · **request body excerpt** ·
console output · whether it reproduces.

Triage hints — what a failure most likely points at:

| Symptom | Likely area |
|---|---|
| Blank page / thrown error opening a form | form wiring (a form rendered outside its provider) |
| Focus jumps away after each keystroke | the field wrapper remounting |
| A field's value silently replaced by search text | select blur handling |
| A field you never touched comes back `null` or `[]` in the payload | the field registry, destructive direction |
| Hidden field's old value still in the backend after save | the field registry, non-clearing direction |
| Save blocked with only a generic error, no field marked | the submit-error channel |
| Unsaved-changes warning after a successful save | dirty-state tracking |
| A cleared field still filled on an unvisited language tab | known upstream library defect — see 2b |
| Form editable / Tallenna clickable during a save | the form's self-disabling during submit |

---

## Appendix — what the automated suite already covers

So you know where the manual pass adds value rather than repeats it.

Playwright (≈ 160 tests) already covers, with the full request body snapshotted: create
and edit round trips for every koulutustyyppi and every entity; "focus is not lost while
typing" on five forms; "an emptied translated field is sent as empty" on five forms; the
URL-protocol-on-blur case on Oppilaitoksen osa; Haku's language-tab and kieliversio cases
(B3/B4); Haku's discarded-hide-on-return (B6) and post-save-refetch (B7); Hakukohde's
shared hakuaika and shared liite toimitusaika clearing, and middle-row removal (B8);
Toteutus's maksunMaara clearing; the unsaved-changes warning on every form; the takaraja
and role rules on Haku and Hakukohde.

It does **not** cover: real backend responses (all routes are stubbed), file uploads,
rich-text editors beyond basic typing, drag-and-drop reordering, preview,
Oppilaitos/Oppilaitoksen osa/Koulutus/Valintaperuste hide-and-clear cases, the
wrongful-clearing direction other than one accidental Hakukohde case, the form's
self-disabling during save, two-tab conflicts, and everything in section 10.
