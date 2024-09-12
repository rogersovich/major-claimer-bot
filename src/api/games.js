import { API } from "./api.js";
import { Helper } from "../utils/helper.js";
import { SETTINGS } from "../config/settings.js";
import chalk from 'chalk';

export class GamesAPI extends API {
  constructor(major) {
    super();
    this.account = major.account;
    this.token = major.token;
    this.base_url = major.base_url;
    this.is_play_bonus_coin = false
    this.is_play_swipe_coin = false
  }

  async logSleep(){
    await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('💤 Sleep for a second')}`, 'INFO');
  }

  async logSleepDelay(){
    const randomDelayShort = Helper.getRandomDelayShort()
    await Helper.delaySimple(randomDelayShort, this.getFullName(), `${chalk.yellow('💤 Sleep for a second')}`, 'INFO');
  }

  getFullName(){
    const fullName = Helper.getAccountName(this.account.first_name, this.account.last_name)

    return fullName
  }

  getLogCyan(message){
    return `${chalk.cyan(message)}`
  }

  getLogYellow(message){
    return `${chalk.yellow(message)}`
  }

  async getBonusCoin() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🔃 Fetch Bonus Coin')); 
        await this.fetch(
          `${this.base_url}/bonuses/coins/`,
          "GET",
          this.token
        );

        this.is_play_bonus_coin = false
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🎲 Start Play Coin in 1 Minute'));  
        await this.logSleep()
        resolve();
      } catch (err) {
        this.is_play_bonus_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow('⚠️  Already Get Bonus Coin'));  
          await this.logSleep()
          resolve();
        }

        reject(`(GET: /bonuses/coins): ${err}`);
      }
    });
  }

  async playBonusCoins(coins_value) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.fetch(
          `${this.base_url}/bonuses/coins/`,
          "POST",
          this.token,
          {
            coins: coins_value
          }
        );
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`🪙  Claimed Coin: ${coins_value}`));  
        await this.logSleepDelay()
        resolve();
      } catch (err) {

        reject(`(POST: /bonuses/coins): ${err}`);
      }
    });
  }

  async playRoulette() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🎲 Start Play Roulette')); 
        const data = await this.fetch(
          `${this.base_url}/roulette/`,
          "POST",
          this.token
        );
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`🪙  Claimed Coin: ${data.rating_award}`));  
        await this.logSleepDelay()
        resolve();
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow('⚠️  Already Play Roulette')); 
          await this.logSleep()
          resolve();
        }

        reject(`(POST: /roulette): ${err}`);
      }
    });
  }

  async getSwapCoin() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🔃 Fetch Swipe Coin')); 
        await this.fetch(
          `${this.base_url}/swipe_coin/`,
          "GET",
          this.token
        );

        this.is_play_swipe_coin = false
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`⌛ Waiting Swipe 1 Minute`));  
        await this.logSleep()
        resolve();
      } catch (err) {
        this.is_play_swipe_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow('⚠️  Already Play Swipe Coin')); 
          await this.logSleep()
          resolve();
        }

        reject(`(GET: /swipe_coin): ${err}`);
      }
    });
  }

  async playSwapCoin(coins_value) {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🎲 Start Play Swipe')); 
        await this.fetch(
          `${this.base_url}/swipe_coin/`,
          "POST",
          this.token,
          {
            coins: coins_value
          }
        );

        this.is_play_swipe_coin = false
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`🪙  Claimed Coin: ${coins_value}`)); 
        await this.logSleepDelay()
        resolve();
      } catch (err) {
        this.is_play_swipe_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow('⚠️  Already Play Swipe Coin')); 
          await this.logSleep()
          resolve();
        }

        reject(`(POST: /swipe_coin): ${err}`);
      }
    });
  }

  async playDurovPuzzle() {

    const puzzle_code = SETTINGS.puzzle_code
    const payload = {
        choice_1: puzzle_code[0],
        choice_2: puzzle_code[1],
        choice_3: puzzle_code[2],
        choice_4: puzzle_code[3]
    };

    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🎲 Start Play Puzzle')); 

        const data = await this.fetch(
          `${this.base_url}/durov/`,
          "POST",
          this.token,
          payload
        );

        if(data.correct){
          const price = 5000
          Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`🪙  Claimed Coin: ${price}`)); 
          resolve()
        }

        const detail = data.detail || {};
        const blockedUntil = detail.blocked_until;

        if (blockedUntil) {
          const blockedUntilTime = new Date(blockedUntil * 1000).toISOString().replace('T', ' ').substring(0, 19);
          Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`⌛ Puzzle blocked until: ${blockedUntilTime}`));  
        }
        
        await this.logSleepDelay()
        resolve();
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow('⚠️  Already Claimed Puzzle')); 
          await this.logSleep()
          resolve();
        }

        reject(`(POST: /durov): ${err}`);
      }
    });
  }
}