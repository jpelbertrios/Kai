import {mount} from 'enzyme';
import React from 'react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history'
import '@testing-library/jest-dom/extend-expect'
import NavigationAppbar from '../../../src/components/Navigation/NavigationAppbar'

describe('When NavigationAppbar mounts', () => {
    const history = createMemoryHistory();
    const nav = mount(
        <Router history={history}>
            <NavigationAppbar/>
        </Router>);
    it('should have text Kai in header', () => {
        const header = nav.find('header');
        const appBarText = nav.find('header').find('h4');
        expect(appBarText.text()).toBe('Kai');
    });
    it('should have 2 tabs in the appbar', () => {
        const tabs = nav.find('header').find('ul').find('a');
        expect(tabs.length).toBe(2)
    });
    it('should have the tabs Page1 and Page2', () => {
        const tabs = nav.find('header').find('ul').find('a');
        expect(tabs.at(0).text()).toBe('Page 1');
        expect(tabs.at(1).text()).toBe('Page 2');
    });
});