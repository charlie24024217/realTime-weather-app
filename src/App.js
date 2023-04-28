import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { getMoment, findLocation } from "./utils/helpers";
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";
import useWeatherAPI from "./hooks/useWeatherAPI";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KET = process.env.REACT_APP_AUTHORIZATION_KET;

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrenPage] = useState("WeatherCard");
  const [currentCity, setCurrentCity] = useState(
    localStorage.getItem("cityName") || "高雄市"
  );

  const currentLocation = useMemo(() => {
    return findLocation(currentCity);
  }, [currentCity]);

  const currentCityHandler = (cityName) => {
    setCurrentCity(cityName);
  };

  const { cityName, locationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchDataFn] = useWeatherAPI({
    AUTHORIZATION_KET,
    LOCATION_NAME: locationName,
    LOCATION_NAME_FORECAST: cityName,
  });

  const toggleCurrentPage = (currentPage) => {
    setCurrenPage(currentPage);
  };

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchDataFn={fetchDataFn}
            toggleCurrentPage={toggleCurrentPage}
          ></WeatherCard>
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            currentCity={currentCity}
            toggleCurrentPage={toggleCurrentPage}
            currentCityHandler={currentCityHandler}
          ></WeatherSetting>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
