export default {
  methods: {
    rankFormat(num) {
      if (num < 20 && num > 10) {
        return num.toString() + "th"
      }
      else if (num.slice(-1) == 1) { return num.toString() + "st" }
      else if (num.slice(-1) == 2) { return num.toString() + "nd" }
      else if (num.slice(-1) == 3) { return num.toString() + "rd" }
      else { return num.toString() + "th" }
    },
    nFormatter(num, digits) {
      let si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" }
      ];
      let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
  }
}
