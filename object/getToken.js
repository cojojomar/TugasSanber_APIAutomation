const request = require("supertest");
const {expect} = require("chai");
const log = require("../data/login.json")

async function getToken(email,password){
    const response = await request ("https://kasir-api.belajarqa.com")
        .post("/authentications")
        .send({
            "email": email,
            "password": password
        });
        return response
}

describe("Login Successful",async function(){
    this.timeout(10000);
    it("Get token", async function(){
        const response = await getToken(log.email,log.password)
        expect(await response.statusCode).to.equal(201)
        expect(await response.body.data.user.email).to.include("cojocjo@example.com")
        
    })
})

module.exports = getToken;