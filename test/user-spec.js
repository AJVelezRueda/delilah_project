process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const user = require('../controllers/user');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Users', () => {
    describe('GET /users', () => {
        it('should return an empty list when there are no users', async () => {
            await user.clean();
            const res = await agent.get('/users')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { users: [] });
        });

        it('should return a singleton list when there is an user', async () => {
            await user.clean();
            await agent.post('/users').send({ name: "Johan Sebastian", email: "mastro@gmail.com" })
            const res = await agent.get('/users')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                users: [{ id: 1, name: "Johan Sebastian", email: "mastro@gmail.com" }]
            });
        });
    });
});