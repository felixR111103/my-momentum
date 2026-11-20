# Publication Audit

Audit date: 20 November 2026

## Scope

This project was reviewed for publication in a public GitHub repository. The review
covered the working tree, tracked and untracked files, reachable Git history, ignore
rules, extension permissions, external network references, setup documentation,
local data storage, the README screenshot, and common indicators of secrets or
personal data.

Automated pattern checks can reduce risk, but they cannot prove that a repository
contains no sensitive information. This report is intentionally sanitized and does
not reproduce personal contact details, credentials, or embedded metadata values.

## First audit — initial findings

The first audit reviewed the repository before any audit-related fixes were applied.

### Checks performed

- Reviewed Git status, tracked files, untracked files, ignored files, and filenames
  in reachable history.
- Checked current text files and reachable history for common credential,
  private-key, access-token, password, and email patterns without recording
  sensitive values.
- Reviewed `.gitignore` coverage for operating-system metadata, editor settings,
  environment files, logs, and dependency folders.
- Reviewed `manifest.json` for extension permissions, host permissions, and an
  accurate public description.
- Searched the source for external HTTP endpoints, `fetch`, `XMLHttpRequest`, and
  WebSocket usage.
- Confirmed that the README covered purpose, data collection, persistence, user
  interaction, setup, learning, limitations, assistance, and a screenshot.
- Inspected the README screenshot's type, dimensions, metadata markers, and visible
  personal context.
- Reviewed which user data is stored in `localStorage` and IndexedDB.

### Issues and missing items found

#### 1. Missing audit record

The repository did not contain the required `AUDIT.md`, so there was no permanent
record of the publication checks, findings, or remaining limitations.

#### 2. Screenshot metadata

The README screenshot contained GPS-related metadata markers. No embedded location
value was printed or recorded during the audit.

#### 3. Outdated manifest description

The `manifest.json` description referred only to a personal to-do list, although the
current extension also includes daily focus, configurable clocks, personalization,
and photo backgrounds.

#### 4. Narrow `.gitignore`

The initial `.gitignore` excluded only `.DS_Store`. It did not proactively exclude
other common local, generated, or sensitive files such as environment files, logs,
editor settings, or dependency folders.

### Recommendations requiring an owner decision

#### 1. Review visible personal context

The extension defaults and README screenshot display a first name. The screenshot
also includes a recognizable background choice, example tasks, due dates, and
browser interface context. These are not credentials, but they are public personal
or contextual information.

#### 2. Decide whether to add a license

The repository does not contain a `LICENSE` file. Without a license, other people do
not automatically receive permission to reuse or modify the project even though
they can view it in a public repository.

#### 3. Review Git author metadata

Standard Git history contains an author email address. The address is not present in
the current project files, but it may be visible on a public Git host.

#### 4. Review the historical `.DS_Store`

An earlier commit added `.DS_Store`. A later commit removed it, but the obsolete
binary remains in reachable Git history.

#### 5. Consider automated browser tests

The README contains manual acceptance checks, but the project has no automated
browser test suite.

### Checks that passed in the first audit

- No common credential, private-key, password, or access-token pattern was detected
  in the current project files.
- No email address was detected in the current project files.
- A high-confidence scan of reachable Git history did not detect common credential
  or private-key patterns.
- No external HTTP endpoint, `fetch`, `XMLHttpRequest`, or WebSocket usage was found
  in the extension source.
- The extension requested no additional Chrome permission or host permission.
- No dependency directory, cache, log, editor-settings directory, or local
  environment file was present in the project tree.
- The project intentionally had no package manager, build step, backend, API key,
  environment variable, or external runtime dependency.
- The README included all documentation topics required by the submission
  guidelines and linked to an existing screenshot.

## Second audit — fixes and updated results

The project was audited a second time on 20 November 2026 after the first audit's
findings were reviewed. This pass checked the updated local working tree rather than
the older version on GitHub.

### Fixes made after the first audit

#### Audit record added

`AUDIT.md` was created to record both audit passes, the fixes made, owner decisions,
and remaining limitations. The README project structure was also updated to list
this file.

#### Screenshot metadata removed

The screenshot was re-encoded through an intermediate image format to remove its
embedded metadata while preserving its visible content and pixel dimensions. The
second scan found no GPS-, latitude-, or longitude-related metadata marker.

#### Manifest description corrected

The manifest description was updated to represent the complete dashboard rather
than only its task-list feature.

#### `.gitignore` expanded

Rules were added for Windows metadata, local editor folders, environment files,
logs, and dependency folders. A future `.env.example` remains permitted.

### Owner decisions recorded during the second audit

- **Visible personal context:** Accepted. The project owner intentionally selected
  the screenshot to demonstrate the extension in real use.
- **Git author metadata:** Accepted. The project owner chose not to rewrite existing
  Git history.
- **Historical `.DS_Store`:** Accepted because it does not contain secret
  information. Git history was not rewritten.
- **License:** A separate license is not required for this educational submission.
- **Automated testing:** The project owner chose not to add or run an automated
  browser suite. Manual acceptance checks remain the documented testing method.

### Confirmed results of the second audit

- No high-confidence credential, private-key, access-token, password-assignment, or
  email pattern was detected in the updated project files.
- No common credential pattern was detected in reachable Git history.
- No GPS-, latitude-, or longitude-related marker remained in the README screenshot.
- The screenshot retained its original dimensions and visible content.
- The manifest description reflected the current extension.
- `.gitignore` covered common operating-system metadata, editor settings,
  environment files, logs, and dependency folders.
- No tracked file matched the expanded ignore rules.
- No external request or additional extension permission was detected.
- The README included all required submission sections, the real-use screenshot,
  and `AUDIT.md` in the project structure.
- `git diff --check` found no formatting errors.

### Remaining limitations after the second audit

- Tasks, focus, settings, and photos remain in one Chrome profile and are not
  synchronized across devices.
- There is no export, import, or cloud-backup feature.
- Removing the extension or clearing its browser data can remove saved content.
- The background library is limited to 10 images of up to 10 MB each.
- Clock selection is limited to the timezones currently offered in the settings.
- Deleting a task or photo has no undo action.
- Runtime behavior is covered only by manual acceptance checks, not an automated
  browser test suite.
- The extension has not been packaged or published in the Chrome Web Store.
- Repository visibility, branch protection, collaborator access, Actions secrets,
  and other remote-host settings were not independently verified.
- Copyright or reuse rights for the selected background shown in the screenshot
  were not independently verified.
- Behavior in browsers other than the documented Chrome workflow was not
  independently verified.

### Git housekeeping after the second audit

At the end of the second audit:

1. The `.gitignore`, README, manifest, and sanitized screenshot changes were still
   uncommitted in the local working tree.
2. `AUDIT.md` was still untracked and would not appear on GitHub until it was added,
   committed, and pushed.

These reviewed changes must be committed and pushed before the audit record and its
fixes are visible in the public repository.

## Publication assessment

The first audit identified four items requiring fixes and five items requiring owner
decisions. The second audit confirmed that all four fixable issues were resolved and
that each owner decision was explicitly reviewed and documented.

No credential values, external network endpoints, additional extension permissions,
or tracked local dependency/cache folders were detected. The remaining items are
accepted decisions, product limitations, remote-host checks, or future reliability
improvements rather than confirmed credential leaks.

This assessment reflects the repository state on the audit date and is not a
guarantee that every possible security, privacy, legal, or operational issue has
been identified.
