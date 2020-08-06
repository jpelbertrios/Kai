import React from 'react';
import App from '../../src/components/App';
import {mount} from "enzyme";
import {MemoryRouter} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect'
import Page1 from '../../src/components/Page1';
import Page2 from "../../src/components/Page2";

describe('App tests', () => {
    it('compare values', () => {
        expect(5).toBe(5);
    });
    it('should take the user to Page1 when its first run', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(Page1)).toHaveLength(1);
    });
    it('should take the user to Page1 when the path is changed to /Page1', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/Page1']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(Page1)).toHaveLength(1);
    });
    it('should take the user to Page2 when the path is changed to /Page2', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/Page2']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(Page2)).toHaveLength(1);
    })
});


