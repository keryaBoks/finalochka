const Router = require('express')
const router = new Router()
const userController = require('../controllers/userContoller')
const authMiddleware = require('../middleware/authMiddleware')



router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.get('/auth', authMiddleware, userController.check)
// router.get('/activate/:link', userController.activate);
router.post('/forgot', userController.forgetPassword)
router.post('/reset',userController.resetPassword)
module.exports = router 