const request = require("supertest");
const {expect} = require("chai");
const user = require("../data/newUser.json");
const log = require("../data/login.json");
const getToken = require("./getToken");
const createUser = require("./createUser");

describe("Update User Detail", function(){
    this.timeout(10000);
    let userID = ""
    let auth = ""
    before(async function() {
        const resGetToken = await getToken(log.email,log.password)
        auth = await resGetToken.body.data.accessToken
        const resCreateUser = await createUser(user.name,user.email,user.password,auth)
        userID = await resCreateUser.body.data.userId
    }),
    it("Update User Detail Using Valid UserId", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                .put("/users/"+userID)
                .send({
                    "name": "update nama cojo",
                    "email": "cojocjo@example.com"
                })
                .set({
                    Authorization : `Bearer ${auth}`
                });
        expect(await response.statusCode).is.equal(200)
        expect(await response.body.message).is.equal('User berhasil diupdate')
        expect(await response.body.data.name).is.equal('update nama cojo')
    }),
    it("Update User Detail Using Invalid UserID", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                .put("/users/"+1234324)
                .send({
                    "name": "update nama cojo",
                    "email": "cojocjo@example.com"
                })
                .set({
                    Authorization : `Bearer ${auth}`
                });
        expect(await response.statusCode).is.equal(404)
        expect(await response.body.status).to.include('fail')
        expect(await response.body.message).is.equal('id tidak valid')
    })
})