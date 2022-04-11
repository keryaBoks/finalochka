const Router = require('express')
const router = new Router()
const deviceContoller = require('../controllers/deviceController')

router.post('/',deviceContoller.create)
router.get('/',deviceContoller.getAll)
router.get('/:id',deviceContoller.getOne)

module.exports = router 