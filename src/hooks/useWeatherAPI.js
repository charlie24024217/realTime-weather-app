import { useEffect, useCallback, useState } from "react";

const fetchCurrentWeather = ({ AUTHORIZATION_KET, LOCATION_NAME }) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KET}&locationName=${LOCATION_NAME}`
  )
    .then((res) => res.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElement = locationData.weatherElement.reduce(
        (neededElement, item) => {
          if (["WDSD", "TEMP"].includes(item.elementName)) {
            neededElement[item.elementName] = item.elementValue;
          }
          return neededElement;
        },
        {}
      );
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        windSpeed: weatherElement.WDSD,
        temperature: weatherElement.TEMP,
      };
    });
};
const fetchWeatherForecast = ({
  AUTHORIZATION_KET,
  LOCATION_NAME_FORECAST,
}) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KET}&format=JSON&locationName=${LOCATION_NAME_FORECAST}`
  )
    .then((res) => res.json())
    .then((data) => {
      const weatherElement = data.records.location[0].weatherElement.reduce(
        (needElement, item) => {
          if (["Wx", "CI", "PoP"].includes(item.elementName)) {
            needElement[item.elementName] = item.time[0].parameter;
          }
          return needElement;
        },
        {}
      );

      return {
        description: weatherElement.Wx.parameterName,
        weatherCode: weatherElement.Wx.parameterValue,
        rainPossibility: weatherElement.PoP.parameterName,
        comfortability: weatherElement.CI.parameterName,
      };
    });
};

const useWeatherAPI = ({
  AUTHORIZATION_KET,
  LOCATION_NAME,
  LOCATION_NAME_FORECAST,
}) => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "載入中...",
    description: "載入中...",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    comfortability: "載入中...",
    weatherCode: 0,
    isLoading: true,
  });

  const fetchDataFn = useCallback(async () => {
    setWeatherElement((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ AUTHORIZATION_KET, LOCATION_NAME }),
      fetchWeatherForecast({
        AUTHORIZATION_KET,
        LOCATION_NAME_FORECAST,
      }),
    ]);
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [AUTHORIZATION_KET, LOCATION_NAME, LOCATION_NAME_FORECAST]);

  useEffect(() => {
    fetchDataFn();
  }, [fetchDataFn]);

  return [weatherElement, fetchDataFn];
};

export default useWeatherAPI;
