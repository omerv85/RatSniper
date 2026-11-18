# Rat Sniper: project guide for Claude sessions

Read this first. It explains what the game is, how the code is laid out, how to ship a change, and the
design decisions the owner (GitHub user `omerv85`) has already made, so you don't undo them.

- Live game: https://omerv85.github.io/RatSniper/ (GitHub Pages, branch `main`, root folder)
- Repo: https://github.com/omerv85/RatSniper
- Current version: see `const VERSION` near the top of the script in `index.html`

## What the game is

A mobile-first, night-vision sniper game. A farmer defends a farmyard from rats at night.
Drag to aim (joystick style), lift your finger to fire. Each night lasts 30 seconds; every 5th night is a
boss round against the king rat. The game is endless and ends when you run out of bullets and can't
afford more (see Economy). Plays in landscape on phones; desktop works with a mouse.

## Files

- `index.html`: **the entire game** in one file: HTML, CSS and one inline script (canvas 2D graphics,
  Web Audio sound, everything generated in code). Recorded voice clips are embedded as base64 WAV in
  `VOICE_DATA`. No build step, no dependencies besides Google Fonts
  (Big Shoulders Stencil Display, Share Tech Mono, Rubik for Cyrillic/Hebrew).
- `README.md`: short public description.
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png` (also used as the maskable icon), `apple-touch-icon.png` (180):
  "Add to home screen" support (v0.0.17). The installed game opens full screen in landscape. The icon is a green
  night-vision crosshair drawn with System.Drawing in PowerShell; keep everything inside the middle 80% so Android's
  round masks don't cut it. The start screen's install button opens Android Chrome's prompt (`beforeinstallprompt`),
  or shows a how-to line on iPhone and other browsers; it's hidden once the game runs from the home screen.
  The start screen has no "Boss round" button any more (removed in v0.0.17 at the owner's request).
- `share.jpg` (1200×630): the link-preview picture WhatsApp and others show (Open Graph tags in `<head>`, v0.0.19).
  It's a staged frame of the real game (rats, the rifle, the crosshair on a staring rat) with the RAT SNIPER title
  drawn on top. WhatsApp caches previews per link, so a change can take a while to show up.
- `CLAUDE.md`: this file.

The game was first developed as a claude.ai artifact (https://claude.ai/artifact/3pFadoARRyjL2661NMdVh5,
private to the owner) from a fragment file that was wrapped into `index.html`. That source file lived in a
temporary session folder and is gone; **`index.html` in this repo is now the source of truth. Edit it
directly.** If you also update the artifact, publish `index.html` to that URL.

## How to ship a change (the owner's conventions)

1. Edit `index.html`.
2. Bump the version: `const VERSION = '0.0.N'` in the script **and** the static
   `<div class="ver" id="ver">version 0.0.N</div>` on the start screen. Patch number +1 per push.
3. Test (see Testing).
4. Commit, tag `v0.0.N`, push both: `git push origin main v0.0.N`.
5. **Tell the owner the version number** you pushed; they check it against the start screen.

Owner preferences:
- For new visual content (new rat types, rifle, owl, UFO and the like), **show it for review before pushing**:
  screenshots from a local preview and/or an inline mockup.
- Keep replies plain and concise; the owner plays on an Android phone in landscape.
- Git on the owner's Windows PC: `C:\Program Files\Git\cmd\git.exe` (not on PATH in Windows PowerShell 5).
  Pushes use the saved GitHub sign-in; if a sign-in prompt is needed, run the push in a visible terminal.
- Commit identity used: `omerv85 <omerv85@users.noreply.github.com>` (keeps the real email private).

## Testing

- Serve the folder locally (any static server) and open it in a browser at phone size, e.g. 812×375 landscape.
- For logic checks, temporarily expose internals in a **local copy only** (never commit it), e.g. replace
  `const fontsReady = document` with `window.__nightWatch = { G, fire, update, startRound, buyPack, makeRat };`
  then drive the game from the console.
- **Balance testing bot**: the economy was tuned with a bot that plays whole games inside the real code,
  fast-forwarded (`G.paused = true`, then call `update(1/30)` in a loop). Skill levels:
  casual (reaction 1.0 s, aim error σ 13 world units), average (0.75 s, σ 9), good (0.55 s, σ 6). It waits for
  rats to stop, leads moving ones, sometimes aims for the head, and buys greedily. Results at the time of
  v0.0.14 (median night reached): casual ~4, average ~8, good ~30.
- If the browser pane/tab is hidden, `requestAnimationFrame` stops and the game appears frozen. That's not a bug.

## Code map (inside the script in `index.html`)

Search for these names:
- `STR`, `LANGS`, `tr()`, `applyLang()`: translations (en, ru, es, fr, he). **Every player-visible string
  goes through `STR`**, including HTML (`data-i18n`, `data-i18n-html`, `data-i18n-aria`), canvas text
  (feed sacks), share message and spoken lines. Hebrew switches the page to `dir="rtl"`. Russian plurals via `plural()`.
- `W`, `HORIZON`, `BASE`, `FAR_K`, `LANES`: the world is a 3000-unit panorama that wraps horizontally;
  5 depth lanes (`LANES`, far to near) with per-lane scale. Buildings are pre-rendered (`buildScenery`).
- Economy and difficulty constants: `AMMO_START`, `NIGHT_BONUS`, `HEAD_BONUS`, `PRICE_STEP`, `PACKS`,
  `BOUNTY`, `DIFF` (speed, far, fright, flee), `ROUND_TIME`, `BREAK_TIME`.
- Rats: `makeRat`, `spawnRat`, `updRat`, `hitTest`, `drawRat`; variants: `VARIANTS`, `varSkin`/`varHead`/`varFace`;
  coats: `COATS`, `makeCoat`; king: `makeKing`, `KING_HP`, `explode`; burrowing in: `burrow`, `EMERGE_T`.
- Shooting: `fire()` (ammo, hit test, obstacles block shots, scare nearby rats), `hitRat`, `kill`, `payBounty`.
- Rounds: `startRound`, `endRound(early)`, `renderShop`, `buyPack`, `gameOver`, `startGame`, `goHome`.
- Extras: owl (`makeOwl`, `flushOwl`), UFO rat (`spawnUfo`, `shootUfo`), clutter (`makeObstacles`, `drawObs`),
  first-person rifle (`drawRifle`, 3D-projected), crosshair, joystick (`steer`, `JOY_*`), pause, full screen,
  rotate-to-landscape screen (`checkOrientation`).
- Audio: `initAudio`, music scheduler (`schedule`, night pads/plucks/crickets/owls; boss metal riff `RIFF`),
  sound effects `sfx*`, announcer `voice()` (recorded clips) with `speakLine()` fallback (device speech).

## Design decisions already made (don't reverse without asking)

Gameplay
- Drag = joystick: view turns faster the further the finger is from where it touched; lift = fire.
  Crosshair is a small 4-arm cross in the screen centre. Shot cooldown 0.55 s (bolt cycle).
- One hit kills a normal rat; **head shot counts as 2 hits** (one-shots alphas, 2 damage on the king).
- Alpha rats (bigger, red eyes): every 10th spawn, 2 hits, enrage (spasms, faster) when wounded.
- Rare variants every 15th non-alpha spawn (counter resets per game): zombie (2 body hits), clown, x-mas, pirate,
  drunk, albino, mohawk, French moustache, blind (walks upright with a cane). Rare variants don't stare at the camera.
  Removed by the owner: "old" and "gremlin".
- Rats sometimes stare at the camera (~2 s), dig out of the ground when spawning in view, scurry away from
  shots (away from the shot point), pass behind clutter (mounds, cans, bags, boxes, bottles, buckets) that blocks shots.
- Grenade (v0.0.15): bought in the shop (6 coins, +1 every 5 nights; none at the start). Tap the round button
  bottom-middle (shows the count; `G` on desktop) to take one in hand: the rifle swaps for a bare hand holding a
  pineapple grenade and the crosshair becomes a bomb outline plus a dashed oval showing the blast area. Lift = quick
  throw (0.42 s flight), then an explosion that does **2 damage** to every rat in the oval (`NADE_RX`/`NADE_RY`, scaled
  by depth with `scAt`), also downs the UFO, flushes the owl and breaks bottles. Code: `setArmed`, `throwNade`, `blast`,
  `drawHand`, `drawGrenade`, `drawBombSight`, `sfxPin`/`sfxThrow`/`sfxNade`. A night ends early only when both bullets
  and grenades are gone. Bot: ~2.5 kills per grenade.
- Boss every 5th night: king rat, **8 hits** (was 10 until v0.0.14), rages after each hit, bleeds/growls under half health,
  explodes with rib cage on death; health bar instead of timer; heavy-metal music.
- Owl (60% of nights) sits on a background ledge; shooting it only makes it fly off (no reward).
- UFO rat (12% of nights): flies over the yard, hovers with a beam; shooting it down = kill.
- Rats counted per night and per game; special kills shown as badges on the cleared and game over screens.

Economy (tuned with the bot, v0.0.14)
- Start 15 bullets. Every shot costs 1. Bounty in coins: rat 1, alpha 2, rare 3, UFO 5, king 10, +1 head shot.
  Coins appear as rising, spinning coin icons (one per coin).
- Running dry **ends the night early** (no night bonus). Finishing a night pays **+5 bullets**.
- Shop between nights (15 s countdown + "Start now"): a row of item cards (icon, amount, coin price):
  5 bullets for 4 coins, 15 for 10, 1 grenade for 6; all +1 coin every 5 nights (`PRICE_STEP`).
- **Game over** = at the shop with 0 bullets and not enough coins for the cheapest pack.
  Game over screen: nights survived, rats killed, best (saved locally), special-kill badges,
  Share on WhatsApp (`wa.me` link with a translated message + game URL), Play again, Main menu.
- Difficulty grows each night up to caps (`DIFF`): rat speed, spawning on far lanes, scare radius, flee speed.

Presentation
- Night-vision greyscale with noise/scanlines/vignette; accents: green crosshair/buttons, amber for rare,
  red for boss/alpha eyes. Title "RAT SNIPER" and the "IR 3 · 4.0× · REC" readout are not translated.
- Rifle: first-person black bolt-action with scope, lower-right, recoil + bolt cycle + muzzle flash;
  can be hidden from the pause menu (remembered).
- Pause button bottom-right (pause screen: resume, sound on/off, rifle shown/hidden, main menu, language);
  full-screen button bottom-left (only shown when not full screen); phones in portrait get a
  "turn your phone sideways" screen that pauses the game. Android also locks landscape in full screen.
- Announcer voice: recorded deep male clips for **English** (Windows "Microsoft David", SAPI, pitch x-low)
  and **Hebrew** (Windows OneCore "Microsoft Asaf" via the WinRT speech API; Hebrew text must be built from
  character codes in PowerShell 5 scripts). Played slightly slowed (0.9 / 0.86) with bass boost and echo.
  Russian, Spanish and French fall back to the device's speech voice until those Windows voices are installed
  and recorded the same way. Phone speech voices sound metallic at very low pitch, which is why clips are recorded.
  Exact recipe (matches the existing clips sample for sample): English = System.Speech, "Microsoft David Desktop", Rate -3,
  SSML prosody pitch x-low, 22050 Hz 16-bit mono. Hebrew = WinRT SpeechSynthesizer, Asaf, Options.SpeakingRate 0.8,
  Options.AudioPitch 0.5, 16 kHz 16-bit mono. Both trimmed to the voiced part plus 0.05 s before and 0.1 s after.
  Clips: round, head, king, noAmmo, noTime. The end of a night says "Round cleared" then why it ended
  ("Ran out of ammo" / "Ran out of time"; nothing extra when the king dies).

## Ideas discussed but not built
- Cap on rats visible on screen at once (owner noticed crowding; options were offered, none chosen yet).
- Feed-store meter (rats stealing feed) as an extra fail condition.
- Front-facing costume variants so rare rats can also stare at the camera.
