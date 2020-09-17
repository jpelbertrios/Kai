import React from 'react';
import { mount } from 'enzyme';
import ViewGraph from '../../../src/components/ViewGraph/ViewGraph';
import { GetAllGraphsRepo } from '../../../src/rest/repositories/get-all-graphs-repo';
import { Graph } from '../../../src/domain/graph';

jest.mock('../../../src/rest/repositories/get-all-graphs-repo');

describe('When ExampleTable mounts', () => {
    it('should display Table Headers and Graphs when GetGraphs successful', async () => {
        mockGetGraphsToReturn([new Graph('testId1', 'deployed')]);

        const wrapper = mount(<ViewGraph />);
        await wrapper.update();
        await wrapper.update();

        expect(wrapper.find('thead').text()).toBe('Graph NameCurrent StateActions');
        expect(wrapper.find('tbody').text()).toBe('testId1deployed');
        expect(wrapper.find('caption').length).toBe(0);
    });
    it('should display No Graphs caption when ', async () => {
        mockGetGraphsToReturn([]);

        const wrapper = mount(<ViewGraph />);
        await wrapper.update();

        expect(wrapper.find('caption').text()).toBe('No Graphs.');
    });
    it('should display Error Message in AlertNotification when GetGraphs request fails', () => {
        GetAllGraphsRepo.mockImplementationOnce(() => {
            return {
                getAll: () => { throw new Error('404 Not Found'); },
            };
        });

        const wrapper = mount(<ViewGraph />);

        expect(wrapper.find('#notification-alert').text()).toBe('Failed to get all graphs: 404 Not Found');
    });
    it('should not display Error AlertNotification when GetGraphs request successful', async () => {
        mockGetGraphsToReturn([new Graph('roadTraffic', 'DEPLOYED')]);

        const wrapper = mount(<ViewGraph />);
        await wrapper.update();

        const table = wrapper.find('table');
        expect(table).toHaveLength(1);
        expect(table.find('tbody').text()).toBe('roadTrafficDEPLOYED');
        expect(wrapper.find('#notification-alert').length).toBe(0);
    });
    it('should call GetGraphs again when refresh button clicked', async () => {
        mockGetGraphsToReturn([new Graph('roadTraffic', 'DEPLOYING')]);

        const wrapper = mount(<ViewGraph />);
        await wrapper.update();
        expect(wrapper.find('tbody').text()).toBe('roadTrafficDEPLOYING');

        mockGetGraphsToReturn([new Graph('roadTraffic', 'FINISHED DEPLOYMENT')]);
        wrapper.find('button#view-graphs-refresh-button').simulate('click');
        await wrapper.update();
        
        expect(wrapper.find('tbody').text()).toBe('roadTrafficFINISHED DEPLOYMENT');
    });
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
