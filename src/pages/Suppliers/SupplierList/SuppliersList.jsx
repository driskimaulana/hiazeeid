import * as React from 'react';
import { useState, useEffect } from 'react';

import {
  Typography, Box, Grid, Fab, CircularProgress,
  FormControlLabel, Checkbox, FormControl, InputLabel,
  Select, MenuItem, TextField, Card, CardMedia, CardContent,
  CardActionArea,
} from '@mui/material';

import { Icon } from '@iconify/react';
import Axios from 'axios';
import ProductCard from '../../../components/ProductCard/ProductCard';

const SupplierCard = (props) => {
  const {
    id, name, imgUrl, city,
  } = props;

  return (
    <Card sx={{
      maxWidth: '300px',
      backgroundColor: '#fbfbfb',
    }}
    >
      <CardActionArea href={`/dashboard/products/${id}`}>
        <CardMedia image={imgUrl} sx={{ height: '250px' }} />
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
        >
          <Typography variant="p" fontWeight="600" fontSize="14pt">{name}</Typography>
          <Typography variant="p" fontSize="10pt" color="green" sx={{ }}>Active</Typography>
          <Box display="flex" alignItems="center" columnGap="5px">
            <Icon icon="carbon:location-filled" />
            <Typography variant="p" fontSize="10pt" color="" sx={{ }}>{city}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const SearchBox = (props) => {
  const { setSearchValue } = props;
  return (
    <TextField
      onChange={(e) => setSearchValue(e.target.value)}
      sx={{
        borderRadius: '20px',
      }}
      size="small"
      InputProps={{
        endAdornment: <Icon icon="ic:outline-search" />,
        style: {
          borderRadius: '20px',
        },
      }}
    />
  );
};
const SupplierList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [price, setPrice] = React.useState('');
  const handleChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'Tertinggi') {
      prods.sort((a, b) => b.price - a.price);
    } else if (selectedValue === 'Terendah') {
      prods.sort((a, b) => a.price - b.price);
    }

    setPrice(selectedValue);
  };
  const handleChangeNewest = (event) => {
    const isChecked = event.target.checked;
    console.log(isChecked);

    if (isChecked) {
      // Sort the prods array in descending order of createdAt
      const sortedProds = [...prods].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setprods(sortedProds);
      console.log(sortedProds);
    } else {
      // Reset the prods array to its default order
      const defaultOrder = [...prods].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setprods(defaultOrder);
      console.log(defaultOrder);
    }
  };

  const [prods, setprods] = useState(null);

  useEffect(() => {
    if (prods !== null) {
      console.log(price);
      setprods(prods.sort((a, b) => {
        if (price === 'Tertinggi') {
          return a.price - b.price;
        }
        return a.price + b.price;
      }));
    }
  }, [price]);

  useEffect(() => {
    // Axios.get('http://localhost:5000/product/').then((response) => {
    Axios.get('https://dev-bibitunggulid-zldx7crkfq-et.a.run.app/suppliers/').then((response) => {
      console.log(response);
      setprods(response.data.data);
    });
  }, []);

  return (
    <Box sx={{
      paddingInline: '50px',
    }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary">
        Supplier
        {/* {' '}
        {prods[0].name} */}
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        justifyContent: 'space-between',
        padding: '10px 20px',
        borderRadius: '20px',
        marginTop: '30px',
      }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '10px',
            alignItems: 'center',
          }}
        >
          <Icon icon="material-symbols:filter-list-rounded" height={20} />
          <Box
            sx={{
              display: 'flex',
              columnGap: '20px',
              alignItems: 'center',
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
              <InputLabel id="select-harga">Harga</InputLabel>
              <Select
                labelId="price"
                id="price"
                value={price}
                label="Price"
                onChange={handleChange}
              >
                <MenuItem value="Tertinggi">Tertinggi</MenuItem>
                <MenuItem value="Terendah">Terendah</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox onChange={handleChangeNewest} />
                  }
              label="Terbaru"
            />
          </Box>
        </Box>
        <div>
          <SearchBox setSearchValue={setSearchValue} />
        </div>
      </Box>

      {
        prods == null ? <CircularProgress />
          : (
            <Grid
              container
              sx={{
                marginTop: '30px',
              }}
              spacing={2}
            >

              {
               prods.map((product, index) => (
                 <Grid key={index} item md={3}>
                   <SupplierCard
                     id={product.id}
                     name={product.companyName}
                     imgUrl={product.logo}
                     city={product.city}
                   />
                 </Grid>
               ))
          }

            </Grid>
          )
      }
      <Fab
        sx={{
          position: 'fixed',
          top: 30,
          right: 70,
          backgroundColor: '#0FB203',
        }}
        color="secondary"
        href="/dashboard/suppliers/add"
      >
        <Icon icon="solar:add-square-broken" color="#fff" height="30px" />
      </Fab>
    </Box>
  );
};

export default SupplierList;
