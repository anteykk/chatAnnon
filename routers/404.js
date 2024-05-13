module.exports = function (req,res){
  res.render(`error`, {
    title: `Страница не найдена`
  })
}