import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@material-ui/core"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import ActivityStudents from "staff-app/components/activity-students/activity-students.component.jsx"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activities: Activity[] }>({ url: "get-activities" })
  const [open, setOpen] = React.useState(false)
  const [registers, setRegisters] = useState()

  const handleOpen = (data) => {
    setRegisters(data)
    console.log(registers)
    setOpen(true)
  }

  data?.activity.sort((b, a) => a.date.localeCompare(b.date))

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <S.Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <S.TableHead>
            <TableRow>
              <S.TableCell>ID</S.TableCell>
              <S.TableCell align="center">Roll States</S.TableCell>
              <S.TableCell align="center">Students</S.TableCell>
            </TableRow>
          </S.TableHead>

          <TableBody>
            {loadState === "loaded" && data?.activity && (
              <>
                {data?.activity.map((row) => (
                  <TableRow key={row.entity.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.entity.id}
                    </TableCell>
                    <TableCell align="center">{row.entity.name}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleOpen(row.entity.student_roll_states)}>View Students</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      <ActivityStudents registers={registers} open={open} setOpen={setOpen} />
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u10} auto 0;
  `,

  TableHead: styled(TableHead)`
    && {
      background-color: #343f64;
    }
  `,

  TableCell: styled(TableCell)`
    && {
      color: #ffffff;
    }
  `,
}
