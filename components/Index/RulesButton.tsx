import { IEvent } from '@/app/models/event';
import { Notes } from '@mui/icons-material';
import { Box, Button, List, ListItemText, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';

interface RulesButtonProps {
  event?: IEvent;
}

export default function RulesButton(props: RulesButtonProps) {

  const event = props.event;

  const eventExists = event !== undefined && event !== null;
  const rulesExists =
    event?.rules !== undefined &&
    event?.exchange !== null &&
    event.rules?.length || 0 > 0;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return <div>
    <Button startIcon={<Notes />}
      type="button"
      variant="contained"
      color="warning"
      onClick={handleOpen}
      className={(eventExists && rulesExists) ? "block" : "hidden"}>
      Rules
    </Button>
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
        width: { xs: '90vw' }
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">Rules</Typography>
        <List>
          {event?.rules && event.rules.map((rule, index) => <ListItemText key={index}>- {rule}</ListItemText>)}
        </List>
      </Box>
    </Modal>
  </div>
}
