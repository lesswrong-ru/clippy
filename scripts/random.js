const quotes = [
  'Подбросил монетку и выпало',
  'Заглянул в хрустальный шар и увидел число:',
  'Пересчитал ворон, получилось', 
  'Бросил кубик, выпало',
  'Измерил случайную величину линейкой, и она равна', 
  'Оценил свою степень уверенности в случайности выдаваемых мною чисел равной'
];

randomInteger = (min, max) => {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

module.exports = robot => {
  robot.respond(/random\s*([\d]*)/, (res) => {
    const range = parseInt(res.match[1]);
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    if(range) {
      res.reply(`${quote} ${randomInteger(1, range)}`);
    } else {
      res.reply(`${quote} ${Math.random()}`);
    }
  });
};
