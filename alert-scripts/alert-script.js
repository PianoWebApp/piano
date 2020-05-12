const messageCode = process.argv[2];
const printSuccess = function (text) {
    console.log(`\x1b[32;1m${text}\x1b[0m`);
}
const messages = {
    'pusk-success': printSuccess(' СКРИПТ УСПЕШНО ЗАКОНЧИЛ СВОЮ РАБОТУ '),
}