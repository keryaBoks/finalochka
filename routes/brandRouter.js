const Router = require('express')
const router = new Router()
const brandContoller = require('../controllers/brandController')

router.post('/',brandContoller.create)
router.get('/',brandContoller.getAll)

module.exports = router 