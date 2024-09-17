const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
  "name": {
    "type": "String"
  },
  "description": {
    "type": "String"
  },
  "traingGround": {
    "type": "String"
  },
  "gold": {
    "type": "Number"
  },
  "x": {
    "type": "Number"
  },
  "y": {
    "type": "Number"
  },
  "hp": {
    "type": "Number"
  },
  "mp": {
    "type": "Number"
  },
  "agi": {
    "type": "Number"
  },
  "vel": {
    "type": "Number"
  },
  "str": {
    "type": "Number"
  },
  "def": {
    "type": "Number"
  },
  "atkrange": {
    "type": "Number"
  },
  "sprite": {
    "type": "String"
  },
  "moved": {
    "type": "Boolean"
  },
  "playerIndex": {
    "type": "Number"
  },
  "bonus": {
    "commoner": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "advocate": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "halberdier": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "knight": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "assasin": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "ranger": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "pavwill": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "mage": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "nun": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "warlock": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "druid": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    },
    "kira": {
      "str": {
        "type": "Number"
      },
      "def": {
        "type": "Number"
      }
    }
  },
  "skills": {
    "type": [
      "Mixed"
    ]
  },
  "status": {
    "type": "Array"
  }
});

const model = mongoose.model('Character', modelSchema);

module.exports = model;