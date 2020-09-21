import React from 'react';
import { mount } from 'enzyme';
import ViewGraph from '../../../src/components/ViewGraph/ViewGraph';
import { GetAllGraphsRepo } from '../../../src/rest/repositories/get-all-graphs-repo';
import { Graph } from '../../../src/domain/graph';
import {DeleteGraphRepo} from '../../../src/rest/repositories/delete-graph-repo'

jest.mock('../../../src/rest/repositories/get-all-graphs-repo');
jest.mock('../../../src/rest/repositories/delete-graph-repo')

describe('When ExampleTable mounts', () => {
    it('should display Table Headers and Graphs when GetGraphs successful', async () => {
        mockGetGraphsToReturn([new Graph('testId1', 'deployed')]);

        const component = mount(<ViewGraph />);
        await component.update();
        await component.update();

        expect(component.find('thead').text()).toBe('Graph NameCurrent StateActions');
        expect(component.find('tbody').text()).toBe('testId1deployed');
        expect(component.find('caption').length).toBe(0);
    });
    it('should display No Graphs caption when ', async () => {
        mockGetGraphsToReturn([]);

        const component = mount(<ViewGraph />);
        await component.update();

        expect(component.find('caption').text()).toBe('No Graphs.');
    });
    it('should display Error Message in AlertNotification when GetGraphs request fails', () => {
        GetAllGraphsRepo.mockImplementationOnce(() => {
            return {
                getAll: () => { throw new Error('404 Not Found'); },
            };
        });

        const component = mount(<ViewGraph />);

        expect(component.find('#notification-alert').text()).toBe('Failed to get all graphs: 404 Not Found');
    });
    it('should not display Error AlertNotification when GetGraphs request successful', async () => {
        mockGetGraphsToReturn([new Graph('roadTraffic', 'DEPLOYED')]);

        const component = mount(<ViewGraph />);
        await component.update();

        const table = component.find('table');
        expect(table).toHaveLength(1);
        expect(table.find('tbody').text()).toBe('roadTrafficDEPLOYED');
        expect(component.find('#notification-alert').length).toBe(0);
    });
    it('should call GetGraphs again when refresh button clicked', async () => {
        mockGetGraphsToReturn([new Graph('roadTraffic', 'DEPLOYING')]);

        const component = mount(<ViewGraph />);
        await component.update();
        expect(component.find('tbody').text()).toBe('roadTrafficDEPLOYING');

        mockGetGraphsToReturn([new Graph('roadTraffic', 'FINISHED DEPLOYMENT')]);
        component.find('button#view-graphs-refresh-button').simulate('click');
        await component.update();
        
        expect(component.find('tbody').text()).toBe('roadTrafficFINISHED DEPLOYMENT');
    });
    it('should send a delete request when the delete button has been clicked', async() => {
        mockGetGraphsToReturn([new Graph('peaches', 'ACTIVE')]);

        const component = mount(<ViewGraph />);
        await component.update();
        await component.update();
        expect(component.find('tbody').text()).toBe('peachesACTIVE');
        
        component.find('tbody').find('button#view-graphs-delete-button-0').simulate('click');
        await component.update();
    
        expect(DeleteGraphRepo).toHaveBeenCalledTimes(1);
    })
});
function mockGetGraphsToReturn(graphs: Graph[]):void {
    GetAllGraphsRepo.mockImplementationOnce(() => {
        return {
            getAll: () => {
                return new Promise((resolve, reject) => {
                    resolve(graphs)
                })
            },
        };
    });
}
