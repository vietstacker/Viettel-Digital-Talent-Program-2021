const { chai, server, should, testUser } = require('./testConfig');
const UserModel = require('../models/userModel');


describe("User Authentication", () => {
	

	describe("/api/auth/signup - Sign up User", () => {

		/**
		 * Remove Test User if alreay exist in Db
		 */
		before((done) => {
			UserModel.findOneAndDelete({ userName: {$eq: testUser.userName } }, (err, res) => {
				done();
			});
		});

		it("it should add a new user", (done) => {
			chai.request(server)
				.post("/api/auth/signup")
				.send(testUser)
				.then((res) => {
		
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Successfully Signed Up!");
					testUser.token = res.body.token;

					done();
                }).catch(err => {
                    console.log(err);
					done();
                });
		});
	});

	describe("/api/auth/login - Log in User", () => {
		it("it should authenticate an exisiting user", (done) => {
			chai.request(server)
				.post("/api/auth/login")
				.send({ "userName": testUser.userName, "password": testUser.password })
				.then((res) => {

					res.should.have.status(200);
					res.body.should.have.property("message").eql("Successfully Authenticated!");
					testUser.token = res.body.token;

					done();
                }).catch(err => {
                    console.log(err);
					done();
                });
		});
	});


});

