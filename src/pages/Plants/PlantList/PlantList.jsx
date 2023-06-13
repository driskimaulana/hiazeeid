import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Axios from 'axios';
import {
  CircularProgress, Backdrop, TextField, Table,
  TableBody, TableCell, Box, TableContainer, TableHead, TablePagination,
  TableRow, Toolbar, Typography, Paper, Checkbox, IconButton, Select,
  MenuItem, Fab,
  Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';

const headCells = [
  {
    id: 'localname',
    numeric: false,
    disablePadding: true,
    label: 'Nama Local',
  },
  {
    id: 'about',
    numeric: false,
    disablePadding: true,
    label: 'Tentang',
  },
  {
    id: 'scientificname',
    numeric: false,
    disablePadding: false,
    label: 'Nama Ilmiah',
  },
  {
    id: 'family',
    numeric: false,
    disablePadding: false,
    label: 'Keluarga',
  },
  {
    id: 'odo',
    numeric: false,
    disablePadding: false,
    label: 'Ordo',
  },

];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick, numSelected, rowCount,
  } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >

            {headCell.label}

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    handleDelete,
    setSearchValue,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity,
          ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected}
          {' '}
          selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
          fontWeight="bold"
        >
          Bunga
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <TextField
          sx={{
            borderRadius: '20px',
          }}
          size="small"
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            endAdornment: (

              <Icon icon="ic:outline-search" />
            ),
            style: (
              {
                borderRadius: '20px',
              }
            ),
          }}
        />
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default function PlatList() {
  const [loading, setLoading] = useState(true);
  const handleStopLoading = () => {
    setLoading(false);
  };

  const handleStartLoading = () => {
    setLoading(true);
  };
  // get users data from backend
  const [users, setUsers] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [totalPage, settotalPage] = useState(0);
  const [totalItem, settotalItem] = useState(0);

  const [count, setCount] = useState(0);
  const getData = async () => {
    await Axios.get('https://dev-bibitunggulid-zldx7crkfq-et.a.run.app/plants?page=1').then(
      (response) => {
        console.log(response);
        handleStopLoading();
        setPage(1);
        settotalItem(response.data.totalCount);
        // totalItem(response.data.totalCount);
        settotalPage(response.data.totalPages);
        setUsers(response.data.data);
        setVisibleData(response.data.data);
      },
    );
  };

  useEffect(() => {
    getData();
  }, [count]);

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = users.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleDelete = async () => {
    handleStartLoading();
    await Axios.delete(
      'https://dev-bibitunggulid-zldx7crkfq-et.a.run.app/plants',
      { data: { id: selected } },
    ).then((response) => {
      setCount(Math.random());
      setSelected([]);
      handleStopLoading();
    });
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  //   const emptyRows = page > 0 ? Math.max(0, (1 + page) * 10 - users.length) : 0;

  const handleChangePage = async () => {
    await Axios.get(`https://dev-bibitunggulid-zldx7crkfq-et.a.run.app/plants?page=${page + 1}`).then(
      (response) => {
        console.log(response);
        handleStopLoading();
        setPage(1);
        settotalItem(response.data.totalCount);
        // totalItem(response.data.totalCount);
        settotalPage(response.data.totalPages);
        setUsers(response.data.data);
        setVisibleData(response.data.data);
      },
    );
  };

  const handleChangeRowsPerPage = () => {

  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          handleDelete={handleDelete}
          numSelected={selected.length}
          setSearchValue={setSearchValue}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={users.length}
            />
            <TableBody>
              {
                    visibleData
                      .filter((data) => data.localName.match(new RegExp(searchValue, 'i')))
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.localName}
                            </TableCell>
                            <TableCell align="left">{row.about}</TableCell>
                            <TableCell align="left">{row.scienceName}</TableCell>
                            <TableCell align="left">{row.family}</TableCell>
                            <TableCell align="left">{row.kingdom}</TableCell>
                            <TableCell align="left">{row.kingdoorder}</TableCell>
                          </TableRow>
                        );
                      })
                }

              {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={10}
          component="div"
          count={totalPage}
          rowsPerPage={page - 1}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Fab
        sx={{
          position: 'fixed',
          top: 30,
          right: 70,
          backgroundColor: '#0FB203',
        }}
        color="secondary"
        href="/dashboard/plants/add"
      >
        <Icon icon="solar:add-square-broken" color="#fff" height="30px" />
      </Fab>

    </Box>
  );
}
