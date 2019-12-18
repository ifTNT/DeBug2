const assert = require('assert');

module.exports = {
    hash: function() {
      var h = 0, i, chr;
      if (this.length === 0) return h;
      for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        h  = ((h << 5) - h) + chr;
        h |= 0; // Convert to 32bit integer
      }
      return h;
    },
    getPersonalBoardID: function(userID){
        return this.hash(userID);
    }
}