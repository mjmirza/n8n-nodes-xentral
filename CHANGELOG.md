# Changelog

## 1.0.10 (2026-10-31)

### Fixed

- Product search now matches the article number and the EAN, not only the product name. The field always promised "name, article number, or EAN", but the search sent a single name filter, so a search by article number returned nothing. The three lookups now run in parallel and are merged with article-number matches first, duplicates removed, and the limit applied to the merged result.

### Added

- Unit tests for product search, run with `npm test`, and a CI workflow that builds and tests every push and pull request.
- The source of the published 1.0.8 and 1.0.9 releases, which had not been pushed to this repository.
