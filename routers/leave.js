let {Router} = require(`express`);

let router = Router();

router.get(`/`, async (req,res)=>{
  res.redirect(`/`);
})

module.exports = router;