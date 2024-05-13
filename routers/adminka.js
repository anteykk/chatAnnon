let {Router} = require(`express`);

let router = Router();

router.get(`/`, function (req,res){
  res.render(`admin`, {
    title: `Админка добавления чатов`,
    error: req.flash(`errors`),
    success: req.flash(`success`)
  })
})

module.exports = router;