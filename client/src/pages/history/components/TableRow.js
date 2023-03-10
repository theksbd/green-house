import React from "react";

export default function TableRow({data}) {
  const { time, temperature, humidity, soil_moisture } = data;
  return (
    <tr>
      <td>{time}</td>
      <td>
        <p>
          {temperature} <sup>o</sup>C
        </p>
      </td>
      <td>{humidity}%</td>
      <td>{soil_moisture}%</td>
    </tr>
  );
}
