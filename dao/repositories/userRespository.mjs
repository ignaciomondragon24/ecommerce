import { UserModel } from "../models/userModel.mjs";

export class UserRepository {
    async findById(id) {
        return await UserModel.findById(id);
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async create(user) {
        return await UserModel.create(user);
    }

    async update(id, user) {
        return await UserModel.findByIdAndUpdate (id, user, { new: true });   
    }
}