import {Residence} from "../../app/models/residence";
import {Message, User} from "../../app/models/user";
import {Box, Button, Dialog, DialogContent, Divider, IconButton, Paper, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ReplyIcon from '@mui/icons-material/Reply';
import {Link} from "react-router-dom";
import MessageIcon from "@mui/icons-material/Message";
import React, {useState} from "react";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

interface Prop{
    message : Message;
}

export default function MessageCard({message}:Prop) {
    const [open, setOpen] = useState(false); // State to control the dialog
    const [replyText, setReplyText] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReply = () => {
        if (replyText.trim() === '') {
            // Show a toast notification if replyText is empty
            toast.error('Please enter a reply message.');
            return; // Do not proceed with empty reply
        }
        const formData = new FormData();
        formData.append('messageBody', replyText);
        formData.append('recipientUsername', message.senderUsername);
        if(message.residenceTitle)formData.append('residenceTitle', message.residenceTitle);
        agent.Account.postUserMessage(formData).then(() => {
            toast.success("Message sent!")})
            .catch(errors => console.log(errors));
        handleClose(); // Close the dialog after replying
    };


    return (
        <>
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px', width: '400px' }}>
                <IconButton component={Link} to="/messages" color="inherit" onClick={handleClickOpen}>
                    <ReplyIcon/>
                </IconButton>
                <Grid container spacing={2}>
                    <Grid item>
                        <Avatar alt={message.senderUsername} src={message.senderImageURL} />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant="h6">{message.senderUsername}: {message.residenceTitle}</Typography>
                        <Typography
                            variant="body1"
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',  // Limit to the available space
                                width: '100%',     // Ensure it takes full available width
                            }}
                        >
                            {message.message}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Typography variant="h6"> By {message.senderUsername} :</Typography>
                    <Box
                        border={1}
                        borderColor="grey.300"
                        borderRadius={5}
                        p={2}
                        maxHeight="400px"
                        overflow="auto"
                    >
                        <Typography variant="body1">{message.message}</Typography>
                    </Box>
                    <Divider sx={{ marginY: 2 }} />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Your Reply"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Divider sx={{ marginY: 1 }} />
                    <Button variant="contained" color="primary" onClick={handleReply}>
                        Reply
                    </Button>
                </DialogContent>
            </Dialog>
        </>

    );
};