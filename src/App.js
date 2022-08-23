

import * as React from 'react';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Button,
  TextField, Typography } from '@mui/material/';
import axios from 'axios';
import moment from 'moment';

const App = () => {

  const [city, setCity] = React.useState('');
  const [cityList, setCityList] = React.useState([]);
  const [weather, setWeather] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const clearState = () => {
    setCity('');
    setCityList([])
  }

  const getResults = async () => {
    setIsLoading(true);
    const requestCity = {
      method: 'POST',
      url: `${process.env.REACT_APP_BACKEND_URL}/get-city`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {city: city}
    };

    axios.request(requestCity).then(function (response) {
      // console.log(response.data);
      setCityList(response.data);
      setIsLoading(false);
    }).catch(function (error) {
      console.error(error);
      setIsLoading(false);
    });

  };

  const getWeatherCondition = (key) => {
    setIsLoading(true);
    const requestWeather = {
      method: 'POST',
      url: `${process.env.REACT_APP_BACKEND_URL}/get-weather`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {key: key}
    };

    axios.request(requestWeather).then(function (response) {
      // console.log(response.data);
      setWeather(response.data[0]);
      setOpenModal(true);
      setIsLoading(false);
    }).catch(function (error) {
      console.error(error);
      setIsLoading(false);
    });

  }

  return (
    <Container maxWidth="md">
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      <Grid
      alignItems="center"
      display="flex"
      justifyContent="center"
      container
      spacing={2}
      mt={2}
      >
        <Grid item xs={6}>
          <TextField
            onChange={(e) => setCity(e.target.value)}
            value={city}
            fullWidth
            size="small"
            label="City Search"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={3}>
          <Button
            fullWidth
            color="primary"
            onClick={getResults}
            variant="contained">Search
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            onClick={clearState}
            color="error"
            variant="contained">Clear
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} sx={{display: 'flex' }}>

            {cityList.length ? cityList.map((cl) => (
              <Grid item xs={4} key={cl.Key}>
                <Box sx={{ textAlign: 'center' }}>
                  <img width="200px" src="https://cdn-icons-png.flaticon.com/512/149/149442.png" alt="Free"/>
                  <Typography>Localized Name: {cl.LocalizedName}</Typography>
                  <Typography>Primary Postal Code: {cl.PrimaryPostalCode}</Typography>
                  <Button
                    fullWidth
                    onClick={() => getWeatherCondition(cl.Key)}
                    color="secondary"
                    variant="contained">View Weather
                  </Button>
                </Box>
              </Grid>
            )) : (
              <Box mt={4} sx={{ fontSize: '30px', textAlign: 'center', width: '100%' }}>
                Please enter a US State to check its weather
              </Box>
            )}
          </Grid>
        </Grid>

      </Grid>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Weather Details
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography><strong className="bolded">Weather Text:</strong> {weather?.WeatherText}</Typography>
            <Typography><strong className="bolded">Is Day Time: </strong> {weather?.IsDayTime ? 'Yes' : 'No'}</Typography>
            <Typography><strong className="bolded">Local Observation Date Time:</strong>  {moment(weather?.LocalObservationDateTime).format('MM-DD-YYYY')}</Typography>
            <Typography><strong className="bolded">Temperature:</strong></Typography>
            <Typography><strong className="bolded">Metric:</strong>  {weather?.Temperature?.Metric.Value} {weather?.Temperature?.Metric.Unit} {weather?.Temperature?.Metric.UnitType}</Typography>
            <Typography><strong className="bolded">Imperial:</strong>  {weather?.Temperature?.Imperial.Value} {weather?.Temperature?.Imperial.Unit}  {weather?.Temperature?.Imperial.UnitType}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default App;