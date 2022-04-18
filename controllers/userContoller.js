const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const { User, Basket,ResetPassword } = require('../models/models')
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const mailService = require('./mailContoller')
const UserDto = require('../dtos/user-dto')
const nodemailer = require('nodemailer')
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: '0.0.0.0',
    port: 1025
})

// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD
//     }
// })

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id: id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' })
}

class UserController {
    // async registration(req, res, next) {
    //     const { email, password, role } = req.body;
    //     if (!email || !password) {
    //         return next(ApiError.badRequers('Некорректный email или password'))
    //     }
    //     const candidate = await User.findOne({ where: { email } })
    //     if (candidate) {
    //         return next(ApiError.badRequers('Пользователей с таким email уже существует'))
    //     }
    //     const hashPassword = await bcrypt.hash(password, 5)
    //     const user = await User.create({ email, role, password: hashPassword })
    //     const basket = await Basket.create({ userId: user.id })
       
    //     const token = generateJwt(user.id, user.email, user.role)
    //     return res.json({ token })
    
    async registration(req, res, next) {
        const { email, password, role } = req.body
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            next(ApiError.badRequest(`Пользователь с таким email:  ${email} уже существует`))
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await User.create({ email, password: hashPassword, role,activationLink })
        const basket = await Basket.create({ userId: user.id })

        // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        // const userDto = new UserDto(user)
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({ token })
    }
    

    // async activate(activationLink) {
    //     const user = await User.findOne({activationLink})
    //     if (!user) {
    //         throw ApiError.badRequest('Неккоректная ссылка активации')
    //     }
    //     user.isActivated = true;
    //     await user.save();
    // }

    async forgetPassword(req,res){
          const email = req.body.email
          const token = Math.random().toString(20).substr(2,12);
          const passwordReset = new ResetPassword({
              email,
              token
          })

          await passwordReset.save()
          const url = `http://localhost:5001/${token}`;

          await transporter.sendMail({
              from: 'kirilldanchenko1@gmail.com',
              to:email,
              subject:'reset',
              html: `Click <a href="${url}">here</a> to reset your password`

          })
          res.send({
              message:'check your email'
          })
    }

    async resetPassword(req,res){
        if(req.body.password !== req.body.password_confirm){
            return res.status(400).send({
                message:'Passwords do not mathc'
            })
        }

        const passwordReset = await ResetPassword.findOne({where:{token:req.body.token}});
        const {email} = await passwordReset.toJSON();
        const user = await User.findOne({where:{email}});
        
        if(!user){
                return res.status(404).send({
                    message: 'User not found'
                })
        }

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(req.body.password, salt);
        user.save();

        res.send({
            message:'success'
        })
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
        const token = generateJwt(req.user.id, req.user.email, req.user.role )
        return res.json({token})
    }
}

module.exports = new UserController()