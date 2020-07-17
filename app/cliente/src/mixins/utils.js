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
      const res = this.toMilSeparator(val)
      return (res ? res + ' Gs.' : null)
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
        date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0')
      )
    },
    toEdad (val) {
      const date = new Date(val)
      const now = new Date()
      let years = now.getUTCFullYear() - date.getUTCFullYear()
      let months = now.getUTCMonth() - date.getUTCMonth()
      const days = now.getUTCDate() - date.getUTCDate()

      if (days < 0) months--
      if (months < 0) years--
      months += years * 12 + (months < 0 && 12)

      return years < 2 ? months + ' Meses' : years + ' Años'
    }
  }
}
