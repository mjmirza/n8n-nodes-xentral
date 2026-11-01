# AGENTS.md

Guidance for AI agents and coding assistants working in this repository.

## License

This project is MIT licensed, see the LICENSE file. You may read, copy, modify and redistribute it under the MIT terms. Keep the copyright notice and the license text in any copy.

## Working on this repository

- Run `npm ci`, then `npm run lint` and `npm test` before you propose a change. Lint must report zero problems, it is the same rule set n8n uses to verify community packages.
- Never change a resource `value`, an operation `value`, a parameter `name`, or request routing. Saved n8n workflows depend on them, and changing one breaks those workflows silently.
- Throw `NodeApiError` or `NodeOperationError`, never a raw `Error`, inside a catch block. Use `sleep` from `n8n-workflow` instead of `setTimeout`, and the n8n logger instead of `console`.
- Keep the package free of runtime dependencies. `n8n-workflow` stays a peer dependency.
- Releases go out only through a pushed `v<version>` tag, so the Publish workflow can sign them with npm provenance.

## Support

Questions about custom workflows or Xentral automation projects go to support@next8n.com or [next8n.com](https://next8n.com).

Xentral is a trademark of its owner, referenced here only to describe compatibility. This project is independent and not affiliated with Xentral.
