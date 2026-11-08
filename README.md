# INTERalliance: The Gateway

**An unofficial, immersive introduction to INTERalliance of Greater Cincinnati.**

A playable, independently developed onboarding game made for school-chapter introductions, student recruitment, and an ILC demonstration. Walk through a futuristic 3D hub, discover the history and purpose of INTERalliance, answer short challenges, and leave with a personalized path into the organization.

> This is an independently developed prototype, **not** an official or endorsed INTERalliance product. All organizational facts should be reviewed with an ILC representative before the project is used as an official orientation.

## Play it

Open `index.html` on a laptop with internet access, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080`. No build process, npm installation, account, or API key is required. The 3D scene loads A-Frame 1.8.0 from its public CDN, so internet access is needed for 3D mode. If A-Frame cannot load, a fully styled, clickable desktop portal interface loads automatically. To deliberately use this mode, add `?desktop=1` to the URL.

For supported VR headsets such as Meta Quest, publish this static site over **HTTPS** and open it in the headset's browser. Use the scene's **Enter VR** control. Controller triggers or gaze activate scene options. **Headset compatibility has not yet been verified on physical hardware.**

## What's playable

| Exhibit | What the player learns | Challenges |
| --- | --- | ---: |
| The Origins | ILC, the first interns, TechOlympics, Women in IT, and Intern Summit milestones | 2 |
| The Mission | The nonprofit's mission and Inspire / Network / Train / Employ / Retain framework | 2 |
| The Opportunities | Chapters, TechOlympics, training, networking, and paid INTERnships | 2 |
| The Leadership | The six ILC teams and what each does | 3 |
| Your Future | Personalized BUILD, LEAD, or LAUNCH entry path | 1 |

**10 scored checkpoints total**, including **two multi-step interactive missions**: a historical time-machine puzzle (2007 → 2008 → 2010) and an ILC operations desk that routes incoming requests to Systems, Data, and Finance. Two more leadership checkpoints cover Chapters and Marketing.

**10 challenges total**, 100 XP per completed challenge, persistable progress, restart button, optional narration, a VR fact carousel, and a VR-accessible continue control.

### Controls

- **Desktop:** Click the five exhibit portals (in desktop mode) or the 3D kiosks; press `1`–`5` to navigate. Click answers or use `A`/`B`/`C`. `→` proceeds to the next challenge/exhibit. `N` narrates. `Shift + R` resets.
- **VR:** Point a controller at a kiosk, a holographic mission podium, or an answer on the central board and press the trigger; gaze-based activation is also supported. Select **NEXT FACT** to cycle factual notes on the central board. Use **CONTINUE** to proceed. 
- **Mobile browser:** A compact reading/quiz overlay is available; the scene can still render underneath on supported browsers.

Progress is saved locally in the browser where localStorage is available. Use **Reset** before the live demo.

## Project structure

```text
index.html             3D room, HUD, click targets, WebXR scene
styles.css             Visual style, responsive overlay, fallback
content.js             The 5 sourced exhibits and 10 questions
app.js                 Game state, interaction, VR panels, narration
package.json           Optional test commands
.github/workflows/     Basic GitHub CI workflow
tests/check-content.cjs  Automated content validation
tests/check-app.cjs      DOM-simulated game interaction tests
tests/check-browser.cjs  Optional Chromium smoke test (not yet validated here)
docs/SOURCES.md         Official sources and content decisions
docs/DEMO.md            2-minute live pitch and checklist
```

## Check the project

With Node.js 20+ installed:

```bash
npm test
```

This checks JavaScript syntax, validates data structure and source links, and exercises the full 10-challenge game flow, a wrong answer, scoring, custom path selection, and reset using lightweight DOM simulations. These tests pass. A real Chromium desktop DOM smoke test (with A-Frame intentionally omitted) also **passes** in this environment using `python tests/check-real-browser.py`. This checks the offline desktop fallback and game interaction, not the WebXR renderer.

**Not yet tested:** Quest/other physical headset rendering, controller ergonomics, audio on Safari and headset browsers, and public GitHub Pages deployment.

## Publishing via GitHub Pages

1. Create a new repository named `interalliance-gateway-vr` and upload these files to its `main` branch (preserving their folder structure).
2. Open **Settings → Pages** in the repository.
3. Select **GitHub Actions** as your Pages build-and-deployment source. The included deployment workflow publishes the four static application files on every push to `main`.
4. When GitHub provides the HTTPS Pages URL, open it on desktop first, then on the headset. Add `?desktop=1` for a predictable laptop-only presentation.

Do **not** add an unapproved official INTERalliance logo or imply this is an official product. You can make the title, style, and content more official after receiving permission.

## Editing the orientation

The content lives in `content.js`, including the complete text, fact list, checkpoint choices, VR summaries, narration, and official source links. Each `rounds[]` checkpoint has exactly three clickable options; exactly one should be marked `correct: true`, except the final personalized path round where all three choices are valid.

The WebXR scene uses built-in A-Frame geometric primitives, including selectable holographic podiums for both special missions. No paid assets, external 3D models, or online game database are required.

## Next development milestones

- **M2:** Test on Quest; adjust board dimensions, text density, and controller interactions from real headset feedback.
- **M3:** Interactive timeline, ILC dispatch missions, and spatial mission podiums **implemented**; verify the actual VR interactions on hardware.
- **M4:** Add an optional facilitator mode, chapter branding (after approval), and a QR-code take-home page for new members.

The priority is a reliable demo that communicates the organization—not a 20-minute tech showcase that no one finishes.

## Development log

- **v0.2:** Chronology mission, live ILC dispatch desk, clickable in-world mission podiums, a dedicated offline desktop world, improved path results, and expanded tests.
- **v0.1:** Five sourced exhibits, ten check-ins, scoring, persistence, personalization and WebXR foundation.

See `docs/DEPLOY.md` for repository creation, static hosting, headset checks and troubleshooting.