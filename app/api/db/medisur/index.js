const modules = {
  contratos: require('./contratos'),
  asegurados: require('./asegurados'),
  pagos: require('./pagos'),
  eventos: require('./eventos'),
  prestaciones: require('./prestaciones'),
  planes: require('./planes')
}

function include ( inc ){
  for (const key in modules){
    modules[key].include && modules[key].include(inc)
  }
}

module.exports = {
  ...modules,
  include,
  subscribe: modules.contratos.subscribe,
  // getRoomData,
  nsp: '/medisur'
}
