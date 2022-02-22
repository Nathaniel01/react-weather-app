import React, { useCallback, useEffect, useState, Fragment } from 'react'
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios'
import  cities  from './cities';


//------------------------------STYLED COMPONENTS FOR TEXT STYLING  
const Bodytext = styled.p`
  color: white;
  display: block;
`;

const HeaderText = styled.h1`
  color: white;
  display: block;
  font-size: 60px;
  justify-content: center;
  align-items: center;
`;

const TempHead = styled.h1`
  color: white;
  display: block;
  font-size: 38px;
  justify-content: center;
  align-items: center;
`;

const SpanText = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
`;

const SmallText = styled.small`
  justify-content: center;
  align-self: center;
  margin: 0px 2px;
  color: white;
`;


function App(props) {
  const [data, setData] = useState(null)
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectedLoading, setIsSelectedLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const [weatherLocation, setWeatherLocation] = useState('');

  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState(true);

  const [city, setCity] = useState(null);
  const filterBy = ['name', 'country'];

   const searchLocation = async (city) => {
     let response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=693cf682c5a982d522e312cbc8b38a3a`);
     console.log( 'Weather', response.data.list)
     console.log('The value', response.data.list[0].main.temp)
     let weatherResponse = {
       //Today
       temp: response.data.list[0].main.temp,
       humidity: response.data.list[0].main.humidity,
       description: response.data.list[0].weather[0].description,
       windSpeed: response.data.list[0].wind.speed,

       // Day 1
       day_1_temp: response.data.list[8].main.temp,

       //Day 2
       day_2_temp: response.data.list[16].main.temp, 

       //Day 3
       day_3_temp: response.data.list[24].main.temp,

       //Day 4
       day_4_temp: response.data.list[32].main.temp, 

       //day 5
       day_5_temp: response.data.list[39].main.temp
     }
     setWeatherData(weatherResponse)
     setIsWeatherDataLoading(false)
   };


  const handleSearch = async () => {

    setIsLoading(true);

    const options = cities.map((i) => ({
      country: i.country,
      subcountry: i.subcountry,
      name: i.name,
    }));

    setOptions(options);
    //setLocation(options.name)
    setIsLoading(false);
  }

  useEffect(() => {
    console.log('The weather in ', weatherLocation)
    console.log(weatherData)
    if(weatherLocation != '') {

      searchLocation(weatherLocation)
    }
  }, [weatherLocation]);
  

  const searchInfo = useCallback(async () => {
    console.log(options.name, 'location', weatherLocation);
    if(isLoading) return;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${options.name}&appid=693cf682c5a982d522e312cbc8b38a3a`);
    console.log('Weather', response);
    setData(response.data);
  }, []);


  return (
    <div className="App">
      <div className='container'>
        <Container className='top'>
          <Row>
            <Col md={12} align="center">
              <div className='location'>
                <Bodytext>
                  {
                    !isSelectedLoading ? selected.map((element) => {
                      return element.name + ', ' + element.country
                    })
                     : ''
                  } 

                </Bodytext>
              </div>
              <div className='temperature'>
                <HeaderText>{ !isWeatherDataLoading && (weatherData.temp - 273.15)}&deg;C</HeaderText>
              </div>
              <div className='description'>
                <Bodytext>{!isWeatherDataLoading && weatherData.description }</Bodytext>
                <Bodytext>Wind speed: {!isWeatherDataLoading && weatherData.windSpeed }</Bodytext>
                <Bodytext>Humidity: {!isWeatherDataLoading && weatherData.humidity }</Bodytext>
              </div>
            </Col>
          </Row>
        </Container>
        <Container >
          <Row>
          <Form.Group>
            <Col md={12} align="center">
               <AsyncTypeahead
                filterBy={filterBy}
                id="async"
                isLoading={isLoading}
                onChange={(toSelect) => {        
                  setSelected(toSelect);
                  setIsSelectedLoading(false);
                }}
                selected={selected}
                labelKey="name"
                minLength={2}
                onSearch={handleSearch}
                options={options}
                placeholder="Enter your city..."
                renderMenuItemChildren={(option, props) => (
                  <Fragment >
                    <div onClick={() => setWeatherLocation(option.name)}>
                      <span >{option.name}, {option.country}</span>
                    </div>
                  </Fragment>
                )}
              />
            </Col>
            </Form.Group>
          </Row>
          
        </Container>
        <Container align="center" className='bottom'>
          <Row>
            <Col md={2}>
              <Bodytext>Fri 21,</Bodytext>
              <TempHead>{!isWeatherDataLoading && weatherData.day_1_temp} &deg;C</TempHead>
              <Bodytext>Partly Sunny</Bodytext>
            </Col>
            <Col md={2}>
            <Bodytext>Fri 22,</Bodytext>
              <TempHead>{!isWeatherDataLoading && weatherData.day_2_temp} &deg;C</TempHead>
              <Bodytext>Partly Sunny</Bodytext>
            </Col>
            <Col md={2}>
            <Bodytext>Fri 23,</Bodytext>
              <TempHead>{!isWeatherDataLoading && weatherData.day_3_temp} &deg;C</TempHead>
              <Bodytext>Partly Sunny</Bodytext>
            </Col>
            <Col md={2}>
            <Bodytext>Fri 24,</Bodytext>
              <TempHead>{!isWeatherDataLoading && weatherData.day_4_temp} &deg;C</TempHead>
              <Bodytext>Partly Sunny</Bodytext>
            </Col>
            <Col md={2}>
            <Bodytext>Fri 25,</Bodytext>
              <TempHead>{!isWeatherDataLoading && weatherData.day_5_temp} &deg;C</TempHead>
              <Bodytext>Partly Sunny</Bodytext>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
