import { API } from "./api.js";
import { Helper } from "../utils/helper.js";
import { SETTINGS, getPuzzleCode } from "../config/settings.js";
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

  getLogGreen(message){
    return `${chalk.green(message)}`
  }

  async getBonusCoin() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.fetch(
          `${this.base_url}/bonuses/coins/`,
          "GET",
          this.token
        );

        this.is_play_bonus_coin = false
        resolve();
      } catch (err) {
        this.is_play_bonus_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('⚠️ Already Get Bonus Coin')}`, 'INFO');
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
        Helper.logAction('INFO', this.getFullName(), this.getLogGreen(`🪙 Claimed Coin: ${coins_value}`));
        
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
        const data = await this.fetch(
          `${this.base_url}/roulette/`,
          "POST",
          this.token
        );
        resolve({
          is_play: true,
          reward: data.rating_award,
        });
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('⚠️ Already Play Roulette')}`, 'INFO');
          resolve({
            is_play: false
          });
        }

        reject(`(POST: /roulette): ${err}`);
      }
    });
  }

  async getSwapCoin() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.fetch(
          `${this.base_url}/swipe_coin/`,
          "GET",
          this.token
        );

        this.is_play_swipe_coin = false
        resolve();
      } catch (err) {
        this.is_play_swipe_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('⚠️ Already Play Swipe Coin')}`, 'INFO');
          resolve();
        }

        reject(`(GET: /swipe_coin): ${err}`);
      }
    });
  }

  async playSwapCoin(coins_value) {
    return new Promise(async (resolve, reject) => {
      try {
        await Helper.delaySimple(3000, this.getFullName(), `${this.getLogCyan('🎲 Start Play Swipe')}`, 'INFO');
        await this.fetch(
          `${this.base_url}/swipe_coin/`,
          "POST",
          this.token,
          {
            coins: coins_value
          }
        );

        this.is_play_swipe_coin = false
        Helper.logAction('INFO', this.getFullName(), this.getLogGreen(`🪙 Claimed Coin: ${coins_value}`)); 
        await this.logSleepDelay()
        resolve();
      } catch (err) {
        this.is_play_swipe_coin = true
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('⚠️ Already Play Swipe Coin')}`, 'INFO');
          resolve();
        }

        reject(`(POST: /swipe_coin): ${err}`);
      }
    });
  }

  async playDurovPuzzle(puzzle_code) {

    let code = puzzle_code.code

    const payload = {
        choice_1: code[0],
        choice_2: code[1],
        choice_3: code[2],
        choice_4: code[3]
    };

    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.fetch(
          `${this.base_url}/durov/`,
          "POST",
          this.token,
          payload
        );

        if(data.correct){
          const reward = 5000
          resolve({
            is_play: true,
            reward: reward
          });
        }
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          await Helper.delaySimple(3000, this.getFullName(), `${chalk.yellow('⚠️ Already Claimed Puzzle')}`, 'INFO');
          resolve({
            is_play: false
          });
        }

        reject(`(POST: /durov): ${err}`);
      }
    });
  }
}