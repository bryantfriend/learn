# Digital study guides

## Permanent class sites and QR codes

Each class has its own direct GitHub Pages address and colour theme. Open [the QR cards](https://bryantfriend.github.io/learn/study-guides/qr/) to print the five labelled cards or download individual PNG codes. Codes are generated locally, have a four-module quiet zone and point directly to the class site; no QR service or account is needed.

| Class | Direct site |
| --- | --- |
| 7A Global Perspectives | https://bryantfriend.github.io/learn/study-guides/7a-global-perspectives/ |
| 7B Global Perspectives | https://bryantfriend.github.io/learn/study-guides/7b-global-perspectives/ |
| Grade 8 Global Perspectives | https://bryantfriend.github.io/learn/study-guides/8-global-perspectives/ |
| 7A Geography | https://bryantfriend.github.io/learn/study-guides/7a-geography/ |
| 7B Geography | https://bryantfriend.github.io/learn/study-guides/7b-geography/ |

Regenerate entry pages and QR codes with `scripts/build-class-study-sites.py` using the bundled Python runtime (ReportLab and Pillow). Verify direct links with `node tests/class-study-sites-browser.cjs` alongside the existing guide checks. Earlier query links remain supported.

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

Each guide displays **exactly five illustrated infographics**, with a five-image overview and individual enlargement. There are 25 distinct generated illustrations in total. **7A Geography is map skills; 7B Geography is UK geography and weather.** Their section lists and poster selections are separate and tested independently.

| Guide | Five infographics |
| --- | --- |
| 7A Geography | Map and key; compass/directions; ruler; scale/routes; natural and human-made features |
| 7B Geography | Countries/capitals; Great Britain versus UK/Ireland; weather instruments; snow/blizzards; polar vortex versus tornado |
| 7A GP | Three justified methods; whole-text main idea/title; paragraph notes; two sentences per paragraph; evaluation/revision |
| 7B GP | Focused neutral question; observation versus asking; main idea; paragraph notes; whole-text summary/revision |
| Grade 8 GP | Prediction versus evidence; appropriate methods; causes/consequences/action; four distinct imagined perspectives; one-feature action summary |

Artwork was generated with the built-in OpenAI image generator. Files are in `study-guides/assets/illustrated/`; `prompts.json` records the final prompt per image and `revisions.json` records targeted corrections. Artwork was inspected for subject accuracy, country membership, ground contact of tornadoes, source scope and class-specific summary structure. Images are visual teaching examples, not research findings or architectural photographs. All teaching labels, captions and model responses are native translated text alongside the art, with number callouts connecting them. WebP delivery preserves the full generated dimensions while reducing the complete set from about 70 MB to about 11 MB. Original PNG copies remain in local `output/study-guide-art-originals/` and the image generator's output folder.

Precise SVG practice maps, the eight-point compass, a worked ruler and the scale calculator accompany the relevant illustrated posters. The selectable UK map uses public-domain Natural Earth geometry. Their exact values and geometry remain independent of illustrative artwork. Wide practice diagrams scroll within their frames on phones; the illustrations and captions resize to the screen.

The scale slider calculates actual metres from the stated example scale; screen size never determines an answer. Country buttons show the correct capital. Quiz explanations remain concealed until requested. Progress consists only of understood-section IDs and an optional English-term display preference, stored locally in the browser. It is shared across languages for the same guide and can be cleared separately per guide. It is not an assessment result or teacher report.

## Maintaining

`study-guides/data/en.js` defines the content structure. `ru.js`, `tr.js`, and `zh.js` contain manually authored complete translations. `locale.js` validates the parallel interface and label arrays; topic diagram identifiers and correct option positions come from the shared structure. `extra.js` contains translated worked method justifications and weather/climate diagram labels. `illustrated-infographics.js` defines the five-poster selection per guide; `data/poster-copy.js` supplies its additional translated captions. Review answer meanings as well as array positions when revising translated quizzes. Do not substitute automatic English fallback for missing material.

The hub is a standalone static ES-module page; no build, remote image service, fonts, translation API or private workbook photographs are required. Direct links accept `?guide=geo7a&lang=ru`, with guide IDs `geo7a`, `geo7b`, `gp7a`, `gp7b`, `gp8` and languages `en`, `ru`, `tr`, `zh`. Section hash links work in each guide.

Run `node --test tests/study-guides.test.js` and `node tests/study-guides-browser.cjs` (set `PLAYWRIGHT_MODULE` if needed). These checks compare English source passages to the current classroom exports, verify all translations and infographic identifiers, exercise all 20 versions at desktop/board/mobile sizes, answer every self-check, and check language switching, map capitals, scale, local progress, English-term display, and enlargement. Screenshots are saved under `output/playwright/study-guides-v2/` for visual inspection.
