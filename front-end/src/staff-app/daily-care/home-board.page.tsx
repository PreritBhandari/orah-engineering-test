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
import { Input, InputLabel, MenuItem, Select } from "@material-ui/core"
import { useNavigate } from "react-router-dom"
import { saveActiveRoll } from "api/save-active-roll"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [toggleSort, setToggleSort] = useState(false)
  const [namevalue, setNameValue] = React.useState("first_name")

  const [rollStates, setRollStates] = useState({ present: 0, late: 0, absent: 0 })
  const [rollStateClick, setRollStateClick] = useState("")

  const [query, setQuery] = React.useState("")
  const [finalData, setFinalData] = React.useState("")

  const navigate = useNavigate()

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onSearchChange = (event) => {
    const value = event.target.value
    setQuery(value)
    const results = data?.students.filter((item) => {
      const regex = new RegExp(value, "gi")
      let fullname = item.first_name + " " + item.last_name
      return fullname.match(regex)
    })
    setFinalData(results)
  }

  const resultData = finalData.length === 0 && !query ? data?.students : finalData

  const handleNameType = (event) => {
    setNameValue(event.target.value)
  }

  const filteredResultData = resultData?.filter((res) => {
    return rollStateClick === "all"
      ? res.present + res.late + res.absent
      : rollStateClick === "present"
      ? res.present
      : rollStateClick === "late"
      ? res.late
      : rollStateClick === "absent"
      ? res.absent
      : null
  }) 

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
      console.log(resultData)
      console.log(rollStates)
    }

    if (action === "sort") {
      setToggleSort(!toggleSort)
      namevalue === "first_name"
        ? toggleSort
          ? resultData.sort((b, a) => a.first_name.localeCompare(b.first_name))
          : resultData.sort((a, b) => a.first_name.localeCompare(b.first_name))
        : toggleSort
        ? resultData.sort((b, a) => a.last_name.localeCompare(b.last_name))
        : resultData.sort((a, b) => a.last_name.localeCompare(b.last_name))
    }
  }

  const resetRollSet = () => {
    resultData?.filter((roll) => (roll.present = 0))
    resultData?.filter((roll) => (roll.absent = 0))
    resultData?.filter((roll) => (roll.late = 0))
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      resetRollSet()
      setIsRollMode(false)
    }

    if (action === "filter") {
      console.log(data?.students)
      let completedFilter = resultData?.filter((res) => {
        return res.present + res.late + res.absent
      })

      saveActiveRoll(completedFilter)
      navigate("/staff/activity")
    }

    resetRollSet()
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} namevalue={namevalue} handleNameType={handleNameType} toggleSort={toggleSort} onSearchChange={onSearchChange} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && resultData && (
          <>
            {filteredResultData && rollStateClick && isRollMode
              ? filteredResultData.map((s) => <StudentListTile key={s.id} isRollMode={isRollMode} student={s} setRollStates={setRollStates} />)
              : resultData
              ? resultData.map((s) => <StudentListTile key={s.id} isRollMode={isRollMode} student={s} setRollStates={setRollStates} />)
              : null}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} rollStates={rollStates} setRollStateClick={setRollStateClick} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, namevalue, handleNameType, toggleSort, onSearchChange } = props

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
        <S.Input onChange={onSearchChange} sx={{ p: 1 }} placeholder="Search by name" />
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

  Input: styled(Input)`
    && {
      color: #fff;
      muiinputbase-root: {
        color: red;
      }
    }
  `,
}
