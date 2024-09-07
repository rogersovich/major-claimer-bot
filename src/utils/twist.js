import { Twisters } from "twisters";
import logger from "./logger.js";
import { Major } from "../bot/major.js";
import { Helper } from "./helper.js";

class Twist {
  constructor() {
    /** @type  {Twisters}*/
    this.twisters = new Twisters();
  }

  log(msg = "", acc = "", major = new Major(), delay) {
    if (delay == undefined) {
      logger.info(`${acc.id} - ${msg}`);
      delay = "-";
    }
    
    this.twisters.put(acc.id, {
      text: `
  ================= Account ${acc.id} =============
  Name          : ${acc.first_name} ${acc.last_name}
  Rating        : ${acc.rating}
  Total Task    : ${major.total_uncomplete_task ?? 0}

  Status        : ${msg}
  Delay         : ${delay}
  ==============================================`,
    });
  }
  /**
   * @param {string} msg
   */
  info(msg = "") {
    this.twisters.put(2, {
      text: `
  ==============================================
  Info          : ${msg}
  ==============================================`,
    });
    return;
  }

  clearInfo() {
    this.twisters.remove(2);
  }

  clear(acc) {
    this.twisters.remove(acc);
  }
}

export default new Twist();
