import {mount, shallow} from "enzyme";
import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import Page2 from "../../../src/components/Page2";


describe('When Page1 mounts', () => {
    it('should render without errors', () => {
        const component = shallow(<Page2/>);

        expect(component).toMatchSnapshot();
    });
})