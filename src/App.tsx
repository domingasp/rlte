import { Button, Flex, HStack, Table, Tbody, Td, Tr, Box, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react';
import './App.css';

enum NumberColor {
  Red,
  Black,
  Green
}

type RouletteNumber = {
  value: string,
  color: NumberColor
}

const App = () => {
  const rouletteNumbers: RouletteNumber[][] = [
    // Top row
    [
      { value: "3", color: NumberColor.Red},
      { value: "6", color: NumberColor.Black},
      { value: "9", color: NumberColor.Red},
      { value: "12", color: NumberColor.Red},
      { value: "15", color: NumberColor.Black},
      { value: "18", color: NumberColor.Red},
      { value: "21", color: NumberColor.Red},
      { value: "24", color: NumberColor.Black},
      { value: "27", color: NumberColor.Red},
      { value: "30", color: NumberColor.Red},
      { value: "33", color: NumberColor.Black},
      { value: "36", color: NumberColor.Red}
    ],

    // Mid row
    [
      { value: "2", color: NumberColor.Black},
      { value: "5", color: NumberColor.Red},
      { value: "8", color: NumberColor.Black},
      { value: "11", color: NumberColor.Black},
      { value: "14", color: NumberColor.Red},
      { value: "17", color: NumberColor.Black},
      { value: "20", color: NumberColor.Black},
      { value: "23", color: NumberColor.Red},
      { value: "26", color: NumberColor.Black},
      { value: "29", color: NumberColor.Black},
      { value: "32", color: NumberColor.Red},
      { value: "35", color: NumberColor.Black}
    ],

    // Bot row
    [
      { value: "1", color: NumberColor.Red},
      { value: "4", color: NumberColor.Black},
      { value: "7", color: NumberColor.Red},
      { value: "10", color: NumberColor.Black},
      { value: "13", color: NumberColor.Black},
      { value: "16", color: NumberColor.Red},
      { value: "19", color: NumberColor.Red},
      { value: "22", color: NumberColor.Black},
      { value: "25", color: NumberColor.Red},
      { value: "28", color: NumberColor.Black},
      { value: "31", color: NumberColor.Black},
      { value: "34", color: NumberColor.Red}
    ]
  ];

  const [calledNumbers, setCalledNumbers] = useState<RouletteNumber[]>([]);
  const appendToCalled = (number: RouletteNumber) => {
    setCalledNumbers(curr => [...curr, number]);
  }

  const getCountByColor = (color: NumberColor) => {
    return calledNumbers.filter(x => x.color === color).length;
  }

  const getEvenOddCount = (evenOdd: "even" | "odd") => {
    if (evenOdd === "even") {
      return calledNumbers.filter(x => parseInt(x.value) > 0 && parseInt(x.value) % 2 === 0).length;
    }

    return calledNumbers.filter(x => parseInt(x.value) > 0 && parseInt(x.value) % 2 === 1).length;
  }

  return (
    <Flex flexDir="column">
      <Flex>Header</Flex>
      <Flex>
        <Table>
          <Tbody>
            {
              rouletteNumbers.map((x, xIdx) => 
                <Tr key={xIdx}>
                  {
                    x.map(y => 
                      <Td key={y.value}>
                        <Button
                          onClick={() => appendToCalled(y)}
                        >
                          {y.value}
                        </Button>
                      </Td>
                    )
                  }
                </Tr>
              )
            }
          </Tbody>
        </Table>
      </Flex>
      <Flex>
        <HStack flex={1}>
          {
            calledNumbers.length === 0
            ? null
            : <SimpleGrid columns={10} flex={1}>
              {
                calledNumbers.map((x, xIdx) => 
                  <Box key={xIdx}>{x.value}</Box>
                )
              }
            </SimpleGrid>
          }
          <Flex flex={1}>
            <HStack>
              {/* Total */}
              <Box>{calledNumbers.length}</Box>

              {/* By Color */}
              <Box>{getCountByColor(NumberColor.Red)}</Box>
              <Box>{getCountByColor(NumberColor.Black)}</Box>
              <Box>{getCountByColor(NumberColor.Green)}</Box>

              {/* Even/Odd */}
              <Box>{getEvenOddCount("even")}</Box>
              <Box>{getEvenOddCount("odd")}</Box>

              {/* 1-18 & 19-36 */}

              {/* 1st 12/2nd 12/3rd 12 */}
              {/* Top/Middle/Bottom */}
              {/* Split by each number (could be under the number in table) */}
            </HStack>
          </Flex>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default App;
