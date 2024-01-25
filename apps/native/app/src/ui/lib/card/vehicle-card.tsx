import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import chevronForward from '../../assets/icons/chevron-forward.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing[3]}px;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  align-items: center;
  justify-content: space-between;
`

const Content = styled.View`
  flex: 1;
  align-items: flex-start;
`

const Title = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    lineHeight: 24,
    fontSize: 18,
  })}
`

const Text = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
    fontSize: 16,
  })}
`

const Icon = styled.View`
  margin-left: auto;
`

interface VehicleCardProps {
  title?: string | null
  color?: string | null
  number?: string | null
  label?: React.ReactNode
}

export function VehicleCard({ title, color, number, label }: VehicleCardProps) {
  return (
    <Host>
      <Content>
        <Title>{title}</Title>
        <Text>
          {color} - {number}
        </Text>
        {label}
      </Content>
      <Icon>
        <Image source={chevronForward} style={{ width: 24, height: 24 }} />
      </Icon>
    </Host>
  )
}
