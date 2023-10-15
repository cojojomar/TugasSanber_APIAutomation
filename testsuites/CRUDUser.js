const request = require("supertest");
const {expect} = require("chai");
const user = require("../data/newUser.json");
const log = require("../data/login.json");
const token = require("../object/getToken.js")


describe("CRUD data user", function(){
    this.timeout(10000);
    let userID = ""
    let auth = ""
    before(async function() {
        const resGetToken = await token(log.email, log.password)
        auth = await resGetToken.body.data.accessToken
    }),
    it("Create User", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
        .post("/users")
        .send({
                "name": user.name,
                "email": user.email,
                "password": user.password
        })
        .set({
                Authorization : `Bearer ${auth}`,
                ContentType : "application/json"
        });
        userID = await response.body.data.userId
        expect(await response.statusCode).is.equal(201)
        expect(await response.body.status).to.include('success')
        expect(await response.body.data.name).is.equal('cojocjo')
    }),
    it("Get User Detail", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
        .get("/users/"+ userID)
        .set({
            Authorization : `Bearer ${auth}`,
            ContentType : `application/json`
        });
        expect(await response.statusCode).is.equal(200)
        expect(await response.body.data.user.id).is.equal(userID)
        expect(await response.body.data.user.email).is.equal("cojocjo@example.com")
    }),
    it("Update User", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
        .put("/users/"+ userID)
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
    it("Delete User", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                .delete("/users/"+ userID)
                .set({
                    Authorization : `Bearer ${auth}`
                });
        expect(await response.statusCode).is.equal(200)
        expect(await response.body.message).is.equal('User berhasil dihapus')
    })

})