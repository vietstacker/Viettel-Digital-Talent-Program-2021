# SUPER-ULTRA-BASIC-TO-DO-APP
#### > Made in Vietnam by Phong D. Nguyen < 

## Project Goal
Creating a simple to-do app. User can perform CRUD operations on 2 Objects: Task & Board. 

Imagine `Task` like yellow sticky note while `Board` like a wooden board where those notes stick on.

![Illustration](stickynotes.jpg "A board w/ sticky notes")
## Database Schema:
#### 1. User: 
Person who use the application.

#### 2. Board: 
Container for Tasks.

#### 3. Task: 
Smallest unit. User can track performance/work flow by tracking `Tasks`

## API Usage:
By default, server runs on port `3000`

For security resons, `token` must be added to `Headers` under `Authorization` field

- URL would have the following structure:
```
http://localhost:3000/api/<Object>/<CRUD-operation>/<id of Object>
```

- Example: Creating new Task
```
http://localhost:3000/api/<Object>/<CRUD-operation>/<id of Object>
```

## API Documentation:
- Check `postman-collection` directory for more details on each API.

- Or view the below link for better UI:
```
https://documenter.getpostman.com/view/11913865/TzCMdnyq
```

## Future Implementations:
1. Better User Authorization

2. Enhance complexity & re-design Schema 

3. Write Unit Tests

#### If you encounter any issues, feel free to contact me for support :D
