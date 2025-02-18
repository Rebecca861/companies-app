import * as React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Fab } from '@mui/material';
import { sampleCompanies, sampleContacts } from "../data";
import { useEffect, useState } from "react";
import { CollapsibleTable } from '../companies/companies';



export function Home(props: {searchString:string}) {
  const {searchString} = props;
    const [companies, setCompanies] = useState(sampleCompanies);
    const [contacts, setContacts] = useState(sampleContacts);
    const [filteredCompanies, setFilteredCompanies] = useState(sampleCompanies);
    const [showExtraLine, setShowExtraLine] = useState(false);
    const [nextId, setNextId] = useState(0);
    function onAddCompanyClick() {
      const newCompanies = companies.filter(c => c.name !== "");
      const nextCompanyId = newCompanies[newCompanies.length - 1].id + 1;
      setCompanies(newCompanies);
      setShowExtraLine(true);
      setNextId(nextCompanyId);
    }

  useEffect(() => {
    if (searchString.length > 0) {
    setFilteredCompanies(companies.filter(c => c.name.toLowerCase().includes(searchString.toLowerCase())));
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchString, companies]);    

    return (
        <React.Fragment>
        <div style={{width:'75%', height:'75%', margin:'10px auto'}}>
            <CollapsibleTable companies={companies} setCompanies={setCompanies} filteredCompanies={filteredCompanies} contacts={contacts} setContacts={setContacts} showExtraLine={showExtraLine} setShowExtraLine={setShowExtraLine} nextId={nextId} />    
        </div>
        <Fab variant="extended" style={{backgroundColor:'#1976d2', color:'white'}} onClick={onAddCompanyClick}>
            <AddCircleOutlineIcon />
             Add Company
        </Fab>
        </React.Fragment>
    );
}



