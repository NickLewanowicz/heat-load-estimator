import { FC, useState } from 'react';

import './style.css';

import ottawa from './data/ottawa_2022';
import edmonton from './data/edmonton_2022';

export const App: FC<{ name: string }> = ({ name }) => {
  const GAS_KWH = 10.55;
  const KWH_BTU = 3412;
  const [gasConsumption, setGasConsumption] = useState(1300);
  const [furnaceEfficiency, setFurnaceEfficiency] = useState(0.96);
  const [setpoint, setSetpoint] = useState(22);
  const [lowestTemp, setLowestTemp] = useState(-30);
  const [city, setCity] = useState(0);

  const cities = [
    { name: 'Ottawa', data: ottawa },
    { name: 'Edmonton', data: edmonton },
  ];
  const kwhGasEquivalent = gasConsumption * GAS_KWH * furnaceEfficiency;
  const totalHeatingDegrees = cities[city].data.reduce(
    (acc, hour) => acc + Math.max(setpoint - hour.temp, 0),
    0
  );
  return (
    <div className="containter">
      <article>
        <h1>Design Heating Load Estimator</h1>
        <p>
          The following estimate works by using your natural gas consumption
          between September 1 2022 - May 31 2023 and hourly weather data to
          estimate what the design heating load that your home performed at.
        </p>
        <p>
          <p>City: </p>
          <select
            name="city"
            value={city}
            onChange={(v) => setCity(Number(v.currentTarget.value))}
          >
            {cities.map((city, i) => (
              <option value={i}>{city.name}</option>
            ))}
          </select>
        </p>

        <h3>Heat energy consumed</h3>
        <p>
          <table>
            <tr>
              <td>Gas usage (cubic meter)</td>
              <td>
                <p>
                  <input
                    value={gasConsumption}
                    onChange={(v) =>
                      setGasConsumption(Number(v.currentTarget.value))
                    }
                  />
                </p>
              </td>
            </tr>
            <tr>
              <td>Furnace efficiency (0-1)</td>
              <td>
                <p>
                  <input
                    type="number"
                    value={furnaceEfficiency}
                    onChange={(v) =>
                      setFurnaceEfficiency(Number(v.currentTarget.value))
                    }
                  />
                </p>
              </td>
            </tr>
            <tr>
              <td>Indoor Setpoint (celsius)</td>
              <td>
                <p>
                  <input
                    type="number"
                    value={setpoint}
                    onChange={(v) => setSetpoint(Number(v.currentTarget.value))}
                  />
                </p>
              </td>
            </tr>
            <tr>
              <td>Lowest 1% temperature (celsius)</td>
              <td>
                <p>
                  <input
                    type="number"
                    value={lowestTemp}
                    onChange={(v) =>
                      setLowestTemp(Number(v.currentTarget.value))
                    }
                  />
                </p>
              </td>
            </tr>
          </table>
        </p>
        <h3>Heat energy required</h3>
        <p>
          <table>
            <tr>
              <td>Net heat energy required:</td>
              <td>
                <p>
                  {`${gasConsumption} x ${GAS_KWH} x ${furnaceEfficiency} = ${Math.round(
                    kwhGasEquivalent
                  )}`}
                </p>
              </td>
            </tr>
            <tr>
              <td>Total heating degrees from 09/01/2022 - 05/31/2023</td>
              <td>
                <p>
                  {`${Math.round(totalHeatingDegrees)}`} (
                  {cities[city].data.length} hours)
                </p>
              </td>
            </tr>
            <tr>
              <td>KWh consumed per heating degree</td>
              <td>
                <p>{`${(kwhGasEquivalent / totalHeatingDegrees).toFixed(
                  2
                )} kw/hd`}</p>
              </td>
            </tr>
            <tr>
              <td>Estimated design heating load:</td>
              <td>
                <p>{`${(
                  (kwhGasEquivalent / totalHeatingDegrees) *
                  (setpoint - lowestTemp)
                ).toFixed(2)} kw`}</p>
                <p>{`${(
                  (kwhGasEquivalent / totalHeatingDegrees) *
                  (setpoint - lowestTemp) *
                  KWH_BTU
                ).toFixed(0)} BTUs`}</p>
              </td>
            </tr>
          </table>
        </p>
      </article>
    </div>
  );
};
