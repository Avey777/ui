import React from 'react'
import {shallow} from 'enzyme'

import GraphOptionsSortBy from 'src/dashboards/components/GraphOptionsSortBy'
import Dropdown from 'src/shared/components/Dropdown'

const defaultProps = {
  sortByOptions: [],
  onChooseSortBy: () => {},
  selected: {
    internalName: 'boom',
    displayName: 'here',
  }
}

const setup = (override = {}) => {
  const props = {...defaultProps, ...override}
  const wrapper = shallow(<GraphOptionsSortBy {...props} />)

  return {wrapper, props}
}

describe('Dashboards.Components.GraphOptionsSortBy', () => {
  describe('rendering', () => {
    it('renders component', () => {
      const {wrapper} = setup()

      const dropdown = wrapper.find(Dropdown)
      const label = wrapper.find('label')

      expect(dropdown.props().selected).toEqual('here')
      expect(dropdown.exists()).toBe(true)
      expect(label.exists()).toBe(true)
    })

    describe('when selected display name is not available', () => {
      it('render internal name as selected', () => {
        const {wrapper} = setup({selected: {internalName: 'boom'}})

        const dropdown = wrapper.find(Dropdown)

        expect(dropdown.props().selected).toEqual('boom')
      })
    })
  })
})
