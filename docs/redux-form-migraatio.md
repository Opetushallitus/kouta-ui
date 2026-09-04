# Migrating kouta-ui off redux-form — the long version

explains how the forms in this app actually work, what breaks when the library
underneath them is swapped, and which library differences the in-house `Field`
wrapper reproduces by hand.

It is the reference for the redux-form -> react-final-form migration (OY-5212). Read
Parts 1-4 for the mechanism, Part 7 for what the wrapper does and why, Part 8 for the
one library bug kouta patches locally.

---

# Part 1 — How forms work in this app

## 1.1 Why a form library exists at all

In plain HTML, a form is a bag of `<input>` elements and the browser tracks what's typed
in them. In React that doesn't work well: React wants to own what's on screen, so every
input has to be told its value and has to report changes back up. That's called a
*controlled input*, and it looks like this:

```jsx
<input value={name} onChange={e => setName(e.target.value)} />
```

Fine for one field. kouta's koulutus form has hundreds, nested many levels deep
(`kuvaus.fi`, `opetus.apurahaMin`, `hakuajat.hakuajat[2].alkaa`), with validation,
error display, and per-language variants. Wiring each one by hand would be unmanageable.

A **form library** takes that over. You declare "there is a field called
`information.nimi.fi`", and the library handles storing the value, passing it down,
collecting changes, and tracking whether the form has been edited.

## 1.2 What redux-form does specifically

**Redux** is a library that keeps application state in one big shared object called the
**store**. Any component can read from it, and changes go through a central function.

**redux-form** is a form library that keeps *form* state in that Redux store. So while
the user is filling in a koulutus, the half-finished koulutus lives in Redux, at roughly
`state.form.koulutus.values`.

That's an unusual design by modern standards, and it's the root of everything in this
document. It's also why redux-form was abandoned — the React ecosystem moved away from
putting form state in a global store.

## 1.3 What a `<Field>` is

Here is a complete, real component from the app —
`src/pages/haku/HakuForm/NimiSection.tsx`:

```jsx
import { Field } from 'redux-form';
import { FormFieldInput } from '#/src/components/formFields';

export const NimiSection = ({ language }) => (
  <Field
    name={`nimi.${language}`}
    component={FormFieldInput}
    label={t('yleiset.nimi')}
    required
  />
);
```

Reading it:

- `<Field>` comes from redux-form. It is *not* an input. It's a connector: it links a
  path in the form state to a component that draws something on screen.
- `name` is the **path** into the form values. `nimi.fi` means "the `fi` key inside the
  `nimi` object". Paths use dots for objects and `[0]` for array items.
- `component` is what actually renders. `FormFieldInput` is kouta's own wrapper that
  draws a label, the input box, and any error message.

There are **244 `<Field>` tags** in the app, across 93 files. Plus 16 `<FieldArray>` (for
repeatable lists like hakuajat) and 1 `<Fields>` (a plural variant used in exactly one
place). All of them work like the example above.

## 1.4 Mounting, and what "registered" means

In React, a component is **mounted** when it appears on screen and **unmounted** when it's
removed. Not hidden with CSS — actually removed from the page.

When a `<Field>` mounts, it tells redux-form *"a field named `nimi.fi` now exists"*. That's
called **registering**. When it unmounts, it **unregisters**.

redux-form keeps the currently-registered set in the store, as
`state.form.koulutus.registeredFields`. Think of it as a live attendance list: *which
fields are on screen right now*.

This matters because **kouta's forms show and hide fields constantly**. Pick a different
koulutustyyppi and whole sections appear. Tick "maksullinen" and a price field appears.
There are roughly 50 places in the app where one field's value decides whether other
fields exist.

Here's one, from `src/components/EsikatseluControls.tsx`:

```jsx
const tila = useFieldValue('tila');
const showCheckbox = _.isNil(tila) || tila === JULKAISUTILA.TALLENNETTU;
...
{showCheckbox && <Field name="esikatselu" component={FormFieldCheckbox} />}
```

When `tila` changes to `JULKAISTU`, `showCheckbox` becomes false, the `<Field>` unmounts,
and `esikatselu` unregisters. Remember this one — it comes back in Part 2.

## 1.5 The language wrinkle

kouta content exists in Finnish, Swedish and English. You'd expect three fields per
translated value. Instead, `FormCollapse` shows **one language tab at a time** and renders
only that language's field. Switching the tab from `fi` to `sv` unmounts `nimi.fi` and
mounts `nimi.sv`.

So language switching is a constant source of register/unregister churn — roughly 95
`<Field>` sites carry a `${language}` suffix. Keep this in mind for Part 2; it looks more
dangerous than it turns out to be.

---

# Part 2 — The clever thing kouta does, and why it's the whole problem

## 2.1 The idea

When you press Tallenna, kouta does **not** simply send the form values to the backend.
It builds the payload from *which fields were on screen*.

The reasoning: if the user hid a field, they presumably want that data gone. So kouta
sends `null` for it, which tells kouta-backend to clear it.

To do that it needs two lists:

| List | Meaning | Where it lives |
|---|---|---|
| `registeredFields` | on screen **now** | redux-form's own store |
| `unregisteredFields` | *was* on screen, then disappeared | **a hand-written reducer kouta added** |

The second one doesn't exist in redux-form. kouta built it, in
`src/state/rootReducer.ts:30-52`, by eavesdropping on redux-form's internal messages:

```js
case '@@redux-form/REGISTER_FIELD':    // a field appeared -> remove from the "gone" list
case '@@redux-form/UNREGISTER_FIELD':  // a field vanished -> add to the "gone" list
case '@@redux-form/INITIALIZE':
case '@@redux-form/DESTROY':           // form reloaded/closed -> forget everything
```

Those `@@redux-form/...` strings are redux-form's private internals. Nothing documents
them as a public API. This code works by listening to another library's private
conversation.

## 2.2 How the payload gets built

`getValuesForSaving()` in `src/utils/index.ts:301-352` does it in four steps:

1. **Start from what was loaded from the backend** (`initialValues`).
2. **For every field in `unregisteredFields`, write `null`.** ("user hid this → clear it")
3. **For every field in `registeredFields`, write the current value.** ("this is on screen
   → save what it says")
4. **Copy five special paths regardless** — `esikatselu`, `koulutustyyppi`, `muokkaaja`,
   `information.nimi`, `tarjoajat.tarjoajat`.

Step 4 is a patch list. Remember `esikatselu` from §1.4? Changing `tila` unmounts it, so
step 2 would null it — even though the user never touched it. Step 4 puts it back. Those
five paths are bug fixes, not arbitrary exceptions.

## 2.2b Does the backend actually honour "null means clear"?

Yes — but the reason is not what you'd guess, and it is worth knowing.

`KoutaServlet.parsedBody` (`kouta-backend/.../servlet/koutaServlet.scala:113-119`) strips
**every** `null` out of the request body before it is parsed:

```scala
/** Json4s seems to have a bug when optional class values with optional values are
  * literal nulls in JSON. Circumvent this by removing all nulls from the incoming JSON. */
override def parsedBody(implicit request) = super.parsedBody(request).noNulls
```

So the backend cannot tell `{"nimi": null}` from omitting `nimi` at all. And because every
update is a **full-document replace** — each DAO writes every column unconditionally, and
child tables (hakuajat, liitteet, valintakokeet, tarjoajat) are delete-and-reinsert — "omit"
and "clear" coincide. There is no PATCH route anywhere; `X-If-Unmodified-Since` is a
stale-write guard, not a merge.

**The fragility worth recording:** that one line is a documented *workaround*, and a
regression test (`jsonDeserializingSpec.scala:193-196`) says in a comment that when json4s
fixes the bug, the workaround can be removed. If that happens, `DefaultFormats.strict`
makes a literal `null` a **400** on `Option`, `Map`/`Kielistetty` and `Seq` fields alike.
kouta-ui's entire save contract rests on it. Worth a cross-repo note so nobody removes it
without checking who depends on it.

### The allowlist, explained properly

Not every `null` is a clear. The backend has real exceptions, and they line up almost
exactly with `copyPathsIfDefined`:

| Path in the allowlist | What `null` would actually do |
|---|---|
| `koulutustyyppi` | **400** — non-optional, no default |
| `muokkaaja` | **400** at parse; also server-overwritten anyway |
| `information.nimi` | **400** on Koulutus/Haku (`validateKielistetty`, at any tila) |
| `esikatselu` | silently becomes `false`, not cleared |
| `tarjoajat.tarjoajat` | collection → emptied, and rows deleted |

Four of the five are paths where nulling is either rejected or silently wrong. So §2.2's
"step 4 is a patch list" is right, and now we know what it is patching *against*: the
backend's non-uniform null handling, not just footer-driven unregistration.

Other exceptions, none currently reachable from the UI, recorded so they are not
rediscovered:

- **`tila: null` silently means `Tallennettu`** — i.e. unpublish. A normal user gets 403;
  an OPH pääkäyttäjä gets a silent unpublish. `tila` is always mounted today, so the UI
  never sends it null — but nothing enforces that.
- **`nimi: null` is re-populated, not cleared**, for amm / amm-tutkinnon-osa /
  amm-osaamisala / vst-osaamismerkki koulutus and for tuva/lukio hakukohde.
- **`metadata: null` on a julkaistu entity is a 400 for Haku, Koulutus and Toteutus — but
  accepted for Hakukohde**, which lacks the assertion. The clearest inconsistency found.
- Non-optional fields with no default (`koulutusOid`, `toteutusOid`, `hakuOid`,
  `Ajanjakso.alkaa`, `Liite.tyyppiKoodiUri`) → 400 rather than clear.

## 2.3 Worked example

A haku with two hakuaika rows. The user unticks "eri hakuaika", so the whole list
disappears from screen.

Unregistered: `hakuajat.hakuajat`, plus each row's `alkaa` and `paattyy`.

```
step 1  { hakuajat: { hakuajat: [ {alkaa:'A',paattyy:'B'}, {alkaa:'C',paattyy:'D'} ] } }
step 2  { hakuajat: { hakuajat: null } }          <- sent to backend, clears the list
```

Correct. Now the language case, which sounds identical but isn't. The user removes `sv`
from kieliversiot, unregistering `nimi.sv`:

```
step 2  { nimi: null }              <- looks like all three languages are about to be wiped
step 3  { nimi: {fi:'x', sv:'y'} }  <- put back, because nimi.fi is still on screen
```

Two things save it. Both steps strip the language suffix, so `nimi.sv` and `nimi.fi` both
mean "the field `nimi`". And when you remove the active language, `FormCollapse` switches
the tab to another one, so a sibling field is always mounted. **Removing a kieliversio
never wipes a translated field.** Nulling only happens when the *whole* subtree goes away.

This was worth spelling out because it's counter-intuitive in both directions, and an
earlier draft of this plan got it backwards.

## 2.4 One bug already found and fixed

Writing tests for this turned up a real bug. Step 2 looped over the unregistered fields in
whatever order they happened to arrive. When both a parent and its child were hidden
together — which is exactly what a hidden list does — the result depended on that order:

```
child first   ->  { hakuajat: null }                                    correct
parent first  ->  { hakuajat: [{alkaa:null,paattyy:null}, ...] }         garbage
```

The second one sends a list of null-filled rows to the backend instead of "empty this".
Fixed by sorting so children are always cleared before their parents, with all 85
Playwright snapshots unchanged.

**The ordering rule is subtler than it looks.** The sort has to be applied to the
**stripped** names, not the raw ones, because stripping a language suffix can invert the
order:

```
unregistered 'p.fi' and 'p.c'
  raw descending    -> ['p.fi', 'p.c'] -> strip -> set('p', null), then set('p.c', null)
                    -> { p: { c: null } }        <- parent resurrected, the very bug being fixed
  strip then sort   -> ['p.c', 'p']    -> set('p.c', null), then set('p', null)
                    -> { p: null }               <- correct
```

Not reachable today — it needs a path that is both a translated field and an object with
non-language children, and translated fields are leaves here. It matters anyway because
the code comment claims "the parent path is always a strict prefix of the child's path" as
a *guarantee*, and that is only true of stripped names. The field registry has to
reproduce this ordering exactly, so the next reader will take that comment as the spec.

---

# Part 3 — What actually breaks when we swap libraries

## 3.1 The replacement

**react-final-form** is by the same author as redux-form. Same idea, without Redux — it
keeps form state internally. Chosen because the migration is mostly mechanical: the
`<Field>` API is nearly identical, and kouta's validation already sits outside the library
entirely.

## 3.2 What ports without trouble

| Thing | Why it's fine |
|---|---|
| 244 `<Field>` tags | Same props, same shape. Change the import line. |
| The 25 `FormField*` components | They only read `{ input, meta }`, which react-final-form provides identically. |
| All 8 `validate*Form.ts` files (729 lines) | Already plain functions kouta calls itself. The library never sees them. |
| The ~200 `useFieldValue()` calls | If the hooks keep their signatures, callers don't change. |

## 3.3 The one thing that doesn't port

react-final-form can tell you which fields are on screen — `form.getRegisteredFields()`.

It **cannot** tell you which fields *used to be* on screen. There is no equivalent of
`unregisteredFields`, because there are no Redux messages to eavesdrop on. That half has
to be rebuilt from scratch.

And here's why this is the centre of the whole plan:

> **If it's rebuilt wrong, nothing errors.** No crash, no failed type check, no red test.
> The list just comes back empty, and published koulutus data quietly stops being cleared
> when users hide fields. Or worse, gets cleared when it shouldn't.

Everything below exists to make that failure loud instead of silent.

## 3.4 Two different contracts

The registry is used for two separate jobs with very different blast radii:

| Contract | Who uses it | If it breaks |
|---|---|---|
| **Save-clearing** — the `null`s in the payload | **4 files**: the Haku, Hakukohde, Koulutus and Toteutus footers | Published data silently corrupted |
| **Validation visibility** — only validate fields on screen | **all 8** entity footers | Validation silently stops, or blocks saving |

Only four files can corrupt data. That's a much smaller target than "the forms layer",
and it's where the effort should concentrate.

---

# Part 4 — Why today's tests can't catch this

## 4.1 What exists

- **128 Playwright tests.** Real browser, real forms, all network calls faked. Good.
- **85 request-body snapshots.** The strongest asset by far. Each test intercepts the
  save request and records the exact JSON sent to the backend. If a change alters any
  payload, the snapshot fails. That is precisely the contract §3.3 threatens.
- **279 unit tests**, mostly data transformations.

## 4.2 The three gaps

**Nothing mounts a form in a fast test.** `src/testUtils.tsx` provides a theme and nothing
else — no store, no form, no context. So the ~700 lines being rewritten have **zero**
tests. Not thin coverage: none. There isn't even a helper that could write one.

**Nothing checks what a form *looks like*.** The 85 snapshots record only outgoing JSON.
Whether an error message appears, whether a field is visible or disabled — unverified. A
change that made validation errors stop appearing would pass all 85.

**Nothing checks the "unsaved changes" warning appears.** Six tests confirm it *doesn't*
appear on an untouched form. None confirms it *does* after an edit. Under react-final-form
a form can easily get stuck permanently "edited" — a well-known trap — and it would slip
through.

---

# Part 7 — Library differences reproduced by the `Field` wrapper

The `Field` wrapper is not a thin re-export. It reproduces six places where
react-final-form behaves differently from redux-form, each found by running a real form
rather than by reading code, and each silent when broken.

The reasoning also lives in `Field.tsx`'s comments, next to the code that implements it —
but organised by code layout, not as a list, and two of the fixes are in other files. This
section is the list.

**Why "reproduce" and not "fix".** Every item below is a place where react-final-form's
behaviour is arguably the more sensible of the two, and kouta reproduces redux-form's
anyway. The migration's contract was that no behaviour test may change, so a payload that
differs is a defect regardless of which library is right. Changing any of these is a
legitimate follow-up — as its own commit, reviewed on its merits.

## The six semantic divergences

| # | Divergence | Reproduced in | Found by | Guarded now by |
|---|---|---|---|---|
| 1 | Save-validation errors arrive on a different meta key | `Field.tsx:163` | Valintaperuste migration | per-field validation-error tests, 6 forms |
| 2 | A wrapper built during render remounts the field | `Field.tsx:64` | Valintaperuste migration | "does not lose focus while typing", 8 forms + a mount-counting unit test |
| 3 | An emptied field's value | `Field.tsx:128, 205` | systematic audit, corrected against `meta.initial` | "sends an emptied translated field as empty", 6 forms |
| 4 | `format={null}` crashes the render | `Field.tsx:222` | systematic audit | any Toteutus osaamisala test |
| 5 | Blur can change the value | `Field.tsx:146` | Oppilaitos migration prep | "adds the missing url protocol on blur", Oppilaitoksen osa |
| 6 | Reading a value returns the formatted one | `formAdapterReactFinalForm.ts:115` | Toteutus migration | 11 Toteutus payload snapshots; 20 of 36 Koulutus tests |

### 1. Save-validation errors arrive on a different meta key

redux-form reports them in `meta.error`, which is what `createComponent`
(`formFields/utils.tsx:26`) reads. react-final-form's equivalent channel is
`meta.submitError` — and even that never fills, because kouta does not save through the
library's `handleSubmit`; the footer calls `save()` directly. The errors live in the
adapter's own state and come out via `useSubmitErrors`.

Symptom without the fix: saving is blocked correctly and the error toast appears, but the
user is never told **which field** to correct. Measured A/B on one test: visible under
redux-form, invisible under react-final-form.

The lookup is `_.get(submitErrors, name)` — the same as `ErrorPlaceholder`, i.e.
redux-form's semantics.

### 2. A wrapper built during render remounts the field

Not a difference between the libraries but a hazard the wrapper itself introduces, and it
is in this list because it was found the same way and costs the same. A wrapper component
created inside `render` is a new component type on every render, so React unmounts and
remounts the whole subtree. Two consequences, both measured:

- **Focus is lost mid-typing.** Every keystroke changes the array value, which re-renders
  the `FieldArray`, which remounts the field. Typed character by character, a field ended
  up holding `"V"` where it should have held `"Valintatavan nimi"`. Invisible to the
  existing suite because `fill()` is one atomic action.
- **Register/unregister churn** for every child field on every render. It nets out within
  the commit and produced no wrong payload — but it hammers exactly the mechanism the
  save-visibility rule depends on.

Both wrappers (`getErrorAwareComponent`, `getFieldsApiComponent`) therefore share
`memoizeComponentWrapper`, which caches one wrapper per component. Everything mutable is
read *inside* the wrapper, never closed over, or the memoised wrapper would see stale
data. Discrimination measured with an inline wrapper: unit test counts 1 mount vs. 3;
browser test gets the full string vs. `"V"`.

### 3. An emptied field's value

react-final-form's default `parse` turns `''` into `undefined`, after which the library
prunes the now-empty parents out of the values. redux-form keeps the empty string:

```
redux-form        {"tiedot":{"nimi":{"fi":""}}}
react-final-form  {}
```

Clearing a field would send a **missing key** where it used to send an empty value.

The first fix — an identity `parse` — reproduced only half the rule. redux-form's reducer
is conditional, verbatim from `createReducer.js`, `CHANGE`:

```js
if (initial === undefined && payload === '' || payload === undefined) {
  result = deleteInWithCleanUp(result, "values." + field);
}
```

An empty string **deletes** the value when the field has no initial value, and **stays**
when it has one. That distinction separates *"I cleared a saved value"* from *"I never
filled this in"*, and only the former should send an empty value. The first attempt fixed
one half and broke the other; both are reproduced using `meta.initial`.

The identity `parse` is applied **globally** to every field on the migrated path, not only
where the divergence was measured. That is deliberate and it is not scope creep: redux-form's
own `parse` is the identity, so a global application is what keeps behaviour unchanged.
A targeted fix would leave every other field on the other semantics. Call sites still win —
the defaults are spread before incoming props.

Note the expectation differs by form: the four payload-building footers normalise a wholly
empty translated field, so their tests expect `{}`; the other four expect `{ fi: '' }`.

### 4. `format={null}` crashes the render

In redux-form, `format={null}` means "no formatting". react-final-form calls `format`
whenever it is not `undefined`, so `null` throws `TypeError: format is not a function`.
An identity function is the same thing as redux-form's "no formatting": the value passes
through untouched, where the library's own default would have turned `undefined` into `''`
— which is precisely what `format={null}` exists to prevent.

One call site, `ToteutusForm/OsaamisalatSection.tsx:203`, on a form that had not yet been
migrated when this was found — so it would have surfaced as a crash during the Toteutus
migration rather than as a silent difference.

Known consequence: `undefined` now passes through, which can raise React's
controlled/uncontrolled warning at that call site, because redux-form tolerated an
`undefined`-valued input there. That warning is the expected cost of parity, not a
regression; if it should go, the fix belongs at the call site.

### 5. Blur can change the value

redux-form's `BLUR` reducer writes the event's value into the field, so blurring is a
mutation. In react-final-form, `onBlur` does not read the value at all — it only marks the
field touched — and the value moves solely through `onChange`.

`UrlInput` (`components/UrlInput/index.tsx:8-11`) depends on this: it adds a missing
`http://` prefix by writing into `e.target.value` and then calling `onBlur`. On a migrated
form the prefix vanished silently. Measured on the Oppilaitos payload snapshot:
`"http://www.verkkosivu.fi"` became `"www.verkkosivu.fi"`.

The wrapper therefore compares the event's value to the field's current value on blur and
issues an `onChange` first when they differ. Checkboxes and radios are excluded, because
their `target.value` is not the field's value at all.

**This is the divergence with the sharpest edge — see the invariant below.**

### 6. Reading a value returns the formatted one

`useFieldValue` went through `useField`, whose default `format` turns `undefined` into
`''`. The redux-form implementation read straight from the store, so `undefined` stayed
`undefined` — and the adapter has to give the same answer under both libraries.

It bit at `ToteutusForm/TiedotSection.tsx:153`, which sets a default in an effect
conditioned on `_fp.isUndefined(currValue)`. Formatted, the value was `''`, the condition
never held, the field was never set: eleven Toteutus tests lost
`isPieniOsaamiskokonaisuus: true` from the payload. Fixed with an identity format on the
adapter's reader only — field rendering is a separate `useField` call and is unaffected.

This is the one a targeted fix would not have found. Nothing about it points at Toteutus,
and the same pattern — an `isUndefined` guard setting a default — occurs twice more in
Koulutus (`TiedotSection.tsx:48` and `:70`). Measured: restoring the formatted read fails
20 of Koulutus's 36 tests. Koulutus was the first form to migrate with no new finding
precisely because this fix landed in the adapter rather than at Toteutus's call site.

## Two API gaps, not semantic differences

These are things redux-form offered and react-final-form does not. They fail loudly or
silently, but neither is a behavioural disagreement.

**`fields.get(index)`** — redux-form's `FieldArray` render prop has it; react-final-form-arrays
does not, and the value lives in `fields.value[index]`. Patched at `Field.tsx:252` with a
`Proxy` rather than a spread, because some members are getters and the methods must stay
bound to the original object. Call sites that use it: `SisaltoFields`,
`ToteutusForm/EntityFields`.

**`Fields` (plural) does not exist** — built at `Field.tsx:299`. Until then the wrapper
threw, on the reasoning that a shim rendering silently wrong is worse than a missing one.

The shape had to be reproduced exactly. redux-form does not hand back a flat map of dotted
names; it hands back an object that **follows the path structure**. The only call site
reads it as (`HakukohdeForm/LiitteetFields.tsx:241`):

```js
_.get(props, [baseName, 'yhteinenToimitusaika', 'input', 'value'])
```

A flat map would not crash — it would read `undefined`, which means "no shared
toimitusaika", i.e. plausible-looking default behaviour on a false basis. The shim
therefore assembles the object with `_.set` from the name, so it is structurally correct
by construction. Names render as **nested** `Field` components rather than a hook loop:
`names` is a prop, so a loop would break the hooks-order rule as soon as the count changes
between renders.

## Two load-bearing invariants

Both are places where correct code depends on something that looks incidental. Neither
would fail loudly.

**`selectMapProps` row order** (`formFields/index.tsx:56`). Divergence 5 gives every field
a blur handler that writes the event's value. For a select that would be wrong: `input.value`
is an object, while the DOM blur event's `target.value` is a string — the select's search
box, usually empty. They would differ on **every** blur, and the handler would overwrite
the selection with the search text. It does not happen only because the six select mappers
set `onBlur: _.noop` **after** spreading `...input`, leaving the wrapper's handler unused.
`simpleMapProps` lets it through, which is right for text fields. Move `...input` below the
`onBlur` line and a silent no-op becomes data loss.

**Component identity** — see divergence 2. Anything the wrapper needs that changes must be
read inside the wrapper.

## Audited with no findings

Recorded so the next reader does not redo it:

- **the `meta` surface** — application code reads only `error` from a field's meta (plus
  `submitError` inside the `Field.tsx` patch). Not `touched`, `dirty`, `visited`, or
  `submitFailed`, all of which differ in detail between the libraries.
- **`onChange` on a `Field` element** — zero call sites. The 42 grep hits are all in other
  components.
- **`normalize`** — zero call sites, no redux-form dependency.

## What guards these now

Every item above is guarded by browser tests only, and the per-item discrimination was
measured by mutating each fix and checking which tests went red. Two things worth knowing:

- **Mutation-measured discrimination is thin in places.** The Oppilaitoksen osa spec, for
  instance, fails on three of the six fixes; the url-protocol test had to be written
  deliberately, because removing the blur rule passed all four of the other tests in that
  spec — the fixture's `wwwSivu` already carried an `http://` prefix, so the snapshot was
  identical either way.
- **The `Fields` shape is the weakest-guarded item.** A flat map passed all 26 Hakukohde
  tests: the payload snapshots do not see the props shape at all, because the wrong read
  yields `undefined` and `undefined` means the same as "no shared toimitusaika". The
  visibility assertion in `editHakukohde.spec.ts` was added for exactly this reason and is
  the only browser-level guard on it.

If any of these fixes is removed or "simplified", the failure surfaces as a payload
snapshot diff with no note pointing at the reason. The comments in `Field.tsx` are the
route from there back to here.

---

# Part 8 — react-final-form 7.0.1 resurrects values on field mount (patched locally)

**Status: PATCHED LOCALLY, 2026-09-04.** `patches/react-final-form@7.0.1.patch` carries
upstream PR #1096. Still unfixed upstream — there is no 7.0.2 — so the patch stays until
one ships. Found in manual regression testing of this branch, 2026-09-03; the original
decision was to wait, and *The decision* below records why that was reversed a day later.

## The symptom

On Koulutus, with more than one kieliversio: select several koulutukset in *Koulutuksen
tiedot*, which clears **Muokkaa koulutuksen nimeä** because the user must now supply the
name. The field clears on the language tab you are looking at. **Any language tab you have
not opened still shows the name of the koulutus that was selected first.**

The field then looks filled, it is required, so validation passes and the stale name is
published. Nobody is told.

Reproduced in a browser test on the edit form (AMK fixture, `nimi` in fi + sv): add a
second koulutus, and the sv tab reads `"Fysioterapeut (YH)"` while fi is correctly empty.
Intermittency depends on the field. On the koulutus-nimi shape above it is a race —
7 of 10 runs in one shape, 2 of 5 in a trimmed one. **On editor fields it is effectively
deterministic** (3/3 with one worker, 4/5 with two), because the editor's programmatic
sync hits the unfavourable ordering reliably. A single manual pass can therefore miss it
on a plain input and will almost always see it on an editor.

## The mechanism

`useField`'s registration effect in react-final-form 7.0.1:

```js
var existingFieldState = form.getFieldState(name);
// If field doesn't exist in form state, it means the field was destroyed
// (e.g., by destroyOnUnregister in StrictMode)...
if (!existingFieldState) {
  var formInitialValue = getIn(formState.initialValues, name);
  var valueToSet = formInitialValue !== undefined ? formInitialValue : initialValue;
  if (valueToSet !== undefined) {
    form.change(name, valueToSet);   // <- writes the old value back
  }
}
```

Mounting a field that has no field state writes its `initialValues` value into the form,
without consulting the current value.

So: `useNimiFromKoulutusKoodi` clears every language through the parent path
(`change('information.nimi', {})`); the mounted fi field stays cleared; `information.nimi.sv`
has never been registered as a field, so opening its tab re-seeds it from `initialValues`.
The race is whether the field's state still exists at mount time.

The comment's inference is the defect. A field has no field state in three situations —
destroyed by `destroyOnUnregister`; unmounted with `destroyOnUnregister: false`, i.e. value
deliberately kept; or **never mounted at all**, the ordinary condition of any conditionally
rendered field. kouta's language tabs are the third. Note also that `form.change` only
writes when the value differs, so the restore is a no-op exactly when it would be harmless
and fires exactly when a value has been deliberately moved away from its initial value: it
does not restore missing values, it reverts modified ones.

Introduced by [PR #1069](https://github.com/final-form/react-final-form/pull/1069) (commit
`1c1d0a99`, merged 2026-02-13) to fix `destroyOnUnregister` + React 18 StrictMode. Absent
in 6.5.9 and in 7.0.0; shipped in **7.0.1**.

## What was ruled out, and how

Recorded so nobody re-runs it:

- **`useNimiFromKoulutusKoodi` is correct.** Instrumented, it fires once and writes `{}` —
  a full clear of every language — on every run, bug or no bug. A unit-level drive of the
  hook produces `{}` too.
- **`change` is correct.** `change('nimi', {fi: undefined, sv: undefined})` clears both
  languages whether or not the other language's field is mounted.
- **Not a re-initialisation.** The `initialValues` identity never changes during the
  interaction, so the library's `shallowEqual` reinitialise never runs.
- **Not the blur-sets-value rule** (Part 7, divergence 5). Disabling
  `withReduxFormInputSemantics.onBlur` entirely leaves the bug in place.

Causality was then established both ways by editing the branch out of the built bundle in
`node_modules` and rebuilding: **5/5 clean with it neutralised, bug back on the control
run with it restored.**

## Blast radius in kouta

The exposure is: *a value written programmatically at a path with no registered field, plus
a field that mounts later at that path.* Concretely — **any programmatic clear or default,
plus a language tab the user has not visited.**

Worth re-checking on multilingual entities: the maksullisuus, apuraha and hakuaika clears,
and the `isUndefined`-guarded defaults in Koulutus (`TiedotSection.tsx:48`, `:70`) and
Toteutus (`TiedotSection.tsx:153`).

**Not affected:** the registry-based hide-and-clear (Parts 2 and 5). That clearing happens
in `getValuesForSaving` at save time, not in form values, and never mounts a field.

**Not affected:** the editable-list shape reported upstream by a third party. It needs
positional field names with *stable* React keys, so a surviving row instance sees a changed
`name`. Every FieldArray render site here keys by index — `FieldArrayList/index.tsx:69`,
`SisaltoFields/index.tsx:125`, `ToteutusForm/EntityFields.tsx:37` — so React identity is
tied to position and no instance ever sees a new name. Consistent with edge case B8 passing.
**If a render site ever switches to a stable key, this exposure opens.**

## Upstream

- [Issue #1095](https://github.com/final-form/react-final-form/issues/1095) — *"useField
  v7.0.1 overwrites form values set via change() for previously unregistered field paths"*,
  opened 2026-07-08, **open**. The reporter's repro is a wizard form whose step 1 writes
  through a parent path and whose step 2 mounts a field at the nested path — mechanically
  identical to ours, language tabs in place of wizard steps. Three independent reporters,
  two shapes.
- [PR #1096](https://github.com/final-form/react-final-form/pull/1096) — fix plus
  regression tests, opened 2026-08-13, **not merged**. Upstream CI does not run on it
  because `ci.yml` is `on: [push]`, so fork PRs never trigger it.
- No 7.0.2. **7.0.1 is still `latest`.**

## If someone patches this anyway, two guards that do NOT work

Both look right and are wrong; this is the most useful thing in this section.

- **`currentValue === undefined`** cannot distinguish a destroyed value from a legitimately
  absent one. It still overwrites after an intentional `change(name, undefined)`, and it
  restores stale entries in array fields whose indices have shifted.
- **Gating on `destroyOnUnregister`** breaks
  [#1085](https://github.com/final-form/react-final-form/pull/1085). Since #988/#1085 that
  block has a second owner: `initialValue` is in the effect's deps, so changing that prop
  re-registers the field, and the write-back is what makes `registerField`'s
  "value equals current initial" precondition hold — which is what applies the new
  `initialValue`. #1096 separates the two cases and gives the changed-`initialValue` path
  its own explicit write-back.

Simply deleting the branch — what was done to prove causality above — is therefore **not**
the patch to ship.

## The decision

**Patched locally, 2026-09-04.** `pnpm patch react-final-form@7.0.1` carrying upstream
PR #1096, declared in `pnpm-workspace.yaml`. Reverses the "wait for a fixed release"
decision of 2026-09-03.

**What reversed it.** The trigger turned out to be an initial value that is **defined but
empty**, which is the ordinary state of an unfilled translated field on a saved entity:
`getFormValuesByKoulutus` runs the value through `parseEditorState`, so `metadata.kuvaus =
{ fi: '', sv: '' }` becomes two empty `EditorState` *objects*, not `undefined`. The
library's guard is `formInitialValue !== undefined`, so it fires and writes the empty
state over whatever the user just typed. That makes the defect:

- **deterministic on editor fields**, not a rare race;
- triggered by the most ordinary interaction there is — editing a translated field and
  switching language tabs;
- silent, and it destroys the user's own text.

It also explains the asymmetry that led to the diagnosis: lisätiedot osiokuvaukset are
*not* affected, because a newly selected osio has no entry in `initialValues` at all, so
`valueToSet` is `undefined` and the reseed cannot fire.

**What the patch contains.** Both hunks of PR #1096, applied to the three non-minified
bundles (`cjs`, `es`, `umd`). The minified UMD build is left alone — its identifiers are
mangled, and neither vite (`module` → es) nor vitest (`main` → cjs) resolves it.

Hunk 1 gates the reseed on `destroyOnUnregister && currentValue === undefined`, i.e. the
case it was written for (#1031). `form.destroyOnUnregister` is a real getter in
final-form 5.0.1, so this narrows the reseed rather than disabling it. Hunk 2 adds the
explicit write-back that the changed-`initialValue` path (#1085) used to get as a side
effect of the reseed; kouta passes `initialValue` at zero call sites, so it is carried
only to keep the patch identical to upstream.

**Measured.**

| | Result |
|---|---|
| Reported symptom, patched | 15/15 green (4 workers) |
| Same test, patch disabled | 3/3 red with one worker, 4/5 with two, 2/2 in the full suite |
| Full browser suite, patched | **167/167** clean |
| `pnpm run lint` · `tsc` · unit | clean · 303 (unchanged) · 293/293 |
| `pnpm install --frozen-lockfile` | works, so CI is unaffected |

Guarded by `editKoulutus.spec.ts` → *"should keep an edit when the language tab is
switched and the initial value is empty"*. Its fixture stores the kuvaus as an **empty
string** for both languages; that is the whole point of the test, and changing it to a
missing key would make it vacuous.

**Note on suite flakiness.** While measuring, the suite produced one load-related failure
per full run on this machine, a different test each time (`copy osaamistavoitteet` with
the patch; `createHakukohde` variants without it). Controlled comparison — two full runs
each way — showed comparable rates, so it is machine load, not the patch. The
`copy osaamistavoitteet` failure mode is `clear()` deleting all but one character, which
is a Playwright interaction race and not a value restore.

**Remove the patch when** 7.0.2 (or later) ships with #1096 in it. pnpm fails the install
when the resolved version no longer matches, which forces the check rather than leaving
the patch to rot. Re-run the guard test after upgrading; do not assume the release fixed
it.

**Still open upstream.** [#1095](https://github.com/final-form/react-final-form/issues/1095)
and [#1096](https://github.com/final-form/react-final-form/pull/1096) are both open, and
`main` has had no code commits since 2026-05-30.

---

# Glossary

| Term | Meaning |
|---|---|
| **store** | One big shared object holding app state (Redux's core idea) |
| **mount / unmount** | A component appearing on / being removed from the page |
| **register / unregister** | A field telling the form library it exists / is gone |
| **payload** | The JSON body sent to the backend on save |
| **`initialValues`** | What was loaded from the backend before the user edited anything |
| **dirty** | The form has unsaved edits |
| **snapshot test** | Records output once; fails if it ever differs |
| **characterization test** | Records what the code does *today*, right or wrong, so changes are visible |
| **harness** | Test helper that sets up everything a component needs to run |
| **codemod** | A scripted, mechanical edit across many files |

---
