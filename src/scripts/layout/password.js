import '../../styles/password.scss';
import '../../styles/password.scss.liquid';


import 'lazysizes';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/respimg/ls.respimg'


///Look for modules in the script, much of the rest of the boilerplate is in modules!

Array.from(document.querySelectorAll('[data-module]')).forEach(el => {
  const name = el.getAttribute('data-module')
  const Module = require(`../modules/${name}`).default
  new Module(el)
})

