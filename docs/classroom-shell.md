# Classroom shell — version 1.2.0

Choose class & lesson opens a native keyboard-accessible modal. Pick class, subject, and lesson, then start or resume. Escape/Close dismisses the picker without changing saved progress. The class chip in the lesson header pauses/saves the current session and opens the picker.

Supported classes: 7A, 7B, 8th Grade. Subjects: Geography and Global Perspectives. Both introductory lessons remain available as shared starters. Subject lesson spaces are intentionally empty until plans are supplied.

## Curriculum structure

Add complete lessons using the existing stages/frames format. Give each a stable unique id and register it in src/lessons.js. Subject lessons use catalog metadata with subjectId ('geography' or 'global-perspectives'), grades ([7], [8], or [7, 8]), unit (the plan's unit title), and order (the lesson sequence number).

Lists filter by grade and subject and sort by order. Unit labels appear on lesson cards. 7A and 7B share Grade 7 content with separate progress. Plans can provide lesson titles, units, sequence, timings and content without replacing the player.

## Saved progress

Schema 3 adds classId and subjectId. learn.sessions.v1 stores independent checkpoints by class + subject + lesson; learn.session.v1 remains the last active checkpoint. Saves include steps, responses, timer, optional stars, preferences, discussion markers and summary data.

Schema 1 and 2 sessions migrate to explicitly unassigned checkpoints. They remain resumable from home or the picker's earlier-session button and are never silently attributed to a class. Starting again or clearing affects only one checkpoint. Storage failures keep checkpoints in memory for the open page. Browser-only storage does not sync between devices. Use one teaching tab per board.

## Verification

Unit coverage includes all six contexts, curriculum filtering, checkpoint isolation, clear behavior, legacy migration, corrupt storage and storage denied. The classroom browser suite tests touch selection, all six contexts across reload, cancelled restart, isolated clearing, Escape, and picker bounds at 1920×1080, 1366×768, 1280×720 and 390×844. Both prior lesson browser suites still cover all existing teaching frames and controls.
