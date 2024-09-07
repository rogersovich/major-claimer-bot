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

  async checkIn() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, '(START)(POST) Daily CheckIn...');  
        const data = await this.fetch(
          `${this.base_url}/user-visits/visit/`,
          "POST",
          this.token
        );

        if(data.is_increased){
          Helper.logAction('INFO', this.account.id, '(END)(POST) Succesfully Daily CheckIn...');  
        }else{
          Helper.logAction('INFO', this.account.id, '(END)(POST) Already Daily CheckIn...');  
        }

        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        reject(`(POST: /user-visits/visit): ${err}...`);
      }
    });
  }

  async getProfile(is_msg = false) {
    return new Promise(async (resolve, reject) => {
      if(is_msg){
        Helper.logAction('INFO', this.account.id, '(START)(GET) Fetch Profile...');  
      }
      try {
        await this.fetch(
          `${this.base_url}/users/${this.account.id}/`,
          "GET",
          this.token
        );

        if(is_msg){
          Helper.logAction('INFO', this.account.id, '(END)(GET) Succesfully Get Profile...');  
          await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        }
        
        resolve();
      } catch (err) {
        reject(`(GET:/users/${this.account.id}/): ${err}...`);
      }
    });
  }

  async getStreak() {
    return new Promise(async (resolve, reject) => {
      try {
        await Helper.delay(this.default_delay, this.account, `Fetch Streak...`, this);
        await this.fetch(
          `${this.base_url}/user-visits/streak/`,
          "GET",
          this.token
        );
        await Helper.delay(this.default_delay, this.account, `Succesfully Get Streak...`, this);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  async getBonusCoin() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, '(START)(GET) Fetch Bonus Coin...'); 
        await this.fetch(
          `${this.base_url}/bonuses/coins/`,
          "GET",
          this.token
        );

        this.is_play_bonus_coin = false
        Helper.logAction('INFO', this.account.id, '(END)(GET) Starting Play Bonus Coin in 1 Minute...');  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        this.is_play_bonus_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.account.id, 'Already Get Bonus Coin...');  
          await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
          resolve();
        }

        reject(`(GET: /bonuses/coins): ${err}...`);
      }
    });
  }

  async playBonusCoins(coins_value) {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, `(START)(POST) Send Result Play Bonus Coin: ${coins_value}...`); 
        await this.fetch(
          `${this.base_url}/bonuses/coins/`,
          "POST",
          this.token,
          {
            coins: coins_value
          }
        );
        Helper.logAction('INFO', this.account.id, `(END)(POST) Succesfully Play Bonuses Coin: ${coins_value}...`);  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {

        reject(`(POST: /bonuses/coins): ${err}...`);
      }
    });
  }

  async playRoulette() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, '(START)(POST) Playing Roulette...'); 
        const data = await this.fetch(
          `${this.base_url}/roulette/`,
          "POST",
          this.token
        );
        Helper.logAction('INFO', this.account.id, `(END)(POST) Succesfully Play Roulette Coin: ${data.rating_award}...`);  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.account.id, 'Already Play Roulette...');  
          await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
          resolve();
        }

        reject(`(POST: /roulette): ${err}...`);
      }
    });
  }

  async getSwapCoin() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, '(START)(GET) Fetch Swipe Coin...'); 
        await this.fetch(
          `${this.base_url}/swipe_coin/`,
          "GET",
          this.token
        );

        this.is_play_swipe_coin = false
        Helper.logAction('INFO', this.account.id, `(END)(GET) Playing Swipe 1 Minute...`);  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        this.is_play_swipe_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.account.id, 'Already Play Swipe Coin...');  
          await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
          resolve();
        }

        reject(`(GET: /swipe_coin): ${err}...`);
      }
    });
  }

  async playSwapCoin(coins_value) {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, '(START)(POST) Playing Swipe Coin...'); 
        await this.fetch(
          `${this.base_url}/swipe_coin/`,
          "POST",
          this.token,
          {
            coins: coins_value
          }
        );

        this.is_play_swipe_coin = false
        Helper.logAction('INFO', this.account.id, `(END)(POST) Succesfully Play Swipe Coin: ${coins_value}...`);  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        this.is_play_swipe_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.account.id, 'Already Play Swipe Coin...');  
          await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
          resolve();
        }

        reject(`(POST: /swipe_coin): ${err}...`);
      }
    });
  }

  async getTask(is_daily) {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, `(START)(POST) Fetch Task ${is_daily ? "Daily" : ""}...`); 
        const data = await this.fetch(
          `${this.base_url}/tasks?is_daily=${is_daily}`,
          "GET",
          this.token
        );
        Helper.logAction('INFO', this.account.id, `(END)(POST) Succesfully Get Task ${is_daily ? "Daily" : ""}...`);  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve(data);
      } catch (err) {
        reject(`(GET: /tasks?is_daily=${is_daily}): ${err}...`);
      }
    });
  }

  async doingTask(task_id, title, award) {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.account.id, `(START)(POST) Post Task - ${title}...`);
        await Helper.delayLog(5000, this.account.id,  `Doing Task - ${title} in`, 'WARNING');
        await this.fetch(
          `${this.base_url}/tasks/`,
          "POST",
          this.token,
          {
            task_id: task_id
          }
        );

        Helper.logAction('INFO', this.account.id, `(END)(POST) uccesfully Task Completed (${title}) - Reward coins ${award}...`);  
        await Helper.delayLog(3000, this.account.id, 'Waiting next action in', 'WARNING');
        resolve();
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          await Helper.delay(this.default_delay, this.account, `Already Doing Task - ${title}...`, this);
          resolve();
        }

        reject(`(POST: /tasks/): ${err}...`);
      }
    });
  }
}
