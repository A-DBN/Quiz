#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

import { createRequire } from "module";
import { isNumber } from 'util';
const require = createRequire(import.meta.url)
const qlist = require("./questions.json")

let playerName;
let nb_questions = 0
let result = 0
let total = 0
let asked_questios = []

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    'Question for a Génépitek \n'
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue('HOW TO PLAY')} 
    I am a process on your computer.
    Select the good answer please
    So get all the questions right...
  `);
}

async function handleAnswer(isCorrect, answer) {
  const spinner = createSpinner('Checking answer...').start();
  await sleep();

  if (isCorrect) {
    spinner.success({ text: `Nice work ${playerName}. That's a legit answer` });
    result += 1
    total += 1
  } else {
    spinner.error({ text: `False, the answer was ${answer}` });
    total += 1
  }
}

function getindex() {
    const index = Math.floor(Math.random() * qlist.questions.length)
    if (asked_questios.includes(qlist.questions[index].question)) {
        return getindex()
    }
    return qlist.questions[index]

}

async function askName() {
  const answers = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Player';
    },
  });

  playerName = answers.player_name;
}

// async function askEnd() {
//   const answers = await inquirer.prompt({
//     name: 'end',
//     type: 'input',
//     message: 'Do you want to play again?',
//     default() {
//       return true;
//     }
//   })

//   if (answers.end === true) {
//       start()
//   } else {
//       console.log(`
//       ${chalk.bgBlue('GAME OVER')} 
//       Thanks for playing ${playerName}
//       `)
//       process.exit(0)
//   }
// }

async function askNumberQuestions() {
    const answers = await inquirer.prompt({
      name: 'nb_questions',
      type: 'input',
      message: 'How many questions do you want to answer?',
      default() {
        return 5;
      },
    });
    nb_questions = answers.nb_questions;
  }

async function winner() {
  console.clear();
  figlet(`Congrats , ${playerName} !\n Your score is ${result}/${total}`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + '\n');

    console.log(
      chalk.green(
        `Don't hesitate to contact me if you have any question or suggestion.\n`
      )
    );
  });
  process.exit(0)
}

async function question() {
    const question = getindex()
  const answers = await inquirer.prompt({
    name: 'question',
    type: 'list',
    message: question.question,
    choices: Object.values(question.answers),
  });
  asked_questios.push(question.question)
  return handleAnswer(answers.question === question.good_answer, question.good_answer);
}


async function start() {
  let data
  console.clear();
await welcome();
await askName();
await askNumberQuestions()
while (!Number.isSafeInteger(parseInt(nb_questions))) {
  console.log(chalk.red(`Please enter a number`))
  await askNumberQuestions()
}
while (parseInt(nb_questions) > qlist.questions.length) {
  console.log(chalk.red(`You can't ask more questions than the total of questions (max: ${qlist.questions.length})`))
  await askNumberQuestions()
}
while(total != nb_questions) {
    await question()
}
await winner();
}

start()