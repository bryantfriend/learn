# Student study space

Published route: `/learn/students/`. The student portal is separate from the teacher player and does not import its session storage, local lesson edits, teacher notes or exam modules.

## Included

- All 296 published lessons are represented: 271 teaching/starter lessons and 25 assessment revision guides.
- Filters for 7A, 7B, 8th Grade, subject and quarter; title/topic search; favorites and a review list.
- Notes and classroom diagrams, recall cards, multiple-choice explanations and open-response model answers. Partner work includes guidance for studying alone.
- A personal notebook, printable study notes, text downloads, confidence and reviewed status, and a continue-studying link.
- English, Russian, Simplified Chinese and Turkish. Interface translations are authored separately. Study prose is machine translated locally with Argos/OpenNMT models via CTranslate2; an English comparison toggle is provided. Diagram labels retain their classroom English wording, with translated explanations alongside.
- WhatsApp links to +996 550 346 970 with the current lesson title. Opening a link does not send a message.

## Data and updates

Progress and personal notes live only in `learn.student.v1` in the student's browser. No account or server database is used. Teacher session data and student progress use different keys. Download personal notes to move them to another device.

Student materials are generated from the published source lessons. The teacher text editor's **local browser overrides do not publish themselves** to students or other devices. To update public study content, update the source lessons and rebuild the student catalog before deployment.

`node scripts/build-students.mjs` generates the safe catalog and source-string inventory. `node scripts/build-student-visuals.cjs` captures static classroom SVGs. The latter uses the existing browser-test dependency via `PLAYWRIGHT_MODULE`. Assessment guides draw practice only from teaching lessons, not examination papers or teacher keys.

`students/locales/*.json` contains the bundled translations. `scripts/translate-students.py` documents the local generation pipeline. Temporary model/runtime downloads belong in ignored `output/`, never in the deployment. Updating source text requires regenerating and reviewing the translations; coverage tests flag missing entries. Source model index: https://github.com/argosopentech/argospm-index ; inference engine: https://opennmt.net/CTranslate2/ .

## Verification

- `npm test`: source coverage, assessment separation, safe diagrams, interface parity and translation completeness.
- `npm run test:students`: interactive student workflow, persisted notes, practice feedback, all four languages, mobile layout and WhatsApp destination. Does not send a WhatsApp message.
- `npm run test:students:catalog`: all 296 reading/practice pages plus unavailable storage behavior.
- The existing teacher browser suite remains the regression check for classroom playback.

Translation maintenance: install `ctranslate2` and `sentencepiece` into `output/translation-runtime` using Python 3.12 pip with `--target`. Download the official Argos English→Russian 1.9, English→Chinese 1.9 and English→Turkish 1.5 archives from the linked index, naming them `en_ru-1_9.zip`, `en_zh-1_9.zip`, and `en_tr-1_5.zip` inside `output/translation-models`. Run the translation script with that Python runtime, followed by `npm run audit:student-translations`. The audit applies reviewed terminology, preserves maths/measurement answers and course codes, and writes review reports to `output/`. A reported numerical difference can be a normal change in number ordering or local decimal/month formatting; review the text rather than treating the count alone as an error.
