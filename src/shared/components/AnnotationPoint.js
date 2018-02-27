import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {ANNOTATION_MIN_DELTA, EDITING} from 'shared/annotations/helpers'
import * as schema from 'shared/schemas'
import * as actions from 'shared/actions/annotations'
import AnnotationTooltip from 'shared/components/AnnotationTooltip'

class AnnotationPoint extends React.Component {
  state = {
    isMouseOver: false,
    isDragging: false,
  }

  handleMouseEnter = () => {
    this.setState({isMouseOver: true})
  }

  handleMouseLeave = e => {
    const {annotation} = this.props

    if (e.relatedTarget.id === `tooltip-${annotation.id}`) {
      return this.setState({isDragging: false})
    }
    this.setState({isMouseOver: false})
  }

  handleDragStart = () => {
    this.setState({isDragging: true})
  }

  handleDragEnd = () => {
    const {annotation, updateAnnotationAsync} = this.props
    updateAnnotationAsync(annotation)
    this.setState({isDragging: false})
  }

  handleDrag = e => {
    if (this.props.mode !== EDITING) {
      return
    }

    const {pageX} = e
    const {annotation, dygraph, updateAnnotation} = this.props

    if (pageX === 0) {
      return
    }

    const {startTime} = annotation
    const {left} = dygraph.graphDiv.getBoundingClientRect()
    const [startX, endX] = dygraph.xAxisRange()

    const graphX = pageX - left
    let newTime = dygraph.toDataXCoord(graphX)
    const oldTime = +startTime

    if (
      Math.abs(
        dygraph.toPercentXCoord(newTime) - dygraph.toPercentXCoord(oldTime)
      ) *
        100 <
      ANNOTATION_MIN_DELTA
    ) {
      return
    }

    if (newTime >= endX) {
      newTime = endX
    }

    if (newTime <= startX) {
      newTime = startX
    }

    updateAnnotation({
      ...annotation,
      startTime: `${newTime}`,
      endTime: `${newTime}`,
    })

    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const {annotation, mode, dygraph} = this.props
    const {isDragging} = this.state

    const isEditing = mode === EDITING

    const flagClass = isDragging
      ? 'annotation-point--flag__dragging'
      : 'annotation-point--flag'

    const markerClass = isDragging ? 'annotation dragging' : 'annotation'

    const clickClass = isEditing
      ? 'annotation--click-area editing'
      : 'annotation--click-area'

    const left = `${dygraph.toDomXCoord(annotation.startTime) + 16}px`

    return (
      <div className={markerClass} style={{left}}>
        <div
          className={clickClass}
          draggable={true}
          onDrag={this.handleDrag}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <div className={flagClass} />
        <AnnotationTooltip
          isEditing={isEditing}
          timestamp={annotation.startTime}
          annotation={annotation}
          onMouseLeave={this.handleMouseLeave}
          annotationState={this.state}
        />
      </div>
    )
  }
}

AnnotationPoint.propTypes = {
  annotation: schema.annotation.isRequired,
  mode: PropTypes.string.isRequired,
  dygraph: PropTypes.shape({}).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  updateAnnotationAsync: PropTypes.func.isRequired,
}

const mdtp = {
  updateAnnotationAsync: actions.updateAnnotationAsync,
  updateAnnotation: actions.updateAnnotation,
}

export default connect(null, mdtp)(AnnotationPoint)
