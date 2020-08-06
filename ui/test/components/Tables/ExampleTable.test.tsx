import {mount} from 'enzyme';
import ExampleTable from '../../../src/components/Tables/ExampleTable';
import React from 'react';
import {Graph} from '../../../src/domain/graph';
import {RestClient} from '../../../src/rest/rest-client';

beforeEach(() => {
    fetchMock.resetMocks();
});
describe('When ExampleTable mounts', () => {

    const wrapper = mount(<ExampleTable/>);
    it('should display only 1 table element', () => {
        const table = wrapper.find('table');
        expect(table).toHaveLength(1);
    });

    it('should display only 2 columns in the table element', () => {
        const tableHead = wrapper.find('th');
        expect(tableHead).toHaveLength(2);
    });

    it('should display Graph Id and Current State Columns', () => {
        const cols = [
            {name: 'Graph ID'},
            {name: 'Current State'},
        ];
        const tableHead = wrapper.find('th');
        tableHead.forEach((th, idx) => {
            expect(th.text()).toEqual(cols[idx].name);
        });
    });

    it('should only have 1 table body', () => {
        const tableBody = wrapper.find('tbody');
        expect(tableBody).toHaveLength(1);
    });
    it('should display the data correctly from the api', async () => {
        const mockSuccessResponse = [
            {
                graphId: "roadTraffic",
                currentState: "DEPLOYED"
            }, {
                graphId: "basicGraph",
                currentState: "DELETION_QUEUED"
            }];

        fetchMock.mockResponseOnce(JSON.stringify(mockSuccessResponse));
        const actual: Graph[] = await RestClient.getAllGraphs();
        await wrapper.update();
        wrapper.setState({graphs: actual});

        const rows = wrapper.find('table').find('tbody').find('tr');
        expect(rows).toHaveLength(actual.length);
        expect(rows.at(0).find('th').text()).toBe("roadTraffic");
        expect(rows.at(0).find('td').text()).toBe("DEPLOYED");
        expect(rows.at(1).find('th').text()).toBe("basicGraph");
        expect(rows.at(1).find('td').text()).toBe("DELETION_QUEUED")


    })
    it('should get selected rows graphId', () => {
        const row = wrapper.find('table').find('tbody').find('tr').at(0);
        row.simulate('click');
        const selectedRow = wrapper.state('selectedRow');
        expect(selectedRow).toBe('roadTraffic');

    });
    it('should get correct response from RestClient when Delete Graph button is clicked', async () => {
        const deleteGraph = wrapper.find('button');
        const mockSuccessResponse = [{
            graphId: "roadTraffic",
            currentState: "DELETION_IN_PROGRESS",
        }];
        fetchMock.mockResponseOnce(JSON.stringify(mockSuccessResponse));
        deleteGraph.simulate('click');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("/graphs/roadTraffic", {"method": "delete"});


    })


});

