import { Major } from "./src/bot/major.js";
import { proxyList } from "./src/config/proxy_list.js";
import { Telegram } from "./src/core/telegram.js";
import { Helper } from "./src/utils/helper.js";
import { GeneralAPI }  from  "./src/api/general.js"
import { GamesAPI }  from  "./src/api/games.js"
import { TasksAPI }  from  "./src/api/tasks.js"
import logger from "./src/utils/logger.js";
import chalk from 'chalk';
import { SETTINGS, getPuzzleCode } from "./src/config/settings.js";

// Access command-line arguments
const args = process.argv.slice(2); // Skip the first two arguments (node and script path)

// Define a variable to handle play mode
let playMode = false;

// Check if '--play' argument is passed
if (args.includes('--play')) {
    playMode = true;
    logger.info("Play mode activated");
} else {
    logger.info("Normal mode");
}

async function operation(acc, query, queryObj, proxy) {
  logger.clear();
  try {
    const fullName = Helper.getAccountName(acc.first_name, acc.last_name)
    Helper.logStartAccount(fullName, acc.id);
    
    const major = new Major(acc, query, queryObj, proxy);
    
    await Helper.delaySimple(4000, fullName, `${chalk.cyan('🤖 Starting Account')}`, 'INFO');
    
    await major.login()

    const generalAPI = new GeneralAPI(major)
    const gamesAPI = new GamesAPI(major)
    const tasksAPI = new TasksAPI(major)

    await generalAPI.checkIn()
    await generalAPI.getStreak()
    await generalAPI.getProfile(true)

    //* Bonus Coin
    await gamesAPI.getBonusCoin();
    
    //? if no yet play bonus coin
    if(!gamesAPI.is_play_bonus_coin){
      //? Play bonus coin
      await Helper.delaySimple(60000, fullName, `${chalk.cyan('🎲 Start Play Coin in 1 Minute')}`, 'INFO');
      const init_bonus = Math.floor(Math.random() * (900 - 800 + 1)) + 800;
      await gamesAPI.playBonusCoins(init_bonus);
    }

    //* Swap Coin
    await gamesAPI.getSwapCoin();

    //? if no yet play swipe coin
    if(!gamesAPI.is_play_swipe_coin){
      //? Play swipe coin
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
      const randomCoinValue = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200; // Get random value between 1200 - 1500
      await gamesAPI.playSwapCoin(randomCoinValue);
    }

    //* Roulette
    const roulette = await gamesAPI.playRoulette();
    if(roulette.is_play){
      await Helper.delaySimple(5000, fullName, `${chalk.cyan('🎲 Start Play Roulette')}`, 'INFO');
      Helper.logAction('INFO', fullName, chalk.green(`🪙 Claimed Coin: ${roulette.reward}`));  
    }

    //* Puzzle Durov
    const puzzle_code = getPuzzleCode()

    if(puzzle_code){
      const puzzleDurov = await gamesAPI.playDurovPuzzle(puzzle_code);
      if(puzzleDurov.is_play){
        Helper.logAction('INFO', fullName, chalk.cyan('🎲 Start Play Puzzle')); 
        Helper.logAction('INFO', fullName, chalk.green(`🪙 Claimed Coin: ${puzzleDurov.reward}`)); 
      }
    }

    //* Get Task - Not Daily
    const task = await tasksAPI.getTask(false)
    const uncompletedTask = task.filter((task) => task.type == 'without_check' || task.type == 'watch_youtube' || task.type == 'code');
    const total_uncomplete_task = uncompletedTask.length
    if(total_uncomplete_task != 0){
      Helper.logAction('INFO', fullName, `${chalk.cyan(`🃏 Total Task: ${total_uncomplete_task}`)}`);
    }

    if(uncompletedTask.length > 0){
      for (const task of uncompletedTask) {
        if(task.type != 'code'){
          await tasksAPI.doingTask(task.id, null, task.title, task.award);
        }else{
          const getCode = SETTINGS.youtube_code.find(item => item.title == task.title)
          await tasksAPI.doingTask(task.id, getCode.code, task.title, task.award);
        }
      }
    }

    //* Get Task - Daily
    const taskDaily = await tasksAPI.getTask(true)
    const uncompletedTaskDaily = taskDaily.filter((task) => 
      (task.type == 'without_check' || task.type == 'subscribe_channel') && task.is_completed == false
    );
    const total_uncomplete_task_daily = uncompletedTaskDaily.length
    if(total_uncomplete_task_daily != 0){
      Helper.logAction('INFO', fullName, `${chalk.cyan(`🃏 Total Task daily: ${total_uncomplete_task_daily}`)}`);
    }

    if(uncompletedTaskDaily.length > 0){
      for (const task of uncompletedTaskDaily) {
        if(task.type != 'code'){
          await tasksAPI.doingTask(task.id, null, task.title, task.award);
        }
      }
    }

    await generalAPI.getProfile();
    
  } catch (error) {
    const fullName = Helper.getAccountName(acc.first_name, acc.last_name)
    Helper.logAction('ERROR', fullName, `${chalk.red('🚫 '+ error)}`);
    if(error.includes('520')){
      await Helper.delaySimple(10000, fullName, `${chalk.yellow('🔃 Retrying in 10 seconds')}`, 'WARNING');
      await operation(acc, query, queryObj, proxy);
    }else{
      await Helper.delayLog(3000, fullName, `${chalk.red('🚫 Stopping Bot')}`, 'ERROR');
    }
    
  }
}

let init = false;
async function startBot(playMode) {
  return new Promise(async (resolve, reject) => {
    try {

      logger.info(`BOT STARTED`);

      const tele = await new Telegram();

      if(!playMode){
        if (init == false) {
          await tele.init();
          init = true;
        }
      }else{
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
      
      // waiting for nex action (2 hour)
      Helper.logAction('INFO', 'BOT', `${chalk.cyan('✅ All Account Processing Complete')}`);
      await Helper.delaySimple(2 * 60 * 60 * 1000, 'BOT', `${chalk.yellow('💤 Sleep in 2 hours')}`, 'INFO');

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

    await startBot(playMode);
  } catch (error) {
    console.error("Error in main process:", error);
    logger.info(`Application Error : ${error}`);
    throw error;
  }
})();
