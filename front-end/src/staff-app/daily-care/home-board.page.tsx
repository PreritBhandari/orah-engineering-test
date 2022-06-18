import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons"
import { InputLabel, MenuItem, Select } from "@material-ui/core"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [toggleSort, setToggleSort] = useState(false)
  const [namevalue, setNameValue] = React.useState("first_name")

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }

    if (action === "sort") {
      setToggleSort(!toggleSort)
      namevalue === "first_name"
        ? toggleSort
          ? data?.students.sort((b, a) => a.first_name.localeCompare(b.first_name))
          : data?.students.sort((a, b) => a.first_name.localeCompare(b.first_name))
        : toggleSort
        ? data?.students.sort((b, a) => a.last_name.localeCompare(b.last_name))
        : data?.students.sort((a, b) => a.last_name.localeCompare(b.last_name))
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const handleNameType = (event) => {
    setNameValue(event.target.value)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} namevalue={namevalue} handleNameType={handleNameType} toggleSort={toggleSort} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {data.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, namevalue, handleNameType, toggleSort } = props

  return (
    <S.ToolbarContainer>
      <div>
        <S.Select value={namevalue} onChange={handleNameType}>
          <MenuItem value={"first_name"}>By first name</MenuItem>
          <MenuItem value={"last_name"}>By last name</MenuItem>
        </S.Select>
        <S.Button onClick={() => onItemClick("sort")}>
          {toggleSort ? <FontAwesomeIcon size="2x" icon={faAngleDoubleDown} /> : <FontAwesomeIcon size="2x" icon={faAngleDoubleUp} />}
        </S.Button>
      </div>
      <div>
        <input placeholder="Enter Name ..." />
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,

  Select: styled(Select)`
    && {
      padding: 5px;
      color: #fff;
      margin-right: 15px;
    }
  `,
}
