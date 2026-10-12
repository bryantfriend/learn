# Geography course model — 12 October 2026

The school geography exhibit lesson is now the model for all 86 teaching and review lessons. Each topic has an explicit starter question, a plain learning goal, three specific success criteria and vocabulary linked to concrete examples. The 42 topic methods are authored in `src/lessons/geography-course-methods.js`.

Worked examples show their complete evidence. Students then apply the method to a different case and create an appropriate product: a map, record, calculation, diagram, explanation or justified decision. They compare and revise their work before sharing. The ten-minute practice block replaces the former ten-question finger-voting block. Review lessons retain their distinct repair, evidence-hearing and counterexample formats.

Checks use a supplied new case and conceal the model until revealed. Exit tickets require an independent response. Generic discussion footers and automatic homework have been removed. The original eight section budgets still total 40 minutes; timings are estimates.

Exact grid, coordinate, contour, height-profile and oxbow diagrams supplement the painted artwork. Numerical sources are visible beside the task; unrelated default lab figures are not offered as teaching evidence. Actual UK maps and useful optional map challenges remain available. The ten assessments use neutral paper-and-pencil artwork and preserve independent conditions.

The teacher guide and Geography study entries have been regenerated. Other subjects’ study entries remain intact. Existing translated study aids have been refreshed, including corrections for several numerical patterns. A content revision resets obsolete Geography lesson checkpoints while retaining class preferences.

The detailed audit is in `docs/geography-course-model-audit.json`. Run `node scripts/audit-geography-course-model.mjs`, `npm test` and `node tests/geography-course-model-browser.cjs`. Classroom previews are saved under `output/playwright/course-model/previews/`.

## Earlier screen design — 6 October 2026

All 86 teaching and review lessons for 7A and 7B now use the approved eight-section flow. The ten assessments use the same ivory, navy and teal screen style with their preparation, independent assessment and reflection structure.

| Section | Minutes |
|---|---:|
| Starter and recall | 4 |
| Today’s learning goal | 2 |
| Key vocabulary | 3 |
| Teacher explanation | 8 |
| Worked example | 5 |
| Student practice | 10 |
| Check understanding | 5 |
| Exit ticket and wrap-up | 3 |

Topic-specific explanations, mission sources, exact diagram values, map tools, board activities and teacher scripts remain available. Combined lessons divide the section budget between their topics. Review lessons retain their distinct repair tasks. The eight section timings total 40 minutes; they remain planning estimates.

7A practice allows independent work before comparison. 7B includes oral rehearsal and sentence support before an individual response. Exercise books, pencils and rulers can be used for practice; the board workspace remains available. This replaces the six-section route described in the earlier teacher-led document.

The screen layout includes large serif section headings, visual and prompt panels, three vocabulary cards, success criteria, worked-example steps, practice support and challenge cards, concealed checkpoint explanations, takeaways and homework. Teaching aids are available through a disclosure so the main task remains prominent. Assessment answer keys remain separate.

Seven generated illustrations are stored in `assets/geography/`: map skills, settlements, glaciers, rivers, erosion, transportation and deposition. They are imagined teaching illustrations, not evidence of named places or exact measurements. Real geographic outlines and source-specific diagrams continue to use existing map and diagram code. The generation prompts are saved alongside the images.

The teacher guide and student notes are regenerated from the lesson data. A new lesson content revision restarts obsolete Geography checkpoints while retaining class preferences. Lesson IDs, source plans and assessment papers remain unchanged.

Run `npm test` and `node tests/geography-concepts-browser.cjs` to verify curriculum coverage, section budgets, local assets, answer reveals, classroom layouts and mobile width. Browser previews are saved under `output/playwright/geography-concepts/`.
