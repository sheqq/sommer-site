# Changelog

This file tracks API-contract and application changes separately. The version
sources remain `docs/api/sommer-facade.yaml` for the API and `package.json` for
the app.

## API

### 0.0.1 — 2026-11-19

- Added endpoints to create, retrieve, and update server settings.
- The bot can retrieve `colorsEnabled` and must check that it is `true` before
  creating a colored Discord role.

## App

### 0.0.0 — 2026-11-19

- Added MongoDB persistence for servers and the corresponding API operations.
- Replaced the home-page endpoint list with a live list of saved servers,
  including their `colorsEnabled` status.
- No package dependencies changed for these features.

## Versioning and documentation

- Update the API version in `docs/api/sommer-facade.yaml` when the API contract
  changes; this file is the source of truth. Then run `npm run generate` and
  keep `README.md` in sync. Do not edit `src/generated/api` manually.
- Update the app version in `package.json` when releasing an app change, and
  add a dated entry under **App** above.
- Record dependency changes under the relevant **App** version, including the
  package name, old and new versions, and reason. Use npm to update
  `package.json` and `package-lock.json`.
