import {mount, shallow} from 'enzyme';
import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import Page1 from "../../../src/components/Page1";

describe('When Page1 mounts', () => {
    it('should render without errors', () => {
        const component = shallow(<Page1/>);

        expect(component).toMatchSnapshot();
    });
});