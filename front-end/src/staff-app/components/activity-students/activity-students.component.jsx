import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import Modal from "@material-ui/core/Modal"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Divider } from "@material-ui/core"
import { PersonHelper } from "shared/models/person"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIconActivity } from "../roll-state/roll-state-activity.component"

export default function ActivityStudents({ registers, open, setOpen }) {
  const handleClose = () => setOpen(false)
  registers?.sort((a, b) => a.first_name.localeCompare(b.first_name))

  return (
    <div>
      <CenteredContainer>
        <Modal open={open} onClose={handleClose}>
          <S.Box>
            <S.Typography id="modal-modal-title" variant="h6" component="h2">
              Student Report
            </S.Typography>
            <Divider />
            <S.Typography2 id="modal-modal-description" sx={{ mt: 2 }}>
              {registers?.map((res) => (
                <S.Container key={res.id}>
                  <S.Content>
                    <span>{PersonHelper.getFullName(res)}</span>
                    <RollStateIconActivity type={res.present === 1 ? "present" : res.late === 1 ? "late" : res.absent === 1 ? "absent" : null} />
                  </S.Content>
                </S.Container>
              ))}
            </S.Typography2>
          </S.Box>
        </Modal>
      </CenteredContainer>
    </div>
  )
}

const S = {
  Box: styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    /* height: 90%; */
    background-color: white;
    box-shadow: 24;
    padding: 4;
    color: black;
    text-align: left;
    border-radius: 4px;
  `,

  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: whitesmoke;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,

  Content: styled.span`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
    display: flex;
    justify-content: space-between;
    width: 100%;
  `,

  Typography: styled(Typography)`
    background-color: #343f64;
    color: white;
    padding: 15px;
    font-size: 18px !important;
    text-align: center;
  `,

  Typography2: styled(Typography)`
    padding: 10px;
    font-size: 18px !important;
    color: black;
    overflow: scroll;
    max-height: 500px;
  `,
}
