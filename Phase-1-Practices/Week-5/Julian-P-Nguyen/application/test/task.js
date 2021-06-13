const { chai, server, should, testUser } = require('./testConfig');
const { createToken } = require('../controllers/authController')


describe("Task CRUD", ()=> {

    let TOKEN = null;
    //let boardID = null;

    let testTask = {
        title: "Do laundry",
        description: "Dont use washing powder! Use Pods"
    }

    let testBoard = {
        title: "Tuesday Morning Routine Work From Home",
        description: "What i do on Tuesday morning while working from home"
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
                    testTask.boardId = res.body.data.id;
                    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	    });


    
    describe("/api/tasks/create - Creating new Task", () => {
		it("it should create a new task", (done) => {
            chai.request(server)
                .post("/api/tasks/create")
                .set({ "Authorization": TOKEN })
                .send(testTask)
                .then((res) => {
                    
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("New task has been created!");
                    testTask.id = res.body.data.id;
                    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});
   
    describe("/api/tasks/update/:id - Update Task", () => {
		it("it should update 'title' & 'description' of task", (done) => {
            chai.request(server)
                .patch("/api/tasks/update/" + testTask.id)
                .set({ "Authorization": TOKEN })
                .send({
                    title: "Do laundry Updated",
                    description: "Dont use washing powder! Use Pods (Updated)"
                })
                .then((res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Existing Task has been updated!");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});

    describe("/api/tasks/:id - Get Task", () => {
		it("it should return the Task with defined ID", (done) => {
            chai.request(server)
                .get("/api/tasks/" + testTask.id)
                .set({ "Authorization": TOKEN })
                .then((res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Found your Task!");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});

    describe("/api/tasks/list - Task List", () => {
		it("it should return task list of an User", (done) => {
            chai.request(server)
                .get(`/api/tasks/list`)
                .set({ "Authorization": TOKEN })
                .then((res) => {
    
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.should.have.property("message").eql("Successfully found your Task list");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});


    describe("/api/tasks/delete - Delete Task", () => {
		it("it should delete an existing Task", (done) => {
            chai.request(server)
                .delete("/api/tasks/delete/" + testTask.id)
                .set({ "Authorization": TOKEN })
                .then((res) => {
    
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Your Task has been deleted!");
    
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
            });
	});

});