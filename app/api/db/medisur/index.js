const modules = {
  contratos: require('./contratos'),
  asegurados: require('./asegurados'),
  pagos: require('./pagos'),
  eventos: require('./eventos'),
  planes: require('./planes')
}

function getRoomData (room) {
  return modules[room].getRoomData()
}

function include ( inc ){
  for (const key in modules){
    modules[key].include && modules[key].include(inc)
  }
}

module.exports = {
  ...modules,
  include,
  getRoomData,
  nsp: '/medisur'
}
