import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import AddGraph from '../../../src/components/AddGraph/AddGraph';
import { DropzoneArea } from 'material-ui-dropzone';
import { CreateGraphRepo } from '../../../src/rest/repositories/create-graph-repo';

jest.mock('../../../src/rest/repositories/create-graph-repo');

let wrapper: ReactWrapper;
beforeEach(() => wrapper = mount(<AddGraph />));
afterEach(() => wrapper.unmount())

const exampleJSON = {
    elements: {
        edges: {
            BasicEdge: {
                source: 'vertex',
                destination: 'vertex',
                directed: 'true',
                properties: {
                    count: 'count',
                },
            },
        },
    },
    types: {
        types: {
            vertex: {
                class: 'java.lang.String',
            },
            count: {
                class: 'java.lang.Integer',
                aggregateFunction: {
                    class: 'uk.gov.gchq.koryphe.impl.binaryoperator.Sum',
                },
            },
            true: {
                description: 'A simple boolean that must always be true.',
                class: 'java.lang.Boolean',
                validateFunctions: [
                    {
                        class: 'uk.gov.gchq.koryphe.impl.predicate.IsTrue',
                    },
                ],
            },
        },
    },
};

describe('On Render', () => {
    it('should have a Graph Id text field', () => {
        const textfield = wrapper.find('input');
        expect(textfield.at(0).props().name).toBe('graphName');
    });
    it('should have a Schema text area', () => {
        const textfield = wrapper.find('textarea');
        expect(textfield.props().id).toBe('schema');
    });
    it('should have icon button', () => {
        const fileButton = wrapper.find('button').at(0).find('svg');
        expect(fileButton).toHaveLength(1);
    });
    it('should have a Submit button', () => {
        const submitButton = wrapper.find('button').at(3).text();
        expect(submitButton).toBe('Add Graph');
    });
});
describe('Add Graph Button', () => {
    it('should be disabled when Graph Name and Schema fields are empty', () => {
        expect(wrapper.find('button#add-new-graph-button').props().disabled).toBe(true);
    });
    it('should be disabled when Graph Name field is empty', () => {
        inputSchema(exampleJSON);

        expect(wrapper.find('button#add-new-graph-button').props().disabled).toBe(true);
    });
    it('should be disabled when the Schema field is empty', () => {
        inputGraphName('G');

        expect(wrapper.find('button#add-new-graph-button').props().disabled).toBe(true);
    });
    it('should be enabled when the Graph Name and Schema inputted', () => {
        inputGraphName('My Graph');
        inputSchema(exampleJSON);

        expect(wrapper.find('button#add-new-graph-button').props().disabled).toBe(false);
    });
});
describe('Dropzone behaviour', () => {
    it('should have an input that accepts files', () => {
        const dropZone = wrapper.find('input').at(1);
        expect(dropZone.props().type).toBe('file');
    });
    it('should only accept json files', () => {
        const dropZone = wrapper.find('input').at(1);
        expect(dropZone.props().accept).toBe('application/json');
    });
});
describe('Schema validation integration', () => {
    it('should display validation errors as an Alert Notification', () => {
        inputGraphName('OK Graph');
        inputSchema({ blah: 'blahhhhh' });

        clickSubmit();

        const expectedMessage = 'Error(s): Elements is missing from schema, ' +
            'Types is missing from schema, [\"blah\"] are invalid schema root properties';
        expect(wrapper.find('div.MuiAlert-message').text()).toBe(expectedMessage);
    });
})
describe('On Submit Request', () => {
    it('should display success message in the NotificationAlert', async () => {
        mockAddGraphRepoWithFunction(() => { });

        inputGraphName('OK Graph');
        inputSchema(exampleJSON);

        clickSubmit();
        await wrapper.update();
        await wrapper.update();

        expect(wrapper.find('#notification-alert').text()).toBe('OK Graph was successfully added');
    });
    it('should display an error message with server error in the NotificationAlert when Request fails', async () => {
        mockAddGraphRepoWithFunction(() => { throw new Error('500 Server Error'); });

        inputGraphName('Break Server');
        inputSchema(exampleJSON);

        clickSubmit();

        expect(wrapper.find('#notification-alert').text()).toBe('Failed to Add \'Break Server\' Graph: 500 Server Error');
    });
});

function inputGraphName(graphName: string): void {
    wrapper
        .find('input#graph-name')
        .simulate('change', {
            target: { value: graphName },
        });
}

function inputSchema(schema: object): void {
    wrapper.find('textarea').simulate('change', {
        target: { value: JSON.stringify(schema) },
    });
    expect(wrapper.find('textarea').props().value).toBe(JSON.stringify(schema));
}

function clickSubmit(): void {
    wrapper.find('button#add-new-graph-button').simulate('click');
}

function mockAddGraphRepoWithFunction(f: () => void): void {
    CreateGraphRepo.mockImplementationOnce(() => {
        return {
            create: f,
        };
    });
}