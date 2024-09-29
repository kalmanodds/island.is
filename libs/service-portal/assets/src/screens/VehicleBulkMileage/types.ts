export interface VehicleProps {
  vehicleId: string
  vehicleType: string
  lastMileageRegistration?: Date
  submissionStatus: SubmissionState
}

export type SubmissionState =
  | 'idle'
  | 'success'
  | 'failure'
  | 'submit'
  | 'submit-all'
  | 'waiting-success'
  | 'waiting-failure'
  | 'waiting-idle'

export interface Props {
  vehicles: Array<VehicleProps>
}

export interface VehicleType extends VehicleProps {
  mileageUploadedFromFile?: number
  isCurrentlyEditing?: boolean
  registrationHistory?: Array<{
    date: Date
    origin: string
    mileage: number
  }>
}

export interface VehicleList {
  vehicles: Array<VehicleType>
}
