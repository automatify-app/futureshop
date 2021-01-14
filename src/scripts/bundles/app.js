import 'babel-polyfill';

import 'lazysizes';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'classlist-polyfill';

import Rellax from 'rellax';
import queryString from 'query-string';
import AlertDrawer from '../components/alert-drawer';

import debounce from 'lodash.debounce';
import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import { focusHash, bindInPageLinks } from '@shopify/theme-a11y';

import objectFitImages from 'object-fit-images';

//// Fancy Scrolling effects
import AOS from 'aos';
//Headroom
import Headroom from 'headroom.js';

import reframe from 'reframe.js/dist/reframe';

import SmoothScroll from 'smooth-scroll';

var site = new Theme();
