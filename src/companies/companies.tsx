import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { AssociatedContacts, DataCell } from "../contacts/contacts";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export function CollapsibleTable(props: {companies: Company[], setCompanies: React.Dispatch<React.SetStateAction<Company[]>>, filteredCompanies:Company[], contacts: Contact[], setContacts: React.Dispatch<React.SetStateAction<Contact[]>>, showExtraLine:boolean, setShowExtraLine:React.Dispatch<React.SetStateAction<boolean>>, nextId:number}) {
  const {companies, setCompanies, filteredCompanies, contacts, setContacts, showExtraLine, setShowExtraLine, nextId} = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCompanies.map((company) => (
            <CompanyRow key={company.id} company={company} companies={companies} setCompanies={setCompanies} contacts={contacts} setContacts={setContacts} isRowEditable={false} setShowExtraLine={setShowExtraLine} />
          ))}
          <ExtraLine showExtraLine={showExtraLine} companyId={nextId} companies={companies} setCompanies={setCompanies} contacts={contacts} setContacts={setContacts} setShowExtraLine={setShowExtraLine} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}


function CompanyRow(props: { company: Company, companies:Company[], setCompanies: React.Dispatch<React.SetStateAction<Company[]>>, contacts: Contact[], setContacts: React.Dispatch<React.SetStateAction<Contact[]>>, isRowEditable: boolean, setShowExtraLine:React.Dispatch<React.SetStateAction<boolean>>}) {
    const { company, companies, setCompanies, contacts, setContacts, isRowEditable, setShowExtraLine } = props;
    const [open, setOpen] = React.useState(false);
    const [editable, setEditable] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(()=>{
        setName(company.name);
        setPhoneNumber(company.phoneNumber);
        setAddress(company.address);
        setEditable(isRowEditable);
    },[])

    function onEditCompanyClick() {
        setEditable(true);
    }

    function onSaveCompanyClick() {
        setEditable(false);
        let newCompanies = companies;
        const newCompany:Company = {
        id:company.id,
        name:name,
        address:address,
        phoneNumber:phoneNumber
        }

        const index = newCompanies.indexOf(company);
        if (index > -1) {
        newCompanies[index] = newCompany;
        }
        else {
        newCompanies = companies.concat(newCompany);
        }
        setCompanies(newCompanies);
        setShowExtraLine(false);
    }

    function onDeleteCompanyClick() {
        const newCompanies = companies;
        let index = newCompanies.indexOf(company);
        if (index === -1) {
            const originalCompany = newCompanies.find(c => c.id === company.id);
            if (originalCompany) {
                index = newCompanies.indexOf(originalCompany);
            }
            else {
                setShowExtraLine(false);
            }
        }
        if (index > -1) {
            newCompanies.splice(index, 1);
            setCompanies(newCompanies);

            const newContacts = contacts.filter(c => c.companyId !== company.id);
            setContacts(newContacts);
        }
    }

    return (
        <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            </TableCell>
            <DataCell item={name} isEditable={editable} alignLeft={true} setItem={setName}  />
            <DataCell item={address} isEditable={editable} alignLeft={false} setItem={setAddress} />
            <DataCell item={phoneNumber} isEditable={editable} alignLeft={false} setItem={setPhoneNumber} />
            <TableCell align="right">
            {editable ? <IconButton onClick={onSaveCompanyClick}><CheckCircleOutlineOutlinedIcon /></IconButton> : <IconButton onClick={onEditCompanyClick}><ModeEditIcon /></IconButton>}
            <IconButton onClick={onDeleteCompanyClick}><DeleteIcon /></IconButton>
        </TableCell>
        </TableRow>
        <AssociatedContacts open={open} contacts={contacts} setContacts={setContacts} companyId={company.id} />
        
        </React.Fragment>
    );
}

export function ExtraLine(props: {showExtraLine:boolean, setShowExtraLine:React.Dispatch<React.SetStateAction<boolean>>, companyId:number, companies:Company[], contacts:Contact[], setCompanies:React.Dispatch<React.SetStateAction<Company[]>>, setContacts:React.Dispatch<React.SetStateAction<Contact[]>>}) {
    const {showExtraLine, setShowExtraLine, companyId, companies, setCompanies, contacts, setContacts} = props;
    if (showExtraLine === true && companyId > 0) {
        const company = {id:companyId, name:"", address:"", phoneNumber:""};
        return (
            <CompanyRow key={companyId} company={company} companies={companies} setCompanies={setCompanies} contacts={contacts} setContacts={setContacts} isRowEditable={true} setShowExtraLine={setShowExtraLine} />
        );
    }
    return (<React.Fragment></React.Fragment>);
}
  