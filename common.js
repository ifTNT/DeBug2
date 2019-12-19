const assert = require('assert');

module.exports = {
    getPersonalBoardID: function(userID) {
      var h = 0, i, chr;
      if (userID.length === 0) return h;
      for (i = 0; i < userID.length; i++) {
        chr   = userID.charCodeAt(i);
        h  = ((h << 5) - h) + chr;
        h |= 0; // Convert to 32bit integer
      }
      return h;
    },
}