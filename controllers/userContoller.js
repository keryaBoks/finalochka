const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const { User, Basket } = require('../models/models')
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const mailService = require('./mailContoller')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id: id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' })
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            next(ApiError.badRequest(`Пользователь с таким email:  ${email} уже существует`))
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await User.create({ email, password: hashPassword, role })
        const basket = await Basket.create({ userId: user.id })
        const token = generateJwt(user.id, user.email, user.role)
        // await mailService.sendActivationMail(email, activationLink)
        return res.json({ token })
    }

    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
           return  next(ApiError.iternal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.iternal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res) {
        res.json('qeqwe')
    }
}

module.exports = new UserController()