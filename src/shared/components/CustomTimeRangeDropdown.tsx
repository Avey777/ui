import React, {PureComponent} from 'react'
import moment from 'moment'
import classnames from 'classnames'

import {ClickOutside} from 'src/shared/components/ClickOutside'
import CustomTimeRange from 'src/shared/components/CustomTimeRange'

interface State {
  expanded: boolean
}

interface Props {
  timeRange: {
    upper: string
    lower: string
  }
  onApplyTimeRange: () => void
}

class CustomTimeRangeDropdown extends PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  public render() {
    const {timeRange, onApplyTimeRange} = this.props

    const {expanded} = this.state

    return (
      <ClickOutside onClickOutside={this.handleCloseDropdown}>
        <div
          className={classnames('dropdown dropdown-280 custom-time-range', {
            open: expanded,
          })}
        >
          <button
            className="btn btn-sm btn-default dropdown-toggle"
            onClick={this.handleToggleDropdown}
          >
            <span className="icon clock" />
            <span className="dropdown-selected">
              {this.lowerTimeRange} — {this.upperTimeRange}
            </span>
            <span className="caret" />
          </button>
          <CustomTimeRange
            onApplyTimeRange={onApplyTimeRange}
            timeRange={timeRange}
            onClose={this.handleCloseDropdown}
          />
        </div>
      </ClickOutside>
    )
  }

  private get upperTimeRange(): string {
    const {timeRange: {upper}} = this.props

    if (upper === 'now()') {
      return moment().format(this.timeFormat)
    }

    return moment(upper).format(this.timeFormat)
  }

  private get lowerTimeRange(): string {
    const {timeRange: {lower}} = this.props
    return moment(lower).format(this.timeFormat)
  }

  private get timeFormat(): string {
    return 'MMM Do HH:mm'
  }

  private handleToggleDropdown = () => {
    this.setState({expanded: !this.state.expanded})
  }

  private handleCloseDropdown = () => {
    this.setState({expanded: false})
  }
}

export default CustomTimeRangeDropdown
