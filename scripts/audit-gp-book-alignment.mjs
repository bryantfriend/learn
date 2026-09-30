import fs from 'node:fs';
import { lessons } from '../src/lessons.js';

// Class-to-book assignments confirmed by the teacher on 25 September 2026.
// This is an inventory of work still required, not a textbook crosswalk.
const assignments = [
  { classId: '7b', classLabel: '7B', book: 7, isbn: '9781108790512', edition: 1, publicationYear: 2020, editionConfirmedBy: 'Teacher' },
  { classId: '7a', classLabel: '7A', book: 8, isbn: null, edition: null, publicationYear: null, editionConfirmedBy: null },
  { classId: '8', classLabel: '8th Grade', book: 9, isbn: null, edition: null, publicationYear: null, editionConfirmedBy: null },
];
const gp = lessons.filter(lesson => lesson.catalog?.subjectId === 'global-perspectives');
const inventory = assignments.map(assignment => ({
  ...assignment,
  title: `Cambridge Lower Secondary Global Perspectives Learner's Skills Book ${assignment.book}`,
  author: 'Keely Laycock',
  editionStatus: assignment.editionConfirmedBy
    ? 'First edition (2020) and ISBN confirmed by the teacher. Activity-page verification is still required.'
    : 'First edition suggested by cover; physical ISBN and pagination need confirmation.',
  lessons: gp.filter(lesson => lesson.catalog.classes?.includes(assignment.classId)
    || (assignment.classId === '8' && lesson.catalog.grades.includes(8))).map(lesson => ({
    id: lesson.id,
    currentTitle: lesson.title,
    order: lesson.catalog.order,
    quarter: lesson.catalog.quarter,
    type: lesson.examId ? 'assessment' : 'teaching',
    assessmentId: lesson.examId || null,
    targetBook: assignment.book,
    printedPages: null,
    printedActivity: null,
    status: lesson.examId ? 'Review after teaching sequence is rebuilt' : 'Requires book activity and page verification',
  })),
}));

if (new Set(inventory.flatMap(group => group.lessons.map(lesson => lesson.id))).size !== gp.length) {
  throw new Error('The inventory must cover every Global Perspectives curriculum lesson exactly once.');
}

const escape = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# Global Perspectives textbook alignment audit',
  '',
  'Prepared 25 September 2026. **Status: audited; lesson redesign is not yet complete.**',
  '',
  'The teacher requires every Global Perspectives teaching lesson to use the activities in the students’ physical books, with printed page references wherever applicable. Adding a related page to the existing invented activity does not satisfy this requirement.',
  '',
  '## Confirmed class assignments',
  '',
  '| Class | Learner’s Skills Book | Current teaching sessions | Current assessments |',
  '| --- | --- | ---: | ---: |',
  ...inventory.map(group => `| ${group.classLabel} | ${group.book} | ${group.lessons.filter(lesson => lesson.type === 'teaching').length} | ${group.lessons.filter(lesson => lesson.type === 'assessment').length} |`),
  '',
  'All three books are by Keely Laycock. Book numbers are not the app’s school grade labels: 8th Grade uses Book 9. These assignments supersede the stage assumptions in the earlier plans.',
  '',
  '**7B edition confirmed by the teacher:** first edition (2020), ISBN **9781108790512**. The book’s identity is established; this does not yet verify the page and activity assigned to each lesson. The editions for 7A and 8th Grade remain unconfirmed.',
  '',
  '## Findings',
  '',
  '- The app contains 198 GP curriculum sessions: 183 teaching/review sessions and 15 assessments.',
  '- The existing 7B plan and lesson notes explicitly use Stage 6 objectives, although this class uses Book 7.',
  '- The existing 8th Grade plan uses Stage 8 objectives, although this class uses Book 9.',
  '- The existing implementation supplies original scenarios and source cards in place of unavailable book tasks. This is documented in `docs/grade7a-course.md` and `docs/grade7b-course.md` and implemented in the GP content modules.',
  '- The covers identify the book series and levels. They do not show the ISBN, contents, printed page numbers or exercise instructions.',
  '- Public search results mix first-edition materials, draft samples and second-edition materials. Their pagination cannot safely be treated as interchangeable.',
  '- No complete textbook PDF or scan is present in this workspace. No lesson-to-page correspondence has been verified against the teacher’s copies.',
  '',
  '## Source material needed to finish',
  '',
  'Full PDFs or readable scans of the three books will allow every activity and printed page reference to be checked. For 7B, use ISBN 9781108790512 only; no further edition confirmation is needed. Obtain its contents and activity pages. For 7A and 8th Grade, also obtain the copyright/ISBN details to establish the exact editions. Contents pages establish lesson starting pages, but the activity pages are also needed to redesign the teaching and identify required sources, questions, writing spaces and multi-session tasks.',
  '',
  'Research leads, not approved classroom references:',
  '',
  '- [Cambridge’s 2020 catalogue](https://www.cambridge.org/ni/files/5615/7165/4630/CAM_International_Primary_Catalogue_20_Digital_HR.pdf) lists first-edition learner-book ISBNs 9781108790512 (7), 9781108790543 (8) and 9781108790567 (9). The teacher has confirmed the Book 7 ISBN; Book 8 and Book 9 still need confirmation.',
  '- A public first-edition Book 7 review copy and a Book 8 transcription were found, but the former is marked as a review copy and the latter contains OCR errors. They are insufficient to certify the whole-course crosswalk.',
  '- A Book 8 draft sample has different research-lesson pagination from the published-book transcription. Draft page numbers must not be imported.',
  '- The accessible official Book 9 excerpt is the newer edition (ISBN 9781009316163); it must not be used to assign page numbers to the red book without checking its edition.',
  '',
  '## Redesign contract',
  '',
  '1. Use the confirmed edition and the printed page number, not the PDF viewer’s page count. Record the evidence used to verify each page.',
  '2. Build the sequence from the book’s actual skills lessons and activities. Retain an old topic only when it supports the activity students are completing on those pages.',
  '3. Specify the book, skill section, printed lesson/activity label, page or page range, expected written product, and the exact point at which students write in their books.',
  '4. Supply any teacher text, data, question set or other material the book activity requires. Distinguish original supporting material from material printed in the book.',
  '5. Teach through a short starter, model, substantial book task, feedback/revision, and reflection. Use accessible English and keep the existing teacher-operated classroom controls.',
  '6. Split longer book lessons across class sessions when needed. Each part must name its own activity and page references; do not imply an entire multi-page lesson fits one period.',
  '7. Rebuild weekly/year plans and the student revision catalogue from the same verified mapping. Show book/page references in lesson selection and on the teaching screen.',
  '8. Review each baseline and term assessment against the revised taught sequence. Standalone assessments and shared classroom routines may have an explicit no-book-task reason rather than an invented page number.',
  '9. Keep a crosswalk from old lesson IDs to replacements. Reset saved stages/responses when the underlying activity changes, and prevent old browser edits from restoring the superseded content.',
  '10. Check every teaching session for a verified book activity, classroom materials and visible page reference. Run course consistency and browser navigation checks, including student revision pages. Leave Geography outside this redesign.',
  '',
  '## Current-session inventory',
  '',
  'Every row below requires review. An em dash means **not yet verified**, not “no page needed.” Current titles identify the lessons being replaced; they do not claim correspondence with any textbook section. The two shared classroom starter lessons are outside the 198 curriculum-session count and can remain explicitly labelled as routines without a book task.',
  '',
];
for (const group of inventory) {
  lines.push(`### ${group.classLabel} → Book ${group.book}`, '',
    '| Order | Quarter | Current lesson ID | Current title | Type | Verified page/activity |',
    '| ---: | --- | --- | --- | --- | --- |',
    ...group.lessons.map(lesson => `| ${lesson.order} | ${lesson.quarter} | ${lesson.id} | ${escape(lesson.currentTitle)} | ${lesson.type} | — |`), '');
}
fs.writeFileSync('docs/gp-book-alignment-audit.md', lines.join('\n'));
fs.writeFileSync('docs/gp-book-alignment-inventory.json', JSON.stringify(inventory, null, 2) + '\n');
console.log(`Audited ${gp.length} GP sessions across ${inventory.length} confirmed class/book assignments. No unverified page numbers were assigned.`);
