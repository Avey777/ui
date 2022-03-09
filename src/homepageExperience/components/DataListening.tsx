// Libraries
import React, {PureComponent} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'

// Apis
import {runQuery} from 'src/shared/apis/query'

// Components
import {ErrorHandling} from 'src/shared/decorators/errors'
import ConnectionInformation, {LoadingState} from './ConnectionInformation'
import {Button} from '@influxdata/clockface'

interface OwnProps {
  bucket: string
}

interface State {
  loading: LoadingState
  timePassedInSeconds: number
  secondsLeft: number
  previousBucket: string
  retry: boolean
}

const MINUTE = 60000
const FETCH_WAIT = 5000
const SECONDS = 60
const TIMER_WAIT = 1000

type Props = RouteComponentProps<{orgID: string}> & OwnProps

@ErrorHandling
class DataListening extends PureComponent<Props, State> {
  private intervalID: ReturnType<typeof setInterval>
  private startTime: number
  private timer: ReturnType<typeof setInterval>

  constructor(props) {
    super(props)

    this.state = {
      loading: LoadingState.NotStarted,
      timePassedInSeconds: 0,
      secondsLeft: SECONDS,
      previousBucket: null,
      retry: false,
    }
  }

  public componentWillUnmount() {
    clearInterval(this.intervalID)
    clearInterval(this.timer)
    this.setState({
      timePassedInSeconds: 0,
      secondsLeft: SECONDS,
    })
  }

  componentDidUpdate() {
    const {bucket} = this.props
    if (
      (bucket !== '<BUCKET>' && this.state.previousBucket !== bucket) ||
      this.state.retry
    ) {
      // clear timer when bucket changes
      clearInterval(this.intervalID)
      clearInterval(this.timer)
      this.setState({
        timePassedInSeconds: 0,
        secondsLeft: SECONDS,
      })
      this.startListeningForData()
      this.setState({previousBucket: bucket, retry: false})
    }
  }

  private handleRetry = () => {
    this.setState({retry: true})
  }

  public render() {
    return (
      <div className="wizard-step--body-streaming" data-testid="streaming">
        {this.connectionInfo}
        {this.state.loading === LoadingState.NotFound && (
          <Button onClick={this.handleRetry} text="Retry" />
        )}
      </div>
    )
  }

  private get connectionInfo(): JSX.Element {
    const {loading} = this.state

    if (loading === LoadingState.NotStarted) {
      return
    }

    return (
      <ConnectionInformation
        loading={this.state.loading}
        bucket={this.props.bucket}
        countDownSeconds={this.state.secondsLeft}
      />
    )
  }

  private startListeningForData = (): void => {
    this.startTimer()
    this.setState({loading: LoadingState.Loading}, () => {
      this.startTime = Number(new Date())
      this.checkForData()
    })
  }

  private checkForData = async (): Promise<void> => {
    const {
      bucket,
      match: {
        params: {orgID},
      },
    } = this.props
    const {secondsLeft} = this.state
    const script = `from(bucket: "${bucket}")
      |> range(start: -1m)`

    let responseLength: number
    let timePassed: number

    try {
      const result = await runQuery(orgID, script).promise

      if (result.type !== 'SUCCESS') {
        throw new Error(result.message)
      }

      // if the bucket is empty, the CSV returned is '\r\n' which has a length of 2
      // so instead,  we check for the trimmed version.
      responseLength = result.csv.trim().length
      timePassed = Number(new Date()) - this.startTime
    } catch (err) {
      this.setState({loading: LoadingState.Error})
      return
    }

    if (responseLength > 1) {
      this.setState({loading: LoadingState.Done})
      return
    }

    if (timePassed >= MINUTE || secondsLeft <= 0) {
      this.setState({loading: LoadingState.NotFound})
      return
    }

    this.intervalID = setTimeout(() => {
      this.checkForData()
    }, FETCH_WAIT)
  }

  private startTimer() {
    this.setState({timePassedInSeconds: 0, secondsLeft: SECONDS})

    this.timer = setInterval(this.countDown, TIMER_WAIT)
  }

  private countDown = () => {
    const {secondsLeft} = this.state
    const secs = secondsLeft - 1
    this.setState({
      timePassedInSeconds: SECONDS - secs,
      secondsLeft: secs,
    })

    if (secs === 0) {
      clearInterval(this.timer)
    }
  }
}

export default withRouter(DataListening)
