import { API } from "./api.js";
import { Helper } from "../utils/helper.js";

export class GeneralAPI extends API {
  constructor(major) {
    super();
    this.account = major.account;
    this.token = major.token;
    this.base_url = major.base_url;
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
}