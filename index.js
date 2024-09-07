import { Major } from "./src/bot/major.js";
import { proxyList } from "./src/config/proxy_list.js";
import { Telegram } from "./src/core/telegram.js";
import { Helper } from "./src/utils/helper.js";
import { GeneralAPI }  from  "./src/api/general.js"
import { GamesAPI }  from  "./src/api/games.js"
import { TasksAPI }  from  "./src/api/tasks.js"
import logger from "./src/utils/logger.js";

async function operation(acc, query, queryObj, proxy) {
  logger.clear();
  try {
    const fullName = Helper.getAccountName(acc.first_name, acc.last_name)
    Helper.logStartAccount(fullName, acc.id);
    
    const major = new Major(acc, query, queryObj, proxy);
    
    await Helper.delayLog(3000, major.account.id, 'Starting Bot in');
    
    await major.login()

    const generalAPI = new GeneralAPI(major)
    const gamesAPI = new GamesAPI(major)
    const tasksAPI = new TasksAPI(major)

    await generalAPI.checkIn()
    await generalAPI.getProfile(true)

    await gamesAPI.getBonusCoin();
    
    //? if no yet play bonus coin
    if(!gamesAPI.is_play_bonus_coin){
      //? Play bonus coin
      await playingBonusCoin(gamesAPI)
      await generalAPI.getProfile();
    }

    await gamesAPI.getSwapCoin();

    //? if no yet play swipe coin
    if(!gamesAPI.is_play_swipe_coin){
      //? Play swipe coin
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
      const randomCoinValue = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200; // Get random value between 1200 - 1500
      await gamesAPI.playSwapCoin(randomCoinValue);
      await generalAPI.getProfile();
    }

    await gamesAPI.playRoulette();
    await generalAPI.getProfile();


    //* Get Task
    const task = await tasksAPI.getTask(false)
    const uncompletedTask = task.filter((task) => task.type == 'without_check');
    gamesAPI.total_uncomplete_task = uncompletedTask.length

    if(uncompletedTask.length > 0){
      for (const task of uncompletedTask) {
        await tasksAPI.doingTask(task.id, task.title, task.award);
      }
      await generalAPI.getProfile();
    }
    
    // await Helper.delay(
    //   60000 * 10,
    //   major.account,
    //   "Account Processing Complete, Delaying for 10 minutes",
    //   major
    // );

    // await operation(acc, query, queryObj, proxy);
  } catch (error) {

    if(error.includes('520')){
      await Helper.delayLog(10000, acc.id, 'Retrying in ...');
      await operation(acc, query, queryObj, proxy);
    }else{
      Helper.logAction('ERROR', acc.id, '(API): '+ error);  
      await Helper.delayLog(3000, acc.id, 'Stopping Bot...');
    }
    
  }
}

async function playingBonusCoin(gamesAPI) {
  let init_bonus = 0;
  const timeout = 60000; // 1 minute
  const interval = 1000; // 1 second
  const stopIncrement = Math.floor(Math.random() * 6) + 40; // random value 40 - 45

  await new Promise((resolve) => {
    let secondsElapsed = 0;
    const intervalId = setInterval(() => {
      if (secondsElapsed < stopIncrement) {
        secondsElapsed += 1;
        init_bonus += secondsElapsed;
      }
    }, interval);

    setTimeout(() => {
      clearInterval(intervalId); // Stop incrementing after 1 minute
      resolve();
    }, timeout);
  });

  await gamesAPI.playBonusCoins(init_bonus);
}


let init = false;
async function startBot() {
  return new Promise(async (resolve, reject) => {
    try {

      logger.info(`BOT STARTED`);

      const tele = await new Telegram();
      if (init == false) {
        await tele.init();
        init = true;
      }

      const accountList = Helper.getSession("accounts");
      const paramList = [];

      if (proxyList.length > 0) {
        if (accountList.length != proxyList.length) {
          reject(
            `You have ${accountList.length} Session but you provide ${proxyList.length} Proxy`
          );
        }
      }

      for (const acc of accountList) {
        const accIdx = accountList.indexOf(acc);
        const proxy = proxyList.length > 0 ? proxyList[accIdx] : undefined;
        if (!acc.includes("query")) {
          await tele.useSession("accounts/" + acc, proxy);
          tele.session = acc;
          const user = await tele.client.getMe();
          const query = await tele
            .resolvePeer()
            .then(async () => {
              return await tele.initWebView();
            })
            .catch((err) => {
              throw err;
            });

          const queryObj = Helper.queryToJSON(query);
          await tele.disconnect();
          paramList.push([user, query, queryObj, proxy]);
        } else {
          // const text_account = Helper.readQueryFile("accounts/" + acc + "/query.txt");
          // const {token, tele_id} = Helper.parseAccountText(text_account);
          // const query = {
          //   token,
          //   tele_id
          // }

          // paramList.push([null, query, null, proxy]);

          const query = Helper.readQueryFile("accounts/" + acc + "/query.txt");
          const queryObj = Helper.queryToJSON(query);

          const user = queryObj.user;
          user.firstName = user.first_name;
          user.lastName = user.last_name;

          paramList.push([user, query, queryObj, proxy]);
        }
      }

      for (const params of paramList) {
        await operation(params[0], params[1], params[2], params[3]);
      }

      // const promiseList = paramList.map(async (data) => {
      //   await operation(data[0], data[1], data[2], data[3]);
      // });

      // await Promise.all(promiseList);

      // await Helper.delay(
      //   2 * 60 * 60 * 1000, // 2 hour
      //   null,
      //   "Account Processing Complete, Delaying for 2 Hour",
      //   null
      // );
      
      // waiting for nex action (2 hour)
      Helper.logAction('INFO', null, 'All Account Processing Complete...');
      await Helper.delayLog(2 * 60 * 60 * 1000, null, 'Waiting for nex action, Delaying in', 'INFO');

      for (const params of paramList) {
        await operation(params[0], params[1], params[2], params[3]);
      }

      resolve();
    } catch (error) {
      logger.info(`BOT STOPPED`);
      logger.error(JSON.stringify(error));
      reject(error);
    }
  });
}

(async () => {
  try {
    logger.info("");
    logger.clear();
    logger.info("Application Started");
    await startBot();
  } catch (error) {
    console.error("Error in main process:", error);
    logger.info(`Application Error : ${error}`);
    throw error;
  }
})();
