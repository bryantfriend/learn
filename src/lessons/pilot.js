import {commandLesson,mapLesson,waterLesson,networkLesson} from './pilot-geo.js';
import {headlineLesson,settingsLesson,surveyLesson,playgroundLesson} from './pilot-gp.js';
import {townHallLesson,cityLesson} from './pilot-civic.js';
export const pilotLessons={
 'g7a-geo-w11-1':c=>commandLesson(c,false),
 'g7a-geo-w12-1':c=>commandLesson(c,true),
 'g7a-geo-w25-1':c=>mapLesson(c,false),
 'g7a-geo-w29-1':c=>mapLesson(c,true),
 'g7a-gp-w10-2':c=>settingsLesson(c,false),
 'g7a-gp-w11-1':c=>settingsLesson(c,true),
 'g7a-gp-w12-1':headlineLesson,
 'g7b-geo-w12-1':c=>networkLesson(c,false),
 'g7b-geo-w12-2':c=>networkLesson(c,true),
 'g7b-geo-w25-2':waterLesson,
 'g7b-gp-w01-2':playgroundLesson,
 'g7b-gp-w04-3':c=>surveyLesson(c,false),
 'g7b-gp-w05-1':c=>surveyLesson(c,true),
 'g8-gp-4.6':townHallLesson,
 'g8-gp-6.6':cityLesson
};
