import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { MachineSelectField } from './MachineSelectField'
import { MachineRadioField } from './MachineRadioField'
import { MachineDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

export const MachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const machineList =
    (application?.externalData.machinesList.data as MachineDto[] | undefined) ||
    []

  return (
    <Box paddingTop={2}>
      {machineList.length > 5 ? (
        <MachineSelectField currentMachineList={machineList} {...props} />
      ) : (
        <MachineRadioField currentMachineList={machineList} {...props} />
      )}
    </Box>
  )
}
