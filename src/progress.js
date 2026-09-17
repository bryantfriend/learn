export function frameKey(stage, step) { return stage + ':' + step; }
export function responseKeyFor(lesson, stage, step) {
    const frame = lesson.stages[stage].frames[step];
    return frameKey(stage, frame.responseIndex === undefined ? step : frame.responseIndex);
}
export function summarizeSession(session, lesson, now = Date.now()) {
    const completedStages = lesson.stages.filter(function(stage, stageIndex) {
        return stage.frames.every(function(frame, step) {
            if (!session.seenFrames[frameKey(stageIndex, step)]) return false;
            if (frame.type !== 'question') return true;
            const result = session.responses[responseKeyFor(lesson, stageIndex, step)];
            return Boolean(result && result.revealed);
        });
    }).length;
    const validIds = new Set(lesson.stages.flatMap(function(stage) {
        return stage.frames.map(function(frame) { return frame.discussionId; }).filter(Boolean);
    }));
    return {
        lessonTitle: lesson.title,
        completedStages,
        totalStages: lesson.stages.length,
        questionsDiscussed: new Set(session.discussedQuestions.filter(function(id) { return validIds.has(id); })).size,
        stars: session.preferences.starsVisible ? session.stars : null,
        elapsedMs: Math.max(0, (session.finishedAt || now) - session.startedAt)
    };
}
