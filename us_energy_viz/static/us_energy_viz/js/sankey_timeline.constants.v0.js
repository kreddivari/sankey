/**
 * @file Provides global constant variables for the application.
 */
const SCALE = .02;
const SPEED = 200;
const HSR3 = Math.sqrt(3) / 2;
const SR3 = Math.sqrt(3);
const BLEED = .5;
const WIDTH = $('.contentarea').width();// 1200;
const HEIGHT = 620;// WIDTH * 2 / 4;
const ELEC_BOX = [350, 120];
const ELEC_GAP = 19;
const LEFT_X = 10;
const TOP_Y = 100;
const LEFT_GAP = 30;
const PATH_GAP = 20;
const RIGHT_GAP = LEFT_GAP * 2.1;
const BOX_WIDTH = 120;

/**
 * @type {Object[]} 
 * @description An array of fuel objects.
 * @property {string} fuel - Name of fuel source as it appears in sankey_timeline.data.*.js.
 * @property {string} color - Hex value used to set the color for each band of the diagram.
 * @property {string} name - Fuel name formatted for diagram labels.
 */
const FUELS = [
  {fuel: 'elec', color: '#e49942', name: 'Electricity' },
  {fuel: 'solar', color: '#fed530', name: 'Solar' },
  {fuel: 'nuclear', color: '#ca0813', name: 'Nuclear' },
  {fuel: 'hydro', color: '#0b24fb', name: 'Hydro' },
  {fuel: 'wind', color: '#901d8f', name: 'Wind' },
  {fuel: 'geo', color: '#905a1c', name: 'Geothermal' },
  {fuel: 'gas', color: '#4cabf2', name: 'Natural gas' },
  {fuel: 'coal', color: '#000000', name: 'Coal' },
  {fuel: 'bio', color: '#46be48', name: 'Biomass' },
  {fuel: 'petro', color: '#095f0b', name: 'Petroleum' }
];
const BOX_GREY = '#cccccc';
/**
 * @type {Object[]} 
 * @description An array of box objects.
 * @property {string} box - Name of box as it appears in sankey_timeline.data.*.js.
 * @property {string} color - Hex value used to set the color for each box.
 * @property {string} name - Box name formatted for diagram labels.
 */
const BOXES = [
  { box: 'elec', color: BOX_GREY, name: 'Electricity' },
  { box: 'res', color: BOX_GREY, name: 'Residential/Commercial' },
  // { box: 'comm', color: BOX_GREY, name: 'Commercial' },
  { box: 'ag', color: BOX_GREY, name: 'Agricultural' },
  { box: 'indus', color: BOX_GREY, name: 'Industrial' },
  { box: 'trans', color: BOX_GREY, name: 'Transportation' }
];
const FUEL_NAMES = FUELS.map(d => d.fuel);
const BOX_NAMES = BOXES.map(d => d.box);
const FLOW_ORDER = {
  ups: {
    origin: ['petro', 'res'],
    right: [],
    left: []
  },
  downs: {
    origin: ['elec', 'trans'],
    right: [
      ['elec', 'indus'],
      ['elec', 'ag'],
      ['elec', 'res'],
      ['elec', 'indus'],
    ],
    left: [
      ['hydro', 'indus'],
      ['wind', 'ag'],
      ['gas', 'indus'],
      ['gas', 'trans'],
      ['coal', 'indus'],
      ['coal', 'trans'],
      ['petro', 'trans'],
    ]
  }
};