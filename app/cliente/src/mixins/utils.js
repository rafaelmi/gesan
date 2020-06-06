export default {
  methods: {
    toMilSeparator (val) {
      let res = val
      if (!Number.isNaN(val) && val) {
        res = (Math.round(val) + '.X')
          .replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.X', '')
      }
      return res
    },
    toMoney (val) {
      return (this.toMilSeparator(val) + ' Gs.')
    },
    toFacturaId (val) {
      const num = Number(val).toString().padStart(13, '0')
      return num.slice(0, 3) + '-' +
      num.slice(3, 6) + '-' +
      num.slice(-7)
    },
    toTimestamp (val) {
      const date = new Date(val)
      // return date.toLocaleDateString('es-PY') + ' ' + date.toLocaleTimeString('es-PY')
      return this.toDate(date) + ' ' + date.toLocaleTimeString('es-PY')
    },
    toDate (val) {
      const date = new Date(val)
      return (
        date.getUTCFullYear() + '-' +
        (date.getUTCMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getUTCDate().toString().padStart(2, '0')
      )
    }
  }
}
