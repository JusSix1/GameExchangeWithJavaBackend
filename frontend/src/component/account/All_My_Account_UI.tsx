import * as React from 'react';
import { DataGrid, FilterColumnsArgs, GetColumnForNewFilterArgs, GridColDef, GridRowSelectionModel, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Snackbar, TextField } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import Moment from 'moment';

import ip_address from '../ip';
import { AccountsInterface } from '../../models/account/IAccount';
import UserFullAppBar from '../FullAppBar/UserFullAppBar';
import { GamesInterface } from '../../models/account/IGame';

export default function All_My_Account_UI() {
    const [account, setAccount] = React.useState<AccountsInterface[]>([]);
    const [importAccount, setImportAccount] = React.useState<Partial<AccountsInterface>>({});
    const [game, setGame] = React.useState<GamesInterface[]>([]);

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
    const [dialogCreateOpen, setDialogCreateOpen] = React.useState(false);
    const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);

    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    Moment.locale('th');

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
                csvOptions={{
                    fileName: 'MyAccountGame',
                    utf8WithBom: true,
                }}
            />
          </GridToolbarContainer>
        );
      }

    const columns: GridColDef[] = [
        { field: 'ID_Account', headerName: 'ID', width: 70},
        { field: 'Game', headerName: 'Game', width: 200, valueFormatter: params => String(params?.value.Name)},
        { field: 'Game_Account', headerName: 'Game Account', width: 200},
        { field: 'Game_Password', headerName: 'Game password', width: 200 },
        { field: 'Email', headerName: 'Email', width: 200 },
        { field: 'Email_Password', headerName: 'Email password', width: 200 },
    ];   

    const filterColumns = ({ field, columns, currentFilters }: FilterColumnsArgs) => {
        // remove already filtered fields from list of columns
        const filteredFields = currentFilters?.map((item) => item.field);
        return columns
        .filter(
        (colDef) =>
            colDef.filterable &&
            (colDef.field === field || !filteredFields.includes(colDef.field)),
        )
        .map((column) => column.field);
    };

    const getColumnForNewFilter = ({
        currentFilters,
        columns,
        }: GetColumnForNewFilterArgs) => {
            const filteredFields = currentFilters?.map(({ field }) => field);
            const columnForNewFilter = columns
            .filter(
                (colDef) => colDef.filterable && !filteredFields.includes(colDef.field),
                )
            .find((colDef) => colDef.filterOperators?.length);
            return columnForNewFilter?.field ?? null;
    };

    const isOptionEqualToValue = (option: { ID: any; }, value: { ID: any; }) => {
        return option.ID === value.ID;
      };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
        ) => {
            if (reason === "clickaway") {
            return;
            }
            setSuccess(false);
            setError(false);
            setErrorMsg("")
    };      

    const handleDialogCreateClickOpen = () => {
        setDialogCreateOpen(true);
    };

    const handleDialogCreateClickClose = () => {
        setDialogCreateOpen(false);
    };

    const handleDialogDeleteClickOpen = () => {
        setDialogDeleteOpen(true);
    };

    const handleDialogDeleteClickClose = () => {
        setDialogDeleteOpen(false);
    };
      
    const getAccount = async () => {
        const apiUrl = ip_address() + "/all-account/"+localStorage.getItem('email'); // email คือ email ที่ผ่านเข้ามาทาง parameter
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
       
        await fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setAccount(res.data); 
                }
            });
    };

    const getGame = async () => {
        const apiUrl = ip_address() + "/games";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
       
        await fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setGame(res.data);
                }
            });
      };

    const CreateAccount = async () => {   

        setDialogLoadOpen(true);

        let data = {       //ประกาศก้อนข้อมูล                                                    
            Game_Account:       importAccount.Game_Account,            
            Game_Password:  	importAccount.Game_Password,        
            Email:             	importAccount.Email,         
            Email_Password:    	importAccount.Email_Password,                       
            Game_ID: 			importAccount.Game_ID,
        };

        const apiUrl = ip_address() + "/account/"+localStorage.getItem('email');                      //ส่งขอการเพิ่ม
        const requestOptions = {     
            method: "POST",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
            body: JSON.stringify(data),
        };

        await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then(async (res) => {      
            if (res.data) {
                setSuccess(true);
                handleDialogCreateClickClose();
                getAccount();
                setImportAccount({});
            } else {
                setError(true);  
                setErrorMsg(" - "+res.error);  
            }
        });
        setDialogLoadOpen(false);
        
    }


    const DeleteAccount = async () => {    

        setDialogLoadOpen(true);

        var dataArr = [];

        for (var i = 0; i < rowSelectionModel.length; i++) {
            dataArr.push({
                ID:                 rowSelectionModel[i],
            });
        }

        const apiUrl = ip_address() + "/account";                      //ส่งขอการแก้ไข
        const requestOptions = {     
            method: "DELETE",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
            body: JSON.stringify(dataArr),
        };

        await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then(async (res) => {      
            if (res.data) {
                setSuccess(true);
                handleDialogDeleteClickClose();
                getAccount();
            } else {
                setError(true);  
                setErrorMsg(" - "+res.error);  
            }
        });
        setDialogLoadOpen(false);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            setDialogLoadOpen(true);
            await getAccount();
            await getGame();
            setDialogLoadOpen(false);
        }
        fetchData();
    }, []);

    return (
        <><UserFullAppBar /><Grid>
            <Snackbar //ป้ายบันทึกสำเร็จ

                open={success}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">
                    Succes
                </Alert>
            </Snackbar>

            <Snackbar //ป้ายบันทึกไม่สำเร็จ

                open={error}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    Error {errorMsg}
                </Alert>
            </Snackbar>

            <Grid container sx={{ padding: 2 }}>
                <div style={{ height: 540, width: '100%' }}>
                    <DataGrid
                        rows={account}
                        getRowId={(row) => row.ID}
                        slots={{ toolbar: CustomToolbar }}
                        columns={columns}
                        slotProps={{
                            filterPanel: {
                                filterFormProps: {
                                    filterColumns,
                                },
                                getColumnForNewFilter,
                            },
                        }}
                        checkboxSelection
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        } }
                        rowSelectionModel={rowSelectionModel} 
                        disableRowSelectionOnClick
                        />
                        
                </div>
            </Grid>

            <Grid container sx={{ padding: 2 }}>
                <Grid sx={{ padding: 2 }}>
                    <Button size='small' variant="contained" color="primary" onClick={() => handleDialogCreateClickOpen()}>Add Account</Button>
                </Grid>
                <Grid sx={{ padding: 2 }}>
                    <Button size='small' variant="contained" color="error" onClick={() => handleDialogDeleteClickOpen()}>Delete Account</Button>
                </Grid>
            </Grid>

            <Dialog
                open={dialogCreateOpen}
                onClose={handleDialogCreateClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add an Account"}
                </DialogTitle>

                <DialogContent>
                    <Box>
                        <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
                            <Grid container>
                                <Grid container>
                                    <Grid margin={1} item xs={1}>
                                        Game
                                    </Grid>
                                    <Grid margin={1} item xs={5}>
                                        <Autocomplete
                                            id="game-autocomplete"
                                            options={game}
                                            fullWidth
                                            size="small"
                                            onChange={(event: any, value) => {
                                                setImportAccount({ ...importAccount, Game_ID: value?.ID }); //Just Set ID to interface
                                            }}
                                            getOptionLabel={(option: any) =>
                                                `${option.Name}`
                                            } //filter value
                                            renderInput={(params: any) => {
                                                return (
                                                    <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search..."
                                                    />
                                                );
                                            }}
                                            renderOption={(props: any, option: any) => {
                                                return (
                                                    <li
                                                        {...props}
                                                        value={`{option.ID}} key={${option.ID}`}
                                                    >
                                                        {`${option.Name}`}
                                                    </li>
                                                ); //display value
                                            }}
                                            isOptionEqualToValue={isOptionEqualToValue}
                                        />
                                    </Grid>
                                </Grid>
                                <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
                                    <Grid>
                                        Game account
                                    </Grid>
                                    <Grid container>
                                        <Grid margin={1} item xs={5}>
                                            <TextField
                                                fullWidth
                                                id="game_account"
                                                label="Account"
                                                type='string'
                                                variant="outlined"
                                                onChange={(event) => setImportAccount({...importAccount, Game_Account: event.target.value})}
                                            />
                                        </Grid>
                                        <Grid margin={1} item xs={5}>
                                            <TextField
                                                fullWidth
                                                id="game_password"
                                                label="Password"
                                                type='string'
                                                variant="outlined"
                                                onChange={(event) => setImportAccount({...importAccount, Game_Password: event.target.value})}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
                                    <Grid>
                                        Email account
                                    </Grid>
                                <Grid container>
                                    <Grid margin={1} item xs={5}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            label="Email"
                                            type='string'
                                            variant="outlined"
                                            onChange={(event) => setImportAccount({...importAccount, Email: event.target.value})}
                                        />
                                    </Grid>
                                    <Grid margin={1} item xs={5}>
                                        <TextField
                                            fullWidth
                                            id="email_password"
                                            label="Password"
                                            type='string'
                                            variant="outlined"
                                            onChange={(event) => setImportAccount({...importAccount, Email_Password: event.target.value})}
                                        />
                                    </Grid>
                                </Grid>
                                </Paper>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={handleDialogCreateClickClose}>Cancel</Button>
                    <Button size='small' onClick={CreateAccount} color="error" autoFocus>Import</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dialogDeleteOpen}
                onClose={handleDialogCreateClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Account"}
                </DialogTitle>
                <DialogActions>
                    <Button size='small' onClick={handleDialogDeleteClickClose}>Cancel</Button>
                    <Button size='small' onClick={DeleteAccount} color="error" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={dialogLoadOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Loading..."}
                </DialogTitle>
            </Dialog>

        </Grid></>
    );
}