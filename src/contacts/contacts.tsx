import { AddCircle, DeleteOutline } from "@mui/icons-material";
import { Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {ModeEditOutlined} from '@mui/icons-material';
import React, { useState, useEffect } from "react";

export function DataCell (props: {item:string, setItem:React.Dispatch<React.SetStateAction<string>>, isEditable:boolean, alignLeft:boolean}) {
    const {item, setItem, isEditable, alignLeft} = props;
      if (isEditable === true) {
          if (alignLeft === true) {
              return (
                  <TableCell component="th" scope="row">
                      <TextField
                          id="outlined"
                          defaultValue={item}
                          onInput={e => setItem((e.target as HTMLInputElement).value)}
                      />
                  </TableCell>
              );
          }
          return (
              <TableCell align="right">
                  <TextField
                          id="outlined"
                          defaultValue={item}
                          onInput={e => setItem((e.target as HTMLInputElement).value)}
                      />
              </TableCell>
          );
      }
      if (alignLeft === true) {
          return (
              <TableCell component="th" scope="row">{item}</TableCell>
          );
      }
      return (
          <TableCell align="right">{item}</TableCell>
      );
  }

  export function AssociatedContacts(props: {open:boolean, contacts:Contact[], setContacts:React.Dispatch<React.SetStateAction<Contact[]>>, companyId:number}) {
    const {open, contacts, setContacts, companyId} = props;
    const [showExtraContactLine, setShowExtraContactLine] = useState(false);
    const [nextContactId, setNextContactId] = useState(0);

    const associatedContacts = contacts.filter(c => c.companyId === companyId);
  
    function onAddContactClick() {
      const newContacts = contacts.filter(c => c.name !== "");
      const idForNextContact = newContacts[newContacts.length - 1].id + 1;
      setContacts(newContacts);
      setShowExtraContactLine(true);
      setNextContactId(idForNextContact);
      console.log(idForNextContact);
    }
  
    return (
      <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Associated Contacts
                  <Button variant="text" onClick={onAddContactClick}><AddCircle /> Add Contact</Button>
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align='right'>Name</TableCell>
                      <TableCell align='right'>Phone Number</TableCell>
                      <TableCell align="right">Role</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {associatedContacts.map((contact) => (
                      <AssociatedContactRow key={contact.id} contact={contact} contacts={contacts} setContacts={setContacts} isContactEditable={false} setShowExtraContactLine={setShowExtraContactLine} />
                    ))}
                    <ExtraContactLine showExtraContactLine={showExtraContactLine} setShowExtraContactLine={setShowExtraContactLine} contactId={nextContactId} companyId={companyId} contacts={contacts} setContacts={setContacts} />
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
    );
  }
  
  export function AssociatedContactRow(props: {contact:Contact, contacts:Contact[], setContacts:React.Dispatch<React.SetStateAction<Contact[]>>, isContactEditable:boolean, setShowExtraContactLine:React.Dispatch<React.SetStateAction<boolean>>}) {
    const {contact, contacts, setContacts, isContactEditable, setShowExtraContactLine} = props;
    const [contactName, setContactName] = useState("");
    const [contactPhoneNumber, setContactPhoneNumber] = useState("");
    const [contactRole, setContactRole] = useState("");
    const [contactEditable, setContactEditable] = useState(false);
  
    useEffect(()=>{
      setContactName(contact.name);
      setContactPhoneNumber(contact.phoneNumber);
      setContactRole(contact.role);
      setContactEditable(isContactEditable)
  },[])
  
  function onEditContactClick() {
    setContactEditable(true);
  }
  
  function onSaveContactClick() {
    setContactEditable(false);
    let newContacts = contacts;
    const newContact:Contact = {
      id:contact.id,
      name:contactName,
      phoneNumber:contactPhoneNumber,
      role:contactRole,
      companyId:contact.companyId
    }
  
    const index = newContacts.indexOf(contact);
    if (index > -1) {
      newContacts[index] = newContact;
    }
    else {
      newContacts = ([...contacts, newContact]);
    }
    setContacts(newContacts);
    setShowExtraContactLine(false);
  }
  
  function onDeleteContactClick() {  
    const newContacts = [...contacts];
    let index = newContacts.indexOf(contact);
    if (index === -1) {
        const originalContact = contacts.find(c => c.id === contact.id);
        if (originalContact) {
            index = newContacts.indexOf(originalContact);
        }
        else {
            setShowExtraContactLine(false);
        }
    }
    if (index > -1) {
      newContacts.splice(index, 1);
    }
    setContacts(newContacts);
  }
    return (
      <TableRow key={contact.id}>
        <DataCell item={contactName} setItem={setContactName} isEditable={contactEditable} alignLeft={false} />
        <DataCell item={contactPhoneNumber} setItem={setContactPhoneNumber} isEditable={contactEditable} alignLeft={false} />
        <DataCell item={contactRole} setItem={setContactRole} isEditable={contactEditable} alignLeft={false} />
        <TableCell align="right">
          {contactEditable ? <IconButton onClick={onSaveContactClick}><CheckCircleOutlineOutlinedIcon /></IconButton> : <IconButton onClick={onEditContactClick}><ModeEditOutlined /></IconButton>}
          <IconButton onClick={onDeleteContactClick}><DeleteOutline /></IconButton>
        </TableCell>
      </TableRow>
    );
  }
  
  export function ExtraContactLine(props: {showExtraContactLine:boolean, setShowExtraContactLine:React.Dispatch<React.SetStateAction<boolean>>, contactId:number, companyId:number, contacts:Contact[], setContacts:React.Dispatch<React.SetStateAction<Contact[]>>}) {
    const {showExtraContactLine, setShowExtraContactLine, contactId, companyId, contacts, setContacts} = props;
    if (showExtraContactLine === true && contactId > -1) {
      const contact = {id:contactId, name:"", phoneNumber:"", role:"", companyId:companyId}
      return (
        <AssociatedContactRow key={contactId} contact={contact} contacts={contacts} setContacts={setContacts} isContactEditable={true} setShowExtraContactLine={setShowExtraContactLine} />
      );
    }
    return (<React.Fragment></React.Fragment>);
  }