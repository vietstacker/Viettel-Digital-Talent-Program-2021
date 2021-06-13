const { chai, server, should, testUser } = require('./testConfig');
const { createToken } = require('../controllers/authController')


describe("Board CRUD", ()=> {

    let TOKEN = null;
    let testBoard = {
        title: "Monday Morning Routine Work From Home",
        description: "What i do on monday morning while working from home"
    }

    describe("/api/auth/login - Log in User", () => {
		it("it should authenticate an exisiting user & retrieve JWT Token", (done) => {
			chai.request(server)
				.post("/api/auth/login")
				.send({ "userName": testUser.userName, "password": testUser.password })
				.then((res) => {

					res.should.have.status(200);
					res.body.should.have.property("message").eql("Successfully Authenticated!");
					TOKEN = res.body.token;

					done();
                }).catch(err => {
                    console.log(err);
                });
		});
	});


    
    describe("/api/boards/create - Creating new Board", () => {
		it("it should create a new board", (done) => {
            chai.request(server)
                .post("/api/boards/create")
                .set({ "Authorization": TOKEN })
                .send(testBoard)
                .then((res) => {
                    
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("New Board has been created!");
                    testBoard.id = res.body.data.id;
                    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});
   
    describe("/api/boards/update/:id - Update Board", () => {
		it("it should update 'title' & 'description' of board", (done) => {
            chai.request(server)
                .patch("/api/boards/update/" + testBoard.id)
                .set({ "Authorization": TOKEN })
                .send({
                    title: "Monday Morning Routine Work From Home Updated",
                    description: "Updated what i do on monday morning while working from home"
                })
                .then((res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Existing Board has been updated!");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});

    describe("/api/boards/:id - Board", () => {
		it("it should return the board with defined ID", (done) => {
            chai.request(server)
                .get("/api/boards/" + testBoard.id)
                .set({ "Authorization": TOKEN })
                .then((res) => {
                    
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Found your Board!");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});

    describe("/api/boards/list - Board", () => {
		it("it should return board list of an User", (done) => {
            chai.request(server)
                .get(`/api/boards/list`)
                .set({ "Authorization": TOKEN })
                .then((res) => {
    
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.should.have.property("message").eql("Successfully found your Board list");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});


    describe("/api/boards/delete - Delete Board", () => {
		it("it should delete an existing board", (done) => {
            chai.request(server)
                .delete("/api/boards/delete/" + testBoard.id)
                .set({ "Authorization": TOKEN })
                .then((res) => {
    
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Your Board has been deleted!");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});

});