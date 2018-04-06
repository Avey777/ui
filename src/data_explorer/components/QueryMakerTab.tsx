import React, {PureComponent} from 'react'
import classnames from 'classnames'

interface Query {
  rawText: string
}

interface Props {
  isActive: boolean
  query: Query
  onSelect: (index: number) => void
  onDelete: (index: number) => void
  queryTabText: string
  queryIndex: number
}

class QueryMakerTab extends PureComponent<Props> {
  public render() {
    return (
      <div
        className={classnames('query-maker--tab', {
          active: this.props.isActive,
        })}
        onClick={this.handleSelect}
      >
        <label>{this.props.queryTabText}</label>
        <span
          className="query-maker--delete"
          onClick={this.handleDelete}
          data-test="query-maker-delete"
        />
      </div>
    )
  }

  private handleSelect = () => {
    this.props.onSelect(this.props.queryIndex)
  }

  private handleDelete = e => {
    e.stopPropagation()
    this.props.onDelete(this.props.queryIndex)
  }
}

export default QueryMakerTab
