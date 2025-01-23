const mongoose = require('mongoose');
const connectDB = require('../utils/mongoose');
const User = require('../models/User');

class MakeDummy {
    constructor() {

    }

    async makeUser() {
        console.log('start MakeUserDummy')
        try {
            connectDB();

            const generateDummyUser = (count) => {
                const users = [];

                for (let i = 0; i < count; i++) {
                    users.push({
                        userid: `user${i + 1}`,
                        username: `User${i + 1}`,
                        password: `1234`,
                        role: 'customer',
                        profileImage: ``,
                        region: '67910ebae891c83d42444809', // Region. 서울특별시 강남구
                    });
                }
                // console.log(users);
                return users;
            }

            const insertDummyUser = async () => {
                const dummyUsers = generateDummyUser(50);
                const result = await User.insertMany(dummyUsers);
                console.log(`${result.length} dummy user 생성 성공`);
            }

            await User.countDocuments()
                .then(async count => {
                    if (count < 30)
                        await insertDummyUser();
                    else
                        console.log(`count > 30. count : ${count}`);
                })
                .catch(err => {
                    console.error(err);
                });
        } catch (e) {
            console.error(`dummyuser 생성중 에러. ${e}`);
        } finally {
            mongoose.connection.close();
        }
    }
}

module.exports = {MakeDummy};