# Treasure Quest: The Decomposer

## Game Design Document

### 1. Overview

| Field | Detail |
|-------|--------|
| **Title** | Treasure Quest: The Decomposer |
| **Genre** | Educational puzzle / strategy |
| **Target Age** | 8-10 years old |
| **Platform** | Browser (PWA — installable, mobile-app experience) |
| **Core Skill** | Strategy decomposition — breaking complex problems into smaller, ordered steps |
| **Design Philosophy** | Strategy > Impulse — reward prefrontal planning over reactive guessing |

---

### 2. Core Concept

Players are treasure hunters who must **plan before they act**. Each level presents a big challenge that can only be solved by breaking it down into the right sub-steps, arranging them in the correct order, and locking in a plan before execution begins.

The game teaches **decomposition thinking** — a foundational computational thinking skill — through an engaging treasure hunt narrative.

---

### 3. Core Game Loop: Plan → Execute → Reflect

#### Phase 1: PLANNING (Strategic Thinking)

- Player sees the challenge description and a set of available step cards
- Player **drags and arranges** step cards into their planned order
- Player **discards irrelevant/distractor** step cards
- **No time pressure** — the game encourages deliberate thinking
- Player can use a **"Think About It"** tool that highlights dependencies between steps
- Player hits **"Lock In Plan"** when confident

#### Phase 2: EXECUTION (Watch Your Plan Unfold)

- The plan plays out as an **animated sequence** — no changes allowed
- Each step executes one by one with visual feedback
- If a step fails (wrong order, missing prerequisite), the character visibly struggles and the sequence **stops at the failure point**
- Player sees exactly **where and why** their plan broke down

#### Phase 3: REFLECT (Learn & Adapt)

- Post-level review screen explains what happened
- Shows which steps succeeded and which failed, with clear reasoning
- Option to **retry with edited plan** or **start completely fresh**
- Reflection encourages growth mindset: "Every mistake teaches you something!"

---

### 4. Difficulty Progression

| Levels | Total Steps | Distractors | Special Mechanics |
|--------|-------------|-------------|-------------------|
| 1-3 | 2-3 | 0 | Tutorial — guided hints, "Think About It" auto-activates |
| 4-7 | 4-5 | 1-2 | Timed bonus stars (for planning quality, NOT speed) |
| 8-10 | 5-7 | 2-3 | Parallel branches — some steps can happen simultaneously |

---

### 5. Incentive Design: Strategy > Impulse

#### Scoring & Rewards

| Behavior | Reward | Message |
|----------|--------|---------|
| Solving on first plan attempt | 3 stars + "Master Strategist" badge | "You planned perfectly!" |
| Using "Think About It" tool before submitting | Bonus treasure item | "Great thinkers use all their tools!" |
| Taking time to rearrange steps before locking in | Hidden "Patient Planner" bonus | "You didn't rush — that's real strategy!" |
| Rushing & submitting within 5 seconds | Gentle nudge (no penalty) | "Slow down! Great adventurers plan first." |
| Submitting a wrong plan | No stars lost, shown WHY it failed | "Every mistake teaches you something!" |
| Solving after reflecting and fixing | 2 stars + "Resilient Thinker" badge | "You learned from your plan and adapted!" |

#### Anti-Impulse Mechanics

- **No penalty for taking time** — the game never rushes the player
- **Soft gate:** If player submits in under 5 seconds, a friendly prompt asks: "Are you sure? Have you checked each step?"
- **"Plan Review" button** — highlights potential issues before locking in (earns bonus points for using it)
- **No random guessing exploit** — distractor count increases with level, making brute-force impractical

---

### 6. Reward Systems (4 Layers)

#### 6.1 Stars & Badges
- 1-3 stars per level based on planning quality (fewer attempts = more stars)
- Achievement badges for milestones:
  - "First Try!" — solve a level on the first attempt
  - "Speed Thinker" — solve quickly BUT correctly (not rushing)
  - "Master Strategist" — 3-star a set of levels
  - "Patient Planner" — consistently use Think About It tool
  - "Resilient Thinker" — succeed after learning from a failed attempt

#### 6.2 Treasure Collection
- Each level unlocks a unique treasure item (gems, ancient coins, artifacts, relics)
- Items displayed in a personal **Treasure Vault** screen
- Rarer items for harder levels or first-try completions

#### 6.3 Character Upgrades
- Earn gear and equipment as you progress:
  - Compass (Level 2), Map (Level 4), Torch (Level 6), Boots (Level 8), Crown (Level 10)
- Cosmetic upgrades visible on the player's character avatar
- Gives visual sense of progression

#### 6.4 Story Unlocks
- Completing levels reveals pieces of a **larger treasure map**
- Each piece adds to the narrative: clues about an ancient civilization
- Final level (10) reveals the full map and a story conclusion
- Creates a meta-narrative that drives completion

---

### 7. Level Content

#### Level 1: "Open the Locked Treasure Chest"
- **Steps:** Find the key → Insert key into lock → Turn the key → Open the chest
- **Distractors:** None
- **Teaching:** Introduction to step ordering

#### Level 2: "Cross the River"
- **Steps:** Find wood → Build a raft → Push raft into water → Paddle across
- **Distractors:** None
- **Teaching:** Prerequisite dependencies (can't build without materials)

#### Level 3: "Light the Dark Cave"
- **Steps:** Find dry sticks → Find flint stone → Strike flint to make spark → Light the torch
- **Distractors:** None
- **Teaching:** Sequential dependencies and tool creation

#### Level 4: "Climb the Mountain"
- **Steps:** Check the weather → Pack supplies → Find the trail → Climb to the peak
- **Distractors:** "Jump off cliff" (wrong action)
- **Teaching:** Planning before acting, identifying bad steps

#### Level 5: "Sneak Past the Sleeping Dragon"
- **Steps:** Observe the dragon → Find a quiet path → Remove noisy armor → Tiptoe past
- **Distractors:** "Shout at dragon" (wrong), "Run straight through" (impulsive)
- **Teaching:** Patience and observation before action

#### Level 6: "Build a Bridge Across the Gorge"
- **Steps:** Measure the gap → Gather long logs → Lay logs across → Tie with rope → Test with a rock
- **Distractors:** "Jump across" (impulsive)
- **Teaching:** Measurement/testing before committing

#### Level 7: "Decode the Ancient Map"
- **Steps:** Clean the map → Find the legend/key → Match symbols → Mark the path → Follow the path
- **Distractors:** "Guess a random direction" (impulsive), "Tear the map" (destructive)
- **Teaching:** Information gathering before action

#### Level 8: "Escape the Maze"
- **Steps:** Mark your starting point → Follow the left wall → Mark dead ends → Backtrack to marks → Find the exit
- **Distractors:** "Run randomly" (impulsive), "Break through walls" (brute force), "Close your eyes and walk"
- **Teaching:** Systematic strategy vs random guessing

#### Level 9: "Retrieve the Gem from the Trapped Room"
- **Steps:** Scan for traps → Disable floor pressure plate → Reach the pedestal → Swap gem with sand bag → Exit carefully
- **Distractors:** "Grab and run" (impulsive), "Ignore the traps" (reckless), "Throw a rock at it"
- **Teaching:** Risk assessment and careful planning

#### Level 10: "Escape the Collapsing Temple"
- **Steps:** Grab the treasure → Shield yourself from debris → Dodge falling rocks → Swing across the gap → Slide under closing gate → Sprint to the exit
- **Distractors:** "Go back for more treasure" (greed), "Stop and rest" (wrong priority), "Fight the rocks"
- **Teaching:** Prioritization under complex conditions, parallel awareness
- **Special:** Some steps can be reordered (multiple valid solutions)

---

### 8. UI / Screens

#### 8.1 Home Screen
- Game logo and character animation
- Buttons: **Play**, **Vault**, **Character**, **Settings**
- Bright, inviting design

#### 8.2 Level Select (Map View)
- Visual treasure map with level markers
- Each marker shows: level number, star rating (0-3), lock/unlock state
- Completed levels show their treasure icon
- Revealed story map pieces visible in background

#### 8.3 Gameplay Screen — Planning Phase
- **Top:** Challenge title and description
- **Middle:** Draggable step cards in a shuffled pool
- **Bottom:** Plan slots where cards are dropped in order
- **Sidebar:** Discard zone for distractor cards
- **Buttons:** "Think About It" (hint), "Plan Review" (check), "Lock In Plan" (submit)

#### 8.4 Gameplay Screen — Execution Phase
- Animated scene showing the character executing each step
- Step list on side with checkmarks/X marks as they execute
- Failure point highlighted with explanation

#### 8.5 Result Screen
- Stars earned (animated)
- Treasure unlocked (reveal animation)
- Character gear earned (if applicable)
- Story map piece revealed
- Buttons: "Next Level", "Retry", "Back to Map"

#### 8.6 Treasure Vault
- Grid display of all collected treasures
- Locked silhouettes for uncollected items
- Tap a treasure to see its name and which level it came from

#### 8.7 Character Screen
- Full character avatar with equipped gear
- List of all earned gear items
- Badges display

---

### 9. Visual & Audio Design

#### Art Style
- **Bright, colorful, cartoonish** — appealing to 8-10 year olds
- Hand-drawn/illustrated feel
- Warm color palette: golds, greens, browns (adventure/treasure theme)
- Large, readable fonts

#### Audio
- **Background music:** Cheerful adventure theme, different per level zone
- **Sound effects:**
  - Card drag: soft whoosh
  - Card drop: satisfying click
  - Plan lock-in: dramatic drumroll
  - Step success: cheerful chime
  - Step failure: gentle "uh-oh" sound (not punishing)
  - Level complete: triumphant fanfare
  - Treasure reveal: sparkle/magical sound

---

### 10. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| **Framework** | React 18+ | State management for Plan/Execute/Reflect phases |
| **Styling** | Tailwind CSS | Rapid responsive/mobile-first design |
| **Drag & Drop** | @dnd-kit/core | Touch-friendly, accessible, built for React |
| **Animations** | Framer Motion | Smooth execution animations, transitions |
| **Build Tool** | Vite | Fast development, HMR, optimized builds |
| **PWA** | vite-plugin-pwa | Installable, offline support, app-like experience |
| **State** | Zustand | Lightweight global state (game progress, scores) |
| **Storage** | localStorage | Save game progress, no backend needed |

#### Mobile-App Experience Features
- Full-screen mode (no browser chrome)
- Touch-first design — drag & drop optimized for fingers
- Portrait-optimized layout
- No scrolling — fixed screen layouts
- Installable via PWA (Add to Home Screen)
- Offline-capable
- Splash screen on launch
- App icon

---

### 11. Project Structure (Planned)

```
treasure-quest/
├── public/
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── screens/        # HomeScreen, LevelSelect, Gameplay, Results, Vault, Character
│   │   ├── game/           # StepCard, PlanSlot, ExecutionAnimation, ReflectPanel
│   │   └── ui/             # Button, StarRating, Badge, Modal, Header
│   ├── data/
│   │   └── levels.js       # All level definitions (challenge, steps, distractors, rewards)
│   ├── store/
│   │   └── gameStore.js    # Zustand store — progress, scores, inventory
│   ├── hooks/
│   │   └── useGameLogic.js # Plan validation, scoring, timing
│   ├── utils/
│   │   └── scoring.js      # Star calculation, badge checks, anti-impulse logic
│   ├── App.jsx
│   └── main.jsx
├── GAME_DESIGN.md          # This document
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

---

### 12. MVP Scope (Phase 1)

For the first buildable version:

- [ ] Home screen with Play button
- [ ] Level select screen (levels 1-3 unlocked)
- [ ] Planning phase with drag-and-drop step cards
- [ ] Basic execution animation (step-by-step with success/fail)
- [ ] Reflect screen with retry option
- [ ] Star scoring (1-3 stars)
- [ ] 3 complete levels with content
- [ ] Local storage for progress
- [ ] Mobile-responsive, touch-friendly
- [ ] PWA installable

### Phase 2 (Post-MVP)
- [ ] Levels 4-10
- [ ] Treasure vault
- [ ] Character upgrades
- [ ] Story map unlocks
- [ ] "Think About It" hint system
- [ ] "Plan Review" pre-submit check
- [ ] Anti-impulse soft gate (5-second check)
- [ ] Badges system
- [ ] Sound effects and music
- [ ] Execution phase animations (illustrated scenes)

---

### 13. Success Metrics

- Kids spend more time in **Planning phase** than average (not rushing)
- First-attempt success rate increases as kids progress (learning transfer)
- High usage of "Think About It" and "Plan Review" tools
- Kids voluntarily replay levels to earn 3 stars
- Parents/teachers report improved decomposition thinking in other contexts
