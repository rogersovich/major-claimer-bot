import { API } from "./api.js";
import { Helper } from "../utils/helper.js";

export class TasksAPI extends API {
  constructor(major) {
    super();
    this.account = major.account;
    this.token = major.token;
    this.base_url = major.base_url;
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