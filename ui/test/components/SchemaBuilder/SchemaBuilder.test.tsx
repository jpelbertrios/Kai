import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import SchemaBuilder from '../../../src/components/SchemaBuilder/SchemaBuilder';

let wrapper: ReactWrapper;
beforeEach(() => (wrapper = mount(<SchemaBuilder />)));
afterEach(() => wrapper.unmount());

describe('On Render', () => {
    it('should display base screen cleanly.', () => {
        const maindiv = wrapper.find('#schemabuilder');
        expect(maindiv.length).toBe(1);
    });

});