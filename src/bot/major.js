import { API } from "../api/api.js";
import { Helper } from "../utils/helper.js";

export class Major extends API {
  constructor(acc, query, queryObj, proxy) {
    super(proxy);
    
    this.token = null
    this.account = acc;
    this.query = query
    this.total_uncomplete_task = 0
    this.is_play_bonus_coin = false
    this.is_play_swipe_coin = false
    this.base_url = 'https://major.glados.app/api'
    this.default_delay = 1000
    this.full_name = null
  }

  async login() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, '(START)(POST) Doing Login...');  
        const data = await this.fetch(
          `${this.base_url}/auth/tg/`,
          "POST",
          null,
          {
            init_data: this.query
          }
        );

        this.token = data.access_token

        Helper.logAction('INFO', this.account.id, '(END)(POST) Succesfully Login...');  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        reject(`(POST: /auth/tg): ${err}...`);
      }
    });
  }

}
