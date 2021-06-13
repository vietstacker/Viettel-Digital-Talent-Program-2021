process.env.NODE_ENVIRONMENT = "test"

/**
 * Packages for Unit Tests
 *
 */

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server")

let should =  chai.should();

const testUser = {
    userName: "pnguyen5",
    fullName: "Nguyen D. Phong",
    email: "pnguyen5@conncoll.edu",
    description: "Phong Nguyen the Tester", 
    gender: "M",
    password: "12345678",
    passwordConfirm: "12345678",
}

chai.use(chaiHttp);

module.exports = {
	chai,
	server,
	should,
	testUser
}
