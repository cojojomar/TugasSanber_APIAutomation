const request = require("supertest");
const {expect} = require("chai");
const user = require("../data/newUser.json");
const log = require("../data/login.json");
const getToken = require("./getToken");


async function createUser(name,email,password,token){
    const response = await request ("https://kasir-api.belajarqa.com")
        .post("/users")
        .send({
                "name": name,
                "email": email,
                "password": password
        })
        .set({
                Authorization : `Bearer ${token}`,
                ContentType : "application/json"
        });
    return response
}

module.exports = createUser;

describe("Create User", function(){
    this.timeout(10000);
    let auth = ''
    before(async function(){
        const resGetToken = await getToken(log.email,log.password)
        auth = await resGetToken.body.data.accessToken
    }),
    it("User Successfully Created",async function(){
        const response = await createUser(user.name, user.email, user.password, auth)
        expect(await response.statusCode).is.equal(201)
        expect(await response.body.status).to.include('success')
        expect(await response.body.data.name).is.equal('cojocjo')
    }),
    it("Create User Using Invalid an Email", async function(){
        const response = await createUser(user.name, "cjocjoemail.com", user.password, auth)
        expect(await response.statusCode).is.equal(400)
        expect(await response.body.message).to.include('"email" must be a valid email')
    })
})

