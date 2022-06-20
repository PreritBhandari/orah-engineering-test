import React, { useState } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Images } from "assets/images"
import { Colors } from "shared/styles/colors"
import { Person, PersonHelper } from "shared/models/person"
import { Roll } from "shared/models/roll"
import { RollStateSwitcher } from "staff-app/components/roll-state/roll-state-switcher.component"

interface Props {
  isRollMode?: boolean
  student: Person
}

var finalData = []

export const StudentListTile: React.FC<Props> = ({ isRollMode, student, setRollStates }) => {
  const onStateChange = (next) => {
    let newList = []
    student.present = 0
    student.late = 0
    student.absent = 0

    next === "present" ? (student.present += 1) : next === "late" ? (student.late += 1) : next === "absent" ? (student.absent += 1) : null

    newList.push(student)
    let index = finalData ? finalData.findIndex((i) => i[0].id == student.id) : null
    index === -1 ? finalData.push(newList) : null

    let present = finalData.filter((res) => res[0].present === 1)
    let absent = finalData.filter((res) => res[0].absent === 1)
    let late = finalData.filter((res) => res[0].late === 1)

    let rollStates = [present.length, late.length, absent.length]
    // localStorage.setItem("rollStates", JSON.stringify(rollStates))
    setRollStates(rollStates)
    // localStorage.setItem("rollData", JSON.stringify(finalData))
  }
  return (
    <S.Container>
      <S.Avatar url={Images.avatar}></S.Avatar>
      <S.Content>
        <div>{PersonHelper.getFullName(student)}</div>
      </S.Content>
      {isRollMode && (
        <S.Roll>
          <RollStateSwitcher onStateChange={onStateChange} />
        </S.Roll>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Avatar: styled.div<{ url: string }>`
    width: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
  Roll: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u4};
  `,
}
