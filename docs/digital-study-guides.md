# Digital study guides

Open https://bryantfriend.github.io/learn/study-guides/ or choose **Digital study guides** on the classroom home screen. The student library also links to the guides and preserves its selected language.

Five self-contained guides are available in English, Russian, Turkish and Simplified Chinese. Every language includes the explanations, labelled infographics, complete classroom sources, model answers and explained self-checks. Students can answer aloud; no copying, printing or account is required.

| Guide | Coverage |
| --- | --- |
| 7A Geography | Map title/key, eight compass points and reverse directions, measuring with a ruler, scale calculations and routes, natural and human-made features and their interactions |
| 7B Geography | Four UK countries/capitals, Great Britain/UK/Ireland distinctions, weather measurements versus climate, snow and blizzards, equal treatment of polar vortex and tornado |
| 7A Global Perspectives | Book 8 Research Lesson 2, pp. 8–12: methods with reasons, whole-text title/main idea, notes, two-sentence summary per paragraph, feedback and evaluation reflection |
| 7B Global Perspectives | Book 7 Research Lesson 2, pp. 7–12: methods, main idea, notes and whole-text summary, feedback, difficulties and next steps |
| Grade 8 Global Perspectives | Book 9 Research Lesson 2, pp. 8–12, photographed 19 October: predictions, evidence, causes/consequences, national/global perspectives, proposed action, one-feature summary and communication reflection |

The GP source passages are the original fictional teacher-created classroom texts, reproduced completely. They remain clearly distinguished from real findings. The guides preserve uncertainty, scope and the different class tasks. Model answers can be opened after students think independently. The five-sentence 7B model is an example, not an invented compulsory word limit. The 7A models contain two sentences per paragraph. Grade 8's model selects the proposed-action feature.

## Visuals and interaction

There are 33 infographic designs: SVG maps, landscape/feature diagrams, compass, worked ruler, route, weather, snow and vortex illustrations, alongside labelled research flows and evidence/feedback comparison cards. Shared designs recur where helpful. Labels are native translated text, so they remain selectable and avoid fixed English labels in images. Diagrams enlarge in a dialog; wide illustrations scroll inside their frame on phones. The map provides separate keyboard-accessible country and layer buttons. Natural Earth map geometry is public domain; country and weather references are listed in the guide.

The scale slider calculates actual metres from the stated example scale; screen size never determines an answer. Country buttons show the correct capital. Quiz explanations remain concealed until requested. Progress consists only of understood-section IDs and an optional English-term display preference, stored locally in the browser. It is shared across languages for the same guide and can be cleared separately per guide. It is not an assessment result or teacher report.

## Maintaining

`study-guides/data/en.js` defines the content structure. `ru.js`, `tr.js`, and `zh.js` contain manually authored complete translations. `locale.js` validates the parallel interface and label arrays; topic diagram identifiers and correct option positions come from the shared structure. `extra.js` contains translated worked method justifications and weather/climate diagram labels. Review answer meanings as well as array positions when revising translated quizzes. Do not substitute automatic English fallback for missing material.

The hub is a standalone static ES-module page; no build, remote image service, fonts, translation API or private workbook photographs are required. Direct links accept `?guide=geo7a&lang=ru`, with guide IDs `geo7a`, `geo7b`, `gp7a`, `gp7b`, `gp8` and languages `en`, `ru`, `tr`, `zh`. Section hash links work in each guide.

Run `node --test tests/study-guides.test.js` and `node tests/study-guides-browser.cjs` (set `PLAYWRIGHT_MODULE` if needed). These checks compare English source passages to the current classroom exports, verify all translations and infographic identifiers, exercise all 20 versions at desktop/board/mobile sizes, answer every self-check, and check language switching, map capitals, scale, local progress, English-term display, and enlargement. Screenshots are saved under `output/playwright/study-guides/` for visual inspection.
