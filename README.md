# AR ROYAL — 2D Battle Royale

A landscape-first HTML5 Canvas battle royale campaign with 20 handcrafted level configurations, persistent player progress, Web Audio weapon effects and touch controls.

## Run
Open `index.html` in a modern browser, or serve this folder from a local/static web server. For the best mobile experience, use landscape orientation and install as a PWA if desired.

## Updated interface flow
- Lobby: start the selected mission and open the main panels.
- Player Profile: account level, XP, matches, kills, wins and win rate.
- Missions: all 20 levels with completed/current/locked states; locked levels unlock sequentially. Select Mission returns to the lobby with the selected level.
- Armory: all five implemented weapons (M4A1, MP40, M1887, AWM, G18), damage, magazine capacity, purchase/equip and weapon sound preview.
- Outfits: all existing outfit skins, purchase/equip; the 2D lobby character preview uses the selected outfit.
- Rewards: one daily claim per local calendar day; match rewards are credited to the saved local player profile.
- Settings: player name, game speed, HUD size, sound, graphics quality, vibration preference and controls guide.
- Pause: resume, restart, settings and return to lobby.
- Results: rank, kills, damage, match time, rewards, next level, replay and lobby.

## Controls
Desktop: WASD move, Shift sprint, mouse aim/fire, RMB or Q scope, R reload, E loot, H heal, Esc pause.
Mobile: left virtual joystick to move; right virtual joystick to aim; on-screen fire, scope, reload, sprint and heal buttons.

## Data and save behavior
Player profile, unlocked campaign levels, settings and reward claim date are stored in browser localStorage on the current device/browser. This build does not include online accounts or cloud synchronization.

## Notes
The existing Canvas gameplay and level generation code are retained. The menu panels allow vertical touch scrolling and mouse-wheel scrolling; global gesture suppression is overridden within the scrollable panel content. The included `ar-royal-logo.png` is the supplied AR ROYAL crown logo.
