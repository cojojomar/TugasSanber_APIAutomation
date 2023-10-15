const request = require("supertest");
const {expect} = require("chai");
const user = require("../data/newUser.json");
const log = require("../data/login.json");
const getToken = require("./getToken");
const createUser = require("./createUser");

describe("Get User Detail", function(){
    this.timeout(10000);
    let userID = ""
    let auth = ""
    before(async function() {
        const resGetToken = await getToken(log.email,log.password)
        auth = await resGetToken.body.data.accessToken
        //console.log(auth)
        const resCreateUser = await createUser(user.name,user.email,user.password,auth)
        //console.log(responseCreateUser.body)
        userID = await resCreateUser.body.data.userId
        //console.log(userId)
    }),
    it("Get User Detail Using Valid UserId", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                .get("/users/"+userID)
                .set({
                    Authorization : `Bearer ${auth}`,
                    ContentType : `application/json`
                });
        expect(await response.statusCode).is.equal(200)
        expect(await response.body.data.user.id).is.equal(userID)
        expect(await response.body.data.user.email).is.equal("cojocjo@example.com")
    }),
    it("Get User Detail Using Invalid UserId", async function(){
        const response = await request ("https://kasir-api.belajarqa.com")
                                    .get("/users/"+21837123)
                                    .set({
                                        Authorization : `Bearer ${auth}`,
                                        Accept : "application/json"
                                    });
                        
        console.log(response.body)
        expect(await response.statusCode).is.equal(404)
        expect(await response.body.status).to.include('fail')
        expect(await response.body.message).is.equal("id tidak valid")
    })
})