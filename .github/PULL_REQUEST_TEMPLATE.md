<!--
  Thanks for opening a PR! Keep the title in Conventional Commits format:
    feat(mobile/qibla): add calibration overlay
    fix(admin/reviews): recompute rating on status change
    docs: expand EAS build instructions
-->

## Summary

<!-- One or two sentences on what this PR does and why. Link issues with "Closes #123" if relevant. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor (no behavior change)
- [ ] Documentation / README
- [ ] Build, CI, or tooling
- [ ] Breaking change

## Testing

<!-- How did you verify this works? Device + OS for mobile changes, browser for admin. -->

- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] Tested locally (describe the flow below)

<!-- Paste screenshots, GIFs, or log output here when useful. -->

## Checklist

- [ ] Title follows Conventional Commits (`feat(scope): ...`)
- [ ] No secrets committed (`.env.local`, `.dev.vars`)
- [ ] Docs / README updated if the user-facing behavior changed
- [ ] Mobile UI tested in a dev build on a real device (if touching native APIs)
- [ ] Admin changes tested against a real Neon database
