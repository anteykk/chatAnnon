let {body} = require(`express-validator`);


exports.regUser = [
  body(`login`, `Минимальная длинна логина 6 символов, макс 20`)
  .isLength({min: 6, max: 20}) // Минимальная и максимальная длинна содержимого
  .isAlphanumeric()
  .trim(), // Убераю пробелы
  body(`password`, `Пароль не содержит минимум 6 символов, или больше 60 символов`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim(),
  body(`resetPass`)
  .custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error(`Пароли должны совпадать`);
    }

    return true
  })
]

exports.authUser = [
  body(`login`, `Минимальная длинна логина 6 символов, макс 20`)
  .isLength({min: 6, max: 20}) // Минимальная и максимальная длинна содержимого
  .isAlphanumeric()
  .trim(), // Убераю пробелы
  body(`password`, `Пароль не содержит минимум 6 символов, или больше 60 символов`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim(),  
]

exports.create = [
  body(`chat`, `Минимальная длина названия 2 символа, макс 6`)
  .isLength({min: 2, max: 6})
  .isAlphanumeric()
  .trim()
]