import { CreateGraphRepo } from '../../../src/rest/repositories/create-graph-repo';
import { Schema } from '../../../src/domain/schema';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ApiError } from '../../../src/domain/errors/api-error';
import { TypesSchema } from '../../../src/domain/types-schema';
import { ElementsSchema } from '../../../src/domain/elements-schema';

const mock = new MockAdapter(axios);
const repo = new CreateGraphRepo();

afterEach(() => mock.resetHandlers());

describe('Create Graph Repo', () => {
    it('should called with ', async () => {
        mock.onPost('/graphs').reply(201);
        const schema = new Schema(JSON.stringify({ elements: {}, types: {} }));
        const elements = new ElementsSchema(JSON.stringify({ entities: {}, edges: {} }));
        const types = new TypesSchema(JSON.stringify({ types: {} }));

        await expect(repo.create('ok', [], elements, types)).resolves.toEqual(undefined);
    });

    it('should called with ', async () => {
        mock.onPost('/graphs').reply(200);
        const schema = new Schema(JSON.stringify({ elements: {}, types: {} }));
        const elements = new ElementsSchema(JSON.stringify({ entities: {}, edges: {} }));
        const types = new TypesSchema(JSON.stringify({ types: {} }));

        await expect(repo.create('bad', [], elements, types)).rejects.toEqual(
            new Error('Expected status code 201 for Created Graph but got (200)')
        );
    });

    it('should throw Api Error 400 when API returns a 400', async () => {
        mock.onPost('/graphs').reply(400);
        const schema = new Schema(JSON.stringify({ elements: {}, types: {} }));
        const elements = new ElementsSchema(JSON.stringify({ entities: {}, edges: {} }));
        const types = new TypesSchema(JSON.stringify({ types: {} }));

        await expect(repo.create('bad', [], elements, types)).rejects.toEqual(
            new ApiError(400, 'Request failed with status code 400')
        );
    });
});
