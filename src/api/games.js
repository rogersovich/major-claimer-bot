import { API } from "./api.js";
import { Helper } from "../utils/helper.js";

export class GamesAPI extends API {
  constructor(major) {
    super();
    this.account = major.account;
    this.token = major.token;
    this.base_url = major.base_url;
    this.is_play_bonus_coin = false
    this.is_play_swipe_coin = false
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
}