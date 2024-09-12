import { API } from "./api.js";
import { Helper } from "../utils/helper.js";
import chalk from 'chalk';

export class GeneralAPI extends API {
  constructor(major) {
    super();
    this.account = major.account;
    this.token = major.token;
    this.base_url = major.base_url;
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

  async checkIn() {
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🔃 Daily Check In'));  
        const data = await this.fetch(
          `${this.base_url}/user-visits/visit/`,
          "POST",
          this.token
        );

        if(data.is_increased){
          Helper.logAction('INFO', this.getFullName(), this.getLogCyan('🎉 Succesfully Daily CheckIn'));  
          await this.logSleepDelay()
        }else{
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow('⚠️ Already Daily CheckIn'));  
          await this.logSleep();
        }
        resolve();
      } catch (err) {
        reject(`(POST: /user-visits/visit): ${err}`);
      }
    });
  }

  async getProfile(is_msg = false) {
    const fullName = Helper.getAccountName(this.account.first_name, this.account.last_name)
    return new Promise(async (resolve, reject) => {
      if(is_msg){
        Helper.logAction('INFO', fullName, this.getLogCyan('🔃 Fetch Profile'));  
      }
      try {
        await this.fetch(
          `${this.base_url}/users/${this.account.id}/`,
          "GET",
          this.token
        );

        if(is_msg){
          Helper.logAction('INFO', fullName, this.getLogCyan('🎉 Succesfully Get Profile'));  
          await this.logSleep();
        }
        
        resolve();
      } catch (err) {
        reject(`(GET:/users/${this.account.id}/): ${err}`);
      }
    });
  }

  async getStreak() {
    return new Promise(async (resolve, reject) => {
      try {
        await Helper.delay(this.default_delay, this.account, `Fetch Streak`, this);
        await this.fetch(
          `${this.base_url}/user-visits/streak/`,
          "GET",
          this.token
        );
        await Helper.delay(this.default_delay, this.account, `Succesfully Get Streak`, this);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}