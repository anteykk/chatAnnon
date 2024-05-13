let {Router} = require(`express`);
let pSession = require(`../middleware/session`);

let router = Router();

//! Удаления текущей сессии пользователя
router.get(`/`, pSession, function (req,res){
  req.session.destroy(()=>{
    res.redirect(`/auth`);
  })
})

module.exports = router;