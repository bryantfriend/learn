# ESL lesson update

Grade 8 Global Perspectives Lesson 3 (`g8-gp-1.2`) is now **One shirt, different views**. The curriculum objective is still comparing perspectives and recognising that people in the same group can disagree.

The 40-minute core route uses a vote, short role cards, a guessing game, a mistaken claim, a group decision with a surprise third choice, and two individual checks. Two different five-minute activities bring the full route to 50 minutes: interview a missing customer and draw two customers’ views. Pupils can point, use short phrases, read a sentence starter or explain to a partner in a familiar language first. No extra materials or student devices are needed.

All classroom lessons pass through `src/lessons/esl.js`. This rewrites common instructions, questions, options, explanations and visual text into simpler English. It keeps subject vocabulary, question keys, quantities, teacher notes and original curriculum records. The student study pages use the same text. Teacher edits are applied afterwards so saved custom wording is respected.

Validation: run `node --test --experimental-test-isolation=none tests/*.test.js` and `node tests/esl-browser.cjs` (set `PLAYWRIGHT_MODULE` to the installed Playwright package when needed). The browser check covers Lesson 3, other Grade 8/7 lessons, revealed answers, layout with the timer visible, and resuming after reload.
