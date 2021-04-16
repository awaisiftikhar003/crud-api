
const dbcon = require('../dbUtill')
conn = new dbcon()
conn.connect();

class User {


    async createUser(params) {
        return new Promise(function (resolve, reject) {
            try {
                const resp = conn.query('INSERT INTO `users`(`email`, `password`, `first_name`, `last_name`) VALUES(?,?,?,?)', params, (err, res) => {
                    if (err) {
                        console.log(err)
                        reject({ "code": 500, "success": false, "resp": err.message })
                    }
                    let result = { "code": 200, "success": true, "resp": "User inserted successfully." }
                    resolve(result)
                })
            }
            catch (err) {
                console.log(err)
                reject({ "code": 500, "success": false, "resp": err.message ? err.message : err })
            }
        })
    };


    async getUsers(limit, userid) {
        return new Promise(function (resolve, reject) {
            try {

                const resp = conn.query(`select * from users where user_id > ? order by user_id limit ? `, [parseInt(userid), parseInt(limit)], (err, res) => {
                    if (err) {
                        console.log(err)
                        reject({ "code": 500, "success": false, "resp": err.message })
                    }
                    console.log(res)
                    let result = { "code": 200, "success": true, "resp": res }
                    resolve(result)
                })

            }
            catch (err) {
                console.log(err)
                reject({ "code": 500, "success": false, "resp": err.message ? err.message : err })
            }
        })
    };


    async updateUser(params) {
        return new Promise(function (resolve, reject) {
            try {
                const resp = conn.query('update `users` set email = ?, password = ?, first_name = ?, last_name = ? where user_id = ?', params, (err, res) => {
                    if (err) {
                        console.log(err)
                        reject({ "code": 500, "success": false, "resp": err.message })
                    }
                    let result = { "code": 200, "success": true, "resp": "User updated successfully." }
                    resolve(result)
                })
            }
            catch (err) {
                console.log(err)
                reject({ "code": 500, "success": false, "resp": err.message ? err.message : err })
            }
        })
    };

    async deleteUsers(user_id) {
        return new Promise(function (resolve, reject) {
            try {
                const resp = conn.query('delete from users where user_id = ?', [user_id], (err, res) => {
                    if (err) {
                        console.log(err)
                        reject({ "code": 500, "success": false, "resp": err.message })
                    }
                    let result = { "code": 200, "success": true, "resp": "User deleted successfully." }
                    resolve(result)
                })
            }
            catch (err) {
                console.log(err)
                reject({ "code": 500, "success": false, "resp": err.message ? err.message : err })
            }
        })
    };

    async transactionExample(user_id, params) {
        let users
        let resp
        try {
            // locked rows only available after the transaction comleted
            await this.executeQuery('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            // begining the transaction
            await this.executeQuery('START TRANSACTION')
            // stop mysql to auto commit the changes
            await this.executeQuery('set autocommit = 0')
            // selecting the records from users table
            users = await this.executeQuery('SELECT * FROM users WHERE user_id = ? FOR UPDATE', [user_id]);

            if (users.length == 0) {
                resp = this.createUser(params)
            } else {
                params.push(user_id)
                resp = this.updateUser(params)
            }
            // upon successfull executing queries commit changes in db
            await this.executeQuery('COMMIT');

            return resp
        }
        catch (err) {
            console.log(err)
            // upon failure, rollback changes
            await this.executeQuery('ROLLBACK');
            return ({ "code": 500, "success": false, "resp": err.message ? err.message : err })
        }
    };



    executeQuery(query, params) {
        return new Promise(function (resolve, reject) {
            try {
                conn.query(query, params, (err, res) => {
                    if (err) {
                        console.log(err)
                        resolve({ "code": 500, "success": false, "resp": err.message })
                    }
                    resolve(res)
                })
            } catch (err) {
                console.log({ message: err.message })
                resolve({ "code": 500, "success": false, "resp": err.message })
            }
        })
    };
}




module.exports = User