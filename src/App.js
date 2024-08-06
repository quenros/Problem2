import { TextField, Box, Select, Stack, Button, MenuItem, ListItemIcon, List, ListItem, ListItemButton, ListItemText, DialogTitle, Dialog, Card, Typography, CircularProgress} from "@mui/material";
import PropTypes from 'prop-types';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import React, { useState, useEffect } from "react";


function App() {
  const [currencies, setCurrencies] = useState([]);
  const [currencyNames, setCurrencyNames] = useState([]);
  const [selectedBuyingCurrency, setBuyingSelectedCurrency] = useState("");
  const [selectedSellingCurrency, setSelectedSellingCurrency] = useState("");
  const [selectedBuyingCurrencyPrice, setBuyingSelectedCurrencyPrice] = useState(0);
  const [selectedSellingCurrencyPrice, setSelectedSellingCurrencyPrice] = useState(0);
  const [inputBuyingValue, setInputBuyingValue] = useState(0);
  const [inputSellingValue, setInputSellingValue] = useState(0);
  const [convertedBuyingPrice, setConvertedBuyingPrice] = useState();
  const [convertedSellingPrice, setConvertedSellingPrice] = useState();

  const convertType = ['Sell to Buy', 'Buy to Sell'];
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(convertType[0]);

  const [loading, setLoading] = useState(false);

   const fetchData = async ()=>{
      fetch('https://interview.switcheo.com/prices.json')
      .then(response => response.json())
      .then(data => {
        // const currencies = data.map(item=>item.currency)
        //I will sort the json data first, to remove duplicates and only take the currencies that are updated by the latest date.
        //This way, it will be much easier to populate the Select UIs and ensure that our data has "integrity"
        //https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestPrices = {};
        sortedData.forEach(item => { 
          if (!latestPrices[item.currency] || new Date(item.date) > new Date(latestPrices[item.currency].date)) {
            latestPrices[item.currency] = item;
          }
        });
        setCurrencies(latestPrices)
        const currencies = Object.keys(latestPrices);
        setCurrencyNames(currencies); 
      

      });
   }


  useEffect(() => {
    fetchData()
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };
      
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Select Conversion Type</DialogTitle>
        <List sx={{ pt: 0,
          marginLeft: 1
         }}>

            <ListItem disableGutters key={"Sell"}>
              <ListItemButton onClick={() => handleListItemClick("Sell to Buy")}>
              <ListItemIcon>
                 <ShoppingCartIcon />
              </ListItemIcon>
                <ListItemText primary={"Sell to Buy"} />
              </ListItemButton>
            </ListItem>

            <ListItem disableGutters key={"Buy"}>
              <ListItemButton onClick={() => handleListItemClick("Buy to Sell")}>
              <ListItemIcon>
                 <SellIcon />
              </ListItemIcon>
                <ListItemText primary={"Buy to Sell"} />
              </ListItemButton>
            </ListItem>
     
        </List>
      </Dialog>
    );
  }
  
  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

  const handleConvert = () => {
        //sellingInput * sellingPrice = totalsellingprice
        //buyinginput = totalsellingprice/buyingPrice
        //convertType[0] is Sell to Buy, convertType[1] is Buy to Sell
    if (selectedValue === convertType[0] && selectedBuyingCurrency) {
      const totalSellingPrice = inputSellingValue * selectedSellingCurrencyPrice;
      setConvertedSellingPrice(totalSellingPrice);
      setConvertedBuyingPrice(totalSellingPrice / selectedBuyingCurrencyPrice);
      setInputBuyingValue(totalSellingPrice / selectedBuyingCurrencyPrice);
    } else if (selectedValue === convertType[1] && selectedSellingCurrency) {
      const totalBuyingPrice = inputBuyingValue * selectedBuyingCurrencyPrice;
      setConvertedBuyingPrice(totalBuyingPrice);
      setConvertedSellingPrice(totalBuyingPrice / selectedSellingCurrencyPrice);
      setInputSellingValue(totalBuyingPrice / selectedSellingCurrencyPrice);
    }
  };

  return (
    <div className="main" style={{ marginTop: 200 }}>
    <Card
    sx={{ maxWidth: 500, margin: 'auto', padding: 2, boxShadow: 3 }}>
            <Stack spacing={2} >
            <Typography variant="h5">Currency Converter</Typography>
            <div> 
             <TextField variant="outlined" label="Sell" type="number" value={inputSellingValue}
            
                InputLabelProps={{
                shrink: true,}}

                onChange={(event) =>{
                  const value = event.target.value;
                  if(value <= 0){
                    setInputSellingValue(0);
                  }else{
                    setInputSellingValue(value)
                  }
                }
            }/>
             <Select
            value={selectedSellingCurrency}
            onChange={(event) => {setSelectedSellingCurrency(event.target.value)
            setSelectedSellingCurrencyPrice(currencies[event.target.value].price)
            }}
            >
             {currencyNames.map((currencyNames) => (
              <MenuItem value={currencyNames} key={currencyNames}>
                {currencyNames}
              </MenuItem>
            ))}

            </Select>
            </div>

            <div>
            <TextField variant="outlined" label="Buy" type="number" value={inputBuyingValue}

                InputLabelProps={{
                shrink: true,}}

                onChange={(event) =>{
                  const value = event.target.value;
                  if(value <= 0){
                    setInputBuyingValue(0);
                  }else{
                    setInputBuyingValue(value)
                  }
                }
            }/>
            <Select
            value={selectedBuyingCurrency}
            onChange={(event) => {setBuyingSelectedCurrency(event.target.value)
              setBuyingSelectedCurrencyPrice(currencies[event.target.value].price)
            }}
            >
             {currencyNames.map((currencyNames) => (
              <MenuItem value={currencyNames} key={currencyNames}>
                {currencyNames}
              </MenuItem>
            ))}

            </Select>
            
            </div>

            <div>
            <div style={{ marginTop: 1 }}>
              Converting: {selectedValue}
              </div>
              <br />
              <Button variant="outlined" onClick={handleClickOpen}>
                Change Type
              </Button>
              <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
              />

              <Button
                variant="outlined"
                sx={{ float: 'right' }}
                onClick={() => {
                  // I included a "CircularProgress" even though there is no need to. The data provided is static and never changing. Makes more sense to code a circularprogress
                  //if we have dynamic data.
                  setLoading(true);
                  fetchData().then(() => {
                    handleConvert();
                    setLoading(false);
                  });
                }}
              >
                {loading ? (<CircularProgress size={24} />) : ('Convert')}
              </Button>
              </div>
              <div>
              {convertedBuyingPrice != null && convertedSellingPrice != null &&(
              <Typography variant="body" sx={{ mt: 1 }}>
                
              {selectedValue === convertType[0] && inputBuyingValue && inputSellingValue ? (
            `1 ${selectedSellingCurrency} = ${(selectedSellingCurrencyPrice / selectedBuyingCurrencyPrice).toFixed(4)} ${selectedBuyingCurrency} ($${(selectedSellingCurrencyPrice).toFixed(2)})`
          ) : (
            `1 ${selectedBuyingCurrency} = ${(selectedBuyingCurrencyPrice / selectedSellingCurrencyPrice).toFixed(4)} ${selectedSellingCurrency} ($${(selectedBuyingCurrencyPrice).toFixed(2)})`
          )}  
              </Typography>
              )}
              </div>


            </Stack>
            </Card>
    </div>
  );
}


export default App;
