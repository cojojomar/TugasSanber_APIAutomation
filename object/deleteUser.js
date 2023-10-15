const request = require("supertest");
const {expect} = require("chai");
const user = require("../data/newUser.json");
const log = require("../data/login.json");
const getToken = require("./getToken");
const createUser = require("./createUser");

describe("Delete User", function(){
    this.timeout(10000);
    let userID = ""
    let auth = ""
    before(async function() {
        const resGetToken = await getToken(log.email,log.password)
        auth = await resGetToken.body.data.accessToken
        const resCreateUser = await createUser(user.name,user.email,user.password,auth)
        userID = await resCreateUser.body.data.userId
    }),
    it("Delete UserID Using Invalid UserID", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                .delete("/users/"+12345564)
                .set({
                    Authorization : `Bearer ${auth}`
                });
        expect(await response.statusCode).is.equal(404)
        expect(await response.body.message).is.equal('id tidak valid')
    }),
    it("Delete UserID Using Valid UserID", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                .delete("/users/"+userID)
                .set({
                    Authorization : `Bearer ${auth}`
                });
        expect(await response.statusCode).is.equal(200)
        expect(await response.body.message).is.equal('User berhasil dihapus')
    })
})