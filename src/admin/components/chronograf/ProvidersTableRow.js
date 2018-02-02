import React, {Component, PropTypes} from 'react'

import ConfirmButtons from 'shared/components/ConfirmButtons'
import Dropdown from 'shared/components/Dropdown'
import InputClickToEdit from 'shared/components/InputClickToEdit'

import {DEFAULT_PROVIDER_MAP_ID} from 'src/admin/constants/dummyProviderMaps'

class ProvidersTableRow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      scheme: this.props.mapping.scheme,
      provider: this.props.mapping.provider,
      providerOrganization: this.props.mapping.providerOrganization,
      organizationId: this.props.mapping.organizationId,
      isDeleting: false,
    }
  }

  handleDeleteClick = () => {
    this.setState({isDeleting: true})
  }

  handleDismissDeleteConfirmation = () => {
    this.setState({isDeleting: false})
  }

  handleDeleteMap = mapping => {
    const {onDelete} = this.props
    this.setState({isDeleting: false})
    onDelete(mapping)
  }

  handleChangeProvider = provider => {
    this.setState({provider})
    const {scheme, organizationId, providerOrganization} = this.state
    const {onUpdate, mapping: {id}} = this.props
    const updatedMap = {
      id,
      scheme,
      provider,
      providerOrganization,
      organizationId,
    }
    onUpdate(updatedMap)
  }

  handleChangeProviderOrg = providerOrganization => {
    this.setState({providerOrganization})
    const {onUpdate, mapping: {id}} = this.props
    const {scheme, provider, organizationId} = this.state
    const updatedMap = {
      id,
      scheme,
      provider,
      providerOrganization,
      organizationId,
    }
    onUpdate(updatedMap)
  }

  handleChooseOrganization = org => {
    const organizationId = org.id
    this.setState({organizationId})
    const {onUpdate, mapping: {id}} = this.props
    const {scheme, provider, providerOrganization} = this.state
    const updatedMap = {
      id,
      scheme,
      provider,
      providerOrganization,
      organizationId,
    }
    onUpdate(updatedMap)
  }

  handleChooseScheme = s => {
    const scheme = s.text
    this.setState({scheme})
    const {onUpdate, mapping: {id}} = this.props
    const {provider, providerOrganization, organizationId} = this.state
    const updatedMap = {
      id,
      scheme,
      provider,
      providerOrganization,
      organizationId,
    }
    onUpdate(updatedMap)
  }

  handleUpdateMapping = () => {
    // this was getting called by all the handlers for input/dropdown changes but it meant the state was not getting updated so the updated map was stale
    const {onUpdate, mapping: {id}} = this.props
    const {scheme, provider, providerOrganization, organizationId} = this.state
    const updatedMap = {
      id,
      scheme,
      provider,
      providerOrganization,
      organizationId,
    }
    onUpdate(updatedMap)
  }

  render() {
    const {
      scheme,
      provider,
      providerOrganization,
      organizationId,
      isDeleting,
    } = this.state
    const {organizations, mapping, schemes} = this.props

    const selectedOrg = organizations.find(o => o.id === organizationId)
    const orgDropdownItems = organizations.map(role => ({
      ...role,
      text: role.name,
    }))

    const organizationIdClassName = isDeleting
      ? 'fancytable--td provider--redirect deleting'
      : 'fancytable--td provider--redirect'

    const isDefaultMapping = DEFAULT_PROVIDER_MAP_ID === mapping.id

    return (
      <div className="fancytable--row">
        <div className="fancytable--td provider--id">
          {mapping.id}
        </div>
        <Dropdown
          items={schemes}
          onChoose={this.handleChooseScheme}
          selected={scheme}
          className="fancytable--td provider--scheme"
        />
        <InputClickToEdit
          value={provider}
          wrapperClass="fancytable--td provider--provider"
          onUpdate={this.handleChangeProvider}
          disabled={isDefaultMapping}
        />
        <InputClickToEdit
          value={providerOrganization}
          wrapperClass="fancytable--td provider--providerorg"
          onUpdate={this.handleChangeProviderOrg}
          disabled={isDefaultMapping}
        />
        <div className="fancytable--td provider--arrow">
          <span />
        </div>
        <div className={organizationIdClassName}>
          <Dropdown
            items={orgDropdownItems}
            onChoose={this.handleChooseOrganization}
            selected={selectedOrg.name}
            className="dropdown-stretch"
          />
        </div>
        {isDeleting
          ? <ConfirmButtons
              item={mapping}
              onCancel={this.handleDismissDeleteConfirmation}
              onConfirm={this.handleDeleteMap}
              onClickOutside={this.handleDismissDeleteConfirmation}
            />
          : <button
              className="btn btn-sm btn-default btn-square"
              onClick={this.handleDeleteClick}
            >
              <span className="icon trash" />
            </button>}
      </div>
    )
  }
}

const {arrayOf, func, shape, string} = PropTypes

ProvidersTableRow.propTypes = {
  mapping: shape({
    id: string,
    scheme: string,
    provider: string,
    providerOrganization: string,
    organizationId: string,
  }),
  organizations: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
    })
  ),
  schemes: arrayOf(
    shape({
      text: string.isRequired,
    })
  ),
  onDelete: func.isRequired,
  onUpdate: func.isRequired,
}

export default ProvidersTableRow
