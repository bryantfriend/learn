// Original SVG pictures for movable evidence cards; labels remain readable.
const drawings={
 hill:'<path d="M8 76L52 16L106 76Z" fill="#96b67d"/><path d="M41 31L52 16L67 35L53 29Z" fill="#fff"/>',
 water:'<path d="M8 28Q25 12 42 28T76 28T110 28M8 48Q25 32 42 48T76 48T110 48M8 68Q25 52 42 68T76 68T110 68" fill="none" stroke="#3e94b5" stroke-width="7"/>',
 rain:'<path d="M20 35Q6 14 31 14Q45-5 60 14Q91 3 92 35Z" fill="#c3dce8"/><path d="M30 45L20 65M55 45L45 65M80 45L70 65" stroke="#3e94b5" stroke-width="5"/>',
 ice:'<path d="M10 73L37 13L65 25L99 72Z" fill="#b0dcec"/><path d="M24 68L74 68M52 38L63 51L48 60" stroke="#317a93" stroke-width="4" fill="none"/>',
 bridge:'<path d="M3 64H117" stroke="#6fb2cc" stroke-width="12"/><path d="M10 40H110M20 40V65M100 40V65M20 40Q60-3 100 40" stroke="#9f7650" stroke-width="6" fill="none"/>',
 house:'<path d="M23 40H96V82H23Z" fill="#e3bb7c"/><path d="M12 42L60 7L107 42Z" fill="#ba7959"/><path d="M48 82V54H69V82" fill="#faf6de"/>',
 tree:'<path d="M60 46V85" stroke="#916e46" stroke-width="10"/><circle cx="60" cy="28" r="25" fill="#8cbf83"/><circle cx="40" cy="46" r="23" fill="#8cbf83"/><circle cx="79" cy="46" r="23" fill="#8cbf83"/>',
 route:'<path d="M15 76H85V22H45" stroke="#c48d4b" stroke-width="9" fill="none"/><path d="M60 10L44 22L60 34" stroke="#c48d4b" stroke-width="5" fill="none"/>',
 compass:'<circle cx="60" cy="49" r="35" fill="#fff" stroke="#859d93"/><path d="M60 16L73 51L60 44L47 51Z" fill="#b55c41"/><text x="53" y="12" font-size="15">N</text>',
 ruler:'<rect x="7" y="30" width="108" height="32" rx="4" fill="#ebcd76"/><path d="M20 30V47M35 30V40M50 30V47M65 30V40M80 30V47M95 30V40" stroke="#705c35" stroke-width="2"/>',
 map:'<path d="M8 20L40 8L78 20L110 8V72L78 84L40 72L8 84Z" fill="#d6e7bc" stroke="#729080"/><path d="M40 8V72M78 20V84" stroke="#729080"/><path d="M15 63Q55 5 96 53" stroke="#649fbe" stroke-width="5" fill="none"/>',
 people:'<circle cx="38" cy="20" r="12" fill="#ce976b"/><circle cx="82" cy="20" r="12" fill="#c18a69"/><path d="M19 75V48Q38 25 57 48V75M63 75V48Q82 25 101 48V75" fill="#79b2a2"/>',
 rock:'<path d="M10 74L22 42L50 32L70 49L64 80Z" fill="#9b9e91"/><path d="M68 65L80 48L102 57L111 80H74Z" fill="#b2aa91"/><path d="M20 18H94M85 10L98 18L85 26" stroke="#418fa7" stroke-width="4" fill="none"/>',
 chart:'<path d="M13 6V80H111" fill="none" stroke="#588475" stroke-width="3"/><path d="M33 77V55M61 77V24M89 77V40" stroke="#80b6a2" stroke-width="17"/>',
 message:'<rect x="12" y="15" width="96" height="56" rx="12" fill="#e8dca9"/><path d="M35 69L24 84L60 69M28 32H92M28 48H75" stroke="#887746" stroke-width="3" fill="none"/>'
};
export function cardArt(label){
 const rules=[[/rain|precipitation|cloud|vapour/i,'rain'],[/ice|glacier|snow|melt/i,'ice'],[/bridge|crossing/i,'bridge'],[/tree|wood|forest/i,'tree'],[/hill|ridge|mountain|slope|corrie|arête/i,'hill'],[/river|stream|sea|water|flood|channel/i,'water'],[/rock|debris|sediment|sand|pebble|scrape/i,'rock'],[/house|home|building|shop|station|library|museum|factory/i,'house'],[/north|south|east|west|°/i,'compass'],[/cm|scale|measure|metres|length|dimension/i,'ruler'],[/route|path|road|turn|ramp|stairs/i,'route'],[/people|pupil|visitor|traveller|worker/i,'people'],[/count|number|income|total|percent/i,'chart'],[/map|key|grid|atlas|plan/i,'map']];
 const kind=rules.find(([pattern])=>pattern.test(label))?.[1]||'message';
 return `<svg viewBox="0 0 120 92" aria-hidden="true"><g>${drawings[kind]}</g></svg>`;
}
