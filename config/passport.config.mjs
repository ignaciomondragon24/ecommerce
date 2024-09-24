import passport from "passport";
import local from 'passport-local'; // se basa en username y password
//import User from '../models/userModel.mjs';
import { createHash, isValidPassword } from "../utils/utils.mjs";

const localStrategy = local.Strategy;

const initPassport = () => {
    passport.use('register', new localStrategy({
        usernameField: 'email',
        passReqToCallback: true // quiere decir que el objeto req se podra pasar a otros mmiddleware
    }, async (req, username, password, done) => {
        try{
            const { nombre, apellido, email, edad } = req.body;

            const userFound = await UserModel.findOne({email: username });
            if(userFound) {
                console.log('Usuario ya registrado')
                done(null, false)
            }
    
            const newUser = {
                nombre,
                apellido,
                email,
                edad,
                password: createHash(password)
            }
    
            const user = await UserModel.create(newUser);
            return done(null, user)
        }catch (e){
            return done('Error en la bbdd')
        }

    }))

    passport.use('login', new localStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try{
            const userFound = await UserModel.findOne({email: username });
            if(!userFound) return done(null, false)
            if(!isValidPassword(userFound, password)) return done(null, false)
            
            return done(null, userFound)
            
        }catch (e){
            return done('Error en la bbdd')
        }

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id) // en la cookie/session va a enviar solamente el id
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user);
    })
}

export default initPassport;