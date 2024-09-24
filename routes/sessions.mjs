import { Router } from "express";
import { UserModel } from "../dao/models/userModel.mjs"; 

const app = Router();

app.get('/getSession', (req, res) => {
    res.json({ session: req.session });
})

app.post('/register', async (req ,res) => {
    const { nombre, apellido, email, edad, password } = req.body;

    try{
        await UserModel.create({
            nombre,
            apellido,
            email,
            edad,
            password
        })

        res.status(201).json({ message: 'usuario creado' });
    } catch(e){
        res.status(500).json({message: 'Error al crear el recurso'});
    }
   
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await UserModel.findOne({ email, password}).lean(); // aca busca, si encuentra devuelve el obejto sino un null
        if(!user) return res.status(404).json({message: 'ingreso mal el mail o contraseña'});
        if(!req.session.isLog){
            req.session.isLog = true;
            req.session.user = {
                nombre: user.nombre,
                apellido: user.apellido,
                edad: user.edad
            };
        }
        res.json({ message: 'logueado' });
    }catch (e){
        console.log(e)
        res.status(500).json({message: 'error al loguearse'})
    }

})

export default app;