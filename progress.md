Original prompt: Create Coastal Connections, a classroom transport-network game inspired by the approved concept art, in 7B Geography Lesson 2.

Build a road/ferry/flight network, animate vehicles carrying destination-shaped passengers, and offer a ferry-cancellation challenge. Keep the activity within this lesson while its design is being reviewed.

Implemented the canvas network game, local standalone preview, and lesson modal. Road routes stay on the same land; ferries connect ports; flights connect airports. Vehicles carry up to three passengers with graph-based transfers, pause/resume, undo/reset, speed control, and a ferry-cancellation challenge. Network state survives closing and reopening the lesson modal.

Verified with the bundled web-game client, pure simulation tests and focused browser checks: drag/click/keyboard connections, invalid routes, duplicate routes, passenger transfers, all five deliveries, ferry challenge, pause/resume, undo/reset/speed, mobile width/input, lesson launch and dialog close/resume. Reviewed gameplay, lesson modal and mobile screenshots. All 85 unit tests pass. Controls are always visible below the map on classroom screens. Space toggles play/pause; F toggles fullscreen.

Future optional refinements: richer terrain art and additional destination stations. These are not required for the approved first mission.

User review checkpoint: 7B Geography Lesson 2 Sections 1–3 approved. Part 4 has the transport game and new illustrations for Steps 3–4. Continue reviewing Part 4, then Sections 5–8. Keep changes limited to this prototype until the user approves applying the design to other lessons. Version 2.6.2 saves this checkpoint to GitHub; teacher/student exports have not been regenerated during the prototype review.
