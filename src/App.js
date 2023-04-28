//測試把檔案更動後建立並傳到新的分支

import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { getMoment } from "./utils/helpers";
import WeatherCard from "./views/WeatherCard";
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
const LOCATION_NAME = "高雄";
const LOCATION_NAME_FORECAST = "高雄市";

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");

  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), []);
  const [weatherElement, fetchDataFn] = useWeatherAPI({
    AUTHORIZATION_KET,
    LOCATION_NAME,
    LOCATION_NAME_FORECAST,
  });

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchDataFn={fetchDataFn}
        ></WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
