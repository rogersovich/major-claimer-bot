import { API } from "../api/api.js";
import { Helper } from "../utils/helper.js";
import chalk from 'chalk';

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

  async logSleep(){
    await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('💤 Sleep for a second')}`, 'INFO');
  }

  getFullName(){
    const fullName = Helper.getAccountName(this.account.first_name, this.account.last_name)

    return fullName
  }

  async login() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), `${chalk.cyan('🔒 Start Login')}`);  
        const data = await this.fetch(
          `${this.base_url}/auth/tg/`,
          "POST",
          null,
          {
            init_data: this.query
          }
        );

        this.token = data.access_token

        Helper.logAction('INFO', this.getFullName(), `${chalk.cyan('🎉 Succesfully Login')}`);  
        await this.logSleep()
        resolve();
      } catch (err) {
        reject(`(POST: /auth/tg): ${err}`);
      }
    });
  }

}
