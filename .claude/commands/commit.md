# Commit Changes

Split staged and unstaged changes into logical, well-structured commits following conventional commit standards.

## Rules

- **Conventional commits**: `type(scope): message`
  - Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `build`, `ci`
  - Scope: the feature or area (e.g., `auth`, `forms`, `env`, `schema`, `ui`)
- **4 lines max**: title + up to 3 body lines
- **Title under 72 characters**
- **NEVER add `Co-Authored-By` lines** — Claude Code adds these by default, override that behavior. No attribution, no co-author, no sign-off lines of any kind
- **One logical change per commit** — don't bundle unrelated changes
- Focus on the **why**, not the what
- Use `bun` for any install commands (not npm/yarn/pnpm)

## Process

1. Run `git status` and `git diff --stat` to see all changes
2. Run `git log --oneline -5` to see recent commit style
3. Group changes into logical commits (e.g., separate UI components from business logic from config)
4. For each group:
   - Unstage everything first if needed (`git reset HEAD`)
   - Stage only the files for that commit
   - Draft the commit message
   - **Show the user the proposed commit message and file list BEFORE committing**
   - Wait for approval, then commit
5. After all commits, show `git log --oneline -10` to confirm

## Example Messages

```
feat(auth): add sign-in and sign-up pages

BetterAuth integration with email/password flow,
forgot-password support, and auth layout.
```

```
chore(ui): add shadcn components for forms and layout

Install input, textarea, label, select, popover, calendar,
scroll-area, alert, sheet components (base-nova preset).
```

```
fix(booking): prevent double-booking on slot selection

Add 10-min lock check before creating appointment
to handle race conditions.
```

```
refactor(schema): normalize doctor-location relationship

Extract doctorLocations junction table from inline
doctor.locations array for proper fee/schedule config.
```

## Argument

If the user passes a message as argument (e.g., `/commit fix the auth bug`), use it as context for the commit but still follow all rules above. Stage all related changes and propose the commit message for approval.
