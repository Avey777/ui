import React, {Component} from 'react'
import Authorized, {EDITOR_ROLE} from 'src/auth/Authorized'

import DashboardsTable from 'src/dashboards/components/DashboardsTable'
import SearchBar from 'src/hosts/components/SearchBar'
import FancyScrollbar from 'src/shared/components/FancyScrollbar'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {Dashboard} from 'src/types/dashboard'

interface Props {
  dashboards: Dashboard[]
  onDeleteDashboard: () => void
  onCreateDashboard: () => void
  onCloneDashboard: () => void
  onExportDashboard: () => void
  dashboardLink: string
}

interface State {
  searchTerm: string
}

@ErrorHandling
class DashboardsPageContents extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',
    }
  }

  public render() {
    const {
      onDeleteDashboard,
      onCreateDashboard,
      onCloneDashboard,
      onExportDashboard,
      dashboardLink,
    } = this.props

    return (
      <FancyScrollbar className="page-contents">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="panel">
                {this.renderPanelHeading}
                <div className="panel-body">
                  <DashboardsTable
                    dashboards={this.filteredDashboards}
                    onDeleteDashboard={onDeleteDashboard}
                    onCreateDashboard={onCreateDashboard}
                    onCloneDashboard={onCloneDashboard}
                    onExportDashboard={onExportDashboard}
                    dashboardLink={dashboardLink}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FancyScrollbar>
    )
  }

  private get renderPanelHeading(): JSX.Element {
    const {onCreateDashboard} = this.props

    return (
      <div className="panel-heading">
        <h2 className="panel-title">{this.panelTitle}</h2>
        <div className="dashboards-page--actions">
          <SearchBar
            placeholder="Filter by Name..."
            onSearch={this.filterDashboards}
          />
          <button className="btn btn-sm btn-primary">
            <span className="icon import" /> Import Dashboard
          </button>
          <Authorized requiredRole={EDITOR_ROLE}>
            <button
              className="btn btn-sm btn-primary"
              onClick={onCreateDashboard}
            >
              <span className="icon plus" /> Create Dashboard
            </button>
          </Authorized>
        </div>
      </div>
    )
  }

  private get filteredDashboards(): Dashboard[] {
    const {dashboards} = this.props
    const {searchTerm} = this.state

    return dashboards.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  private get panelTitle(): string {
    const {dashboards} = this.props

    if (dashboards === null) {
      return 'Loading Dashboards...'
    } else if (dashboards.length === 1) {
      return '1 Dashboard'
    }

    return `${dashboards.length} Dashboards`
  }

  private filterDashboards = (searchTerm: string): void => {
    this.setState({searchTerm})
  }
}

export default DashboardsPageContents
