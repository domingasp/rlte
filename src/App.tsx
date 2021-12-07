import React from 'react';
import './App.css';

enum NumberColor {
  Red,
  Black,
  Green
}

type RouletteNumber = {
  value: number,
  color: NumberColor
}

const App = () => {
  const rouletteNumbers: RouletteNumber[][] = [
    // Top row
    [
      { value: 3, color: NumberColor.Red},
      { value: 6, color: NumberColor.Black},
      { value: 9, color: NumberColor.Red},
      { value: 12, color: NumberColor.Red},
      { value: 15, color: NumberColor.Black},
      { value: 18, color: NumberColor.Red},
      { value: 21, color: NumberColor.Red},
      { value: 24, color: NumberColor.Black},
      { value: 27, color: NumberColor.Red},
      { value: 30, color: NumberColor.Red},
      { value: 33, color: NumberColor.Black},
      { value: 36, color: NumberColor.Red}
    ],

    // Mid row
    [
      { value: 2, color: NumberColor.Black},
      { value: 5, color: NumberColor.Red},
      { value: 8, color: NumberColor.Black},
      { value: 11, color: NumberColor.Black},
      { value: 14, color: NumberColor.Red},
      { value: 17, color: NumberColor.Black},
      { value: 20, color: NumberColor.Black},
      { value: 23, color: NumberColor.Red},
      { value: 26, color: NumberColor.Black},
      { value: 29, color: NumberColor.Black},
      { value: 32, color: NumberColor.Red},
      { value: 35, color: NumberColor.Black}
    ],

    // Bot row
    [
      { value: 1, color: NumberColor.Red},
      { value: 4, color: NumberColor.Black},
      { value: 7, color: NumberColor.Red},
      { value: 10, color: NumberColor.Black},
      { value: 13, color: NumberColor.Black},
      { value: 16, color: NumberColor.Red},
      { value: 19, color: NumberColor.Red},
      { value: 22, color: NumberColor.Black},
      { value: 25, color: NumberColor.Red},
      { value: 28, color: NumberColor.Black},
      { value: 31, color: NumberColor.Black},
      { value: 34, color: NumberColor.Red}
    ]
  ];

  return (
    <div>
      <table>
        <tbody>
          {
            rouletteNumbers.map((x, i) => 
              <tr key={i}>
                {
                  x.map(y => 
                    <td key={y.value}
                      className={`roulette-number-td`}
                    >
                      <button className={`roulette-number-button roulette-number-button--${NumberColor[y.color]}`}
                        onClick={() => {
                          console.log(y);
                        }}
                      >{y.value}</button>
                    </td>
                  )
                }
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
