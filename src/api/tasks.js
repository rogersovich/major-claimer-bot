import { API } from "./api.js";
import { Helper } from "../utils/helper.js";
import chalk from 'chalk';

export class TasksAPI extends API {
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

  async getTask(is_daily) {
    const fullName = Helper.getAccountName(this.account.first_name, this.account.last_name)
    return new Promise(async (resolve, reject) => {
      try {
        Helper.logAction('INFO', this.getFullName(), this.getLogCyan(`🔃 Fetch Task ${is_daily ? "Daily" : ""}`));
        const data = await this.fetch(
          `${this.base_url}/tasks?is_daily=${is_daily}`,
          "GET",
          this.token
        );
        Helper.logAction('INFO', fullName, this.getLogCyan(`🎉 Succesfully Get Task ${is_daily ? "Daily" : ""}`));  
        await this.logSleep()
        resolve(data);
      } catch (err) {
        reject(`(GET: /tasks?is_daily=${is_daily}): ${err}...`);
      }
    });
  }

  async doingTask(task_id, title, award) {
    const fullName = Helper.getAccountName(this.account.first_name, this.account.last_name)
    return new Promise(async (resolve, reject) => {
      try {
        await Helper.delaySimple(5000, this.getFullName(), `${this.getLogCyan(`⌛ Start Task - ${title}`)}`, 'INFO');
        await this.fetch(
          `${this.base_url}/tasks/`,
          "POST",
          this.token,
          {
            task_id: task_id
          }
        );

        Helper.logAction('INFO', fullName, this.getLogCyan(`🎉 Succesfully Task Completed (${title}) - Reward coins ${award}`));  
        await this.logSleep()
        resolve();
      } catch (err) {
        const checkCode400 = err.message.includes("400")

        if(checkCode400){
          Helper.logAction('INFO', this.getFullName(), this.getLogYellow(`⚠️  Already Doing Task - ${title}`)); 
          resolve();
        }

        reject(`(POST: /tasks/): ${err}...`);
      }
    });
  }
}