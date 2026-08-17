# Learning Notes — 2026-08-12

Context: Genasys Technologies interview prep. This session's focus was TDD
(red-green-refactor) applied to `PlayerService`, RxJS testing patterns, and
Angular DI/testing gotchas — working through the new-user profile flow.

## TDD workflow

- Red-green-refactor, applied to `PlayerService.getUserProfile$()`:
  1. Write the test first, **run it and watch it actually fail** — proves
     the test is testing something real, not a typo that happens to pass.
  2. Minimal code to go green.
  3. Refactor with the test as a safety net.
- Start TDD at the **smallest testable unit** underneath a feature — the
  service layer, before the component that consumes it.
- A failing test can fail for the **wrong reason** (a mock-shape bug) rather
  than the reason you're actually trying to catch. Always read the actual
  failure message/stack trace, don't assume "red" means "the real bug was
  caught."

## RxJS testing patterns

- **`firstValueFrom(observable)`** — converts an Observable's first emission
  into a `Promise` you can `await` directly in an `async` test, instead of
  manually `.subscribe()`-ing and juggling callbacks.
- **Mocking a chainable/fluent API** (Supabase's `.from().select().eq().maybeSingle()`):
  each intermediate method returns the mock object itself via
  `vi.fn().mockReturnThis()`; only the **terminal** call
  (`.maybeSingle()`) resolves to an actual value, via `vi.fn().mockResolvedValue(...)`.
- **Mocking `AuthService`**: no need for anything elaborate — a fake object
  whose `authState` property is a **real `BehaviorSubject`**, seeded with a
  fake session, is enough for `.pipe(switchMap(...))` to work exactly like
  production.
- **`of()` vs `from()`**: `of(value)` emits an already-known static value
  immediately. `from(promise)` subscribes to a Promise and emits its
  *resolved* value. Wrapping a Promise in `of()` instead of `from()` gives
  you an `Observable<Promise<...>>` — a common, easy mix-up.
- **`switchMap` vs `mergeMap`/`concatMap`**: `switchMap` cancels the previous
  inner observable when the source emits again — only the *latest* request's
  result is ever honored. Right choice when stale in-flight requests should
  be discarded (search-as-you-type, or here: don't let a stale profile fetch
  for a *previous* logged-in user land after a new user's fetch started).
- **`catchError`/`finalize` placement matters** — they need to live *inside*
  `switchMap`'s inner pipe, not appended to the outer chain:
  - `catchError` on the *outer* pipe permanently terminates the whole
    subscription on the first error — future source emissions (e.g. future
    `authState` changes) would never be received again. Scoping it to the
    inner pipe means only that one fetch attempt fails gracefully; the outer
    subscription (to `authState`) stays alive.
  - `finalize` on the *outer* pipe only fires once, at teardown — not once
    per fetch. Needs to be inside the inner pipe to toggle a loading flag
    correctly for each individual request.
- `tap` is a **side-effect** operator (e.g. logging) — the value passes
  through unchanged. `map` **transforms** the value. Different jobs.
- Naming convention: append `$` to anything that's an `Observable`
  (`getUserProfile$()`) — not enforced by the compiler, purely a readability
  signal that "this needs to be subscribed to, not used directly."

## Angular DI / TestBed gotchas

- **`provide` vs `provider`** in a `Provider` object — `{ provider: X, useValue: ... }`
  (typo) isn't a valid shape Angular recognizes. It doesn't error loudly;
  Angular just doesn't register it as an override, and for a
  `providedIn: 'root'` service, DI silently falls back to constructing the
  **real** service instead of the fake. This produced a very confusing
  symptom (test always got real, unmocked behavior) for a one-letter typo —
  worth double-checking provider object keys specifically when a mock isn't
  "taking."
- **TestBed can't be reconfigured after it's already been instantiated.**
  A nested `describe` block's `beforeEach` trying to call
  `TestBed.configureTestingModule(...)` again, after an *outer* `beforeEach`
  already called `TestBed.inject(...)`, doesn't work as a way to change
  providers per-scenario. Fix: give each test scenario its own **top-level,
  sibling** `describe` block, each with its own independent
  `beforeEach`/`configureTestingModule`/`inject` — not nested inside a
  shared one.
- **Implicit-return arrow functions silently exclude following statements.**
  `beforeEach(() => TestBed.configureTestingModule({...}))` (no `{ }` braces)
  means only that one expression is the function body — a statement written
  on the *next line* is NOT part of the callback, and runs once at
  collection time instead of once per test. Always use braced arrow bodies
  for multi-statement callbacks.
- **`HttpTestingController`/`HttpClientTestingModule` are for `HttpClient`-based
  code specifically.** Not needed when a service (like `Supabase`, wrapping
  the Supabase JS SDK) is mocked directly at the DI level — the fake object
  replaces the thing that would make the network call before it ever reaches
  an HTTP layer at all.
- **`fixture.componentRef.setInput('name', value)`** is the correct way to
  set a component's `@Input()`/signal `input()` in a test — not direct
  property assignment (`component.prop = value`), which bypasses Angular's
  input-binding lifecycle and doesn't work at all for signal inputs.

## TypeScript / data modeling

- Postgres UUID and timestamp columns come across the Supabase JS client as
  plain `string`s (not a UUID type, not `Date`) — model them as `string` in
  TS unless you explicitly parse them yourself.
- `jsonb`/`json` columns need a deliberate nested object type — there's no
  way to infer their shape from the column type alone; model them to match
  what you actually intend to store.
- Angular's typed reactive forms default each control to `T | null`
  (nullable), since `.reset()` can null a control out. `fb.nonNullable.group({...})`
  removes the null from the inferred type when you know you won't reset to null.

## SOLID / design

- **SRP applied to `UserProfileComponent`**: it should render the form and
  emit submitted values (`profileSubmitted = output<Partial<Profile>>()`) —
  it should **not** call `PlayerService.updateUserProfile()` itself. The
  container component (`DashboardComponent`) owns orchestrating the actual
  data call. Keeps the presentational component reusable and testable in
  isolation (no need to mock `PlayerService` just to test form rendering).
