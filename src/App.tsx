import { Button, Text, Flex, HStack, Box, SimpleGrid, Grid, GridItem, Table, Thead, Td, Tbody, Tr, Th, Heading, ButtonGroup, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Input, InputGroup, InputLeftElement, useToast, FormLabel, Tag, ModalOverlay, Modal, ModalContent, ModalHeader, useDisclosure, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FaFileImport, FaFileExport, FaEyeSlash, FaEye, FaCalculator, FaInfoCircle, FaCalendar, FaTrash } from "react-icons/fa";
import { GiCartwheel } from "react-icons/gi";
import { BsArrowRight, BsCircleHalf, BsSquareHalf, BsTriangleHalf } from "react-icons/bs"
import { AiOutlineBorderBottom, AiOutlineBorderHorizontal, AiOutlineBorderLeft, AiOutlineBorderRight, AiOutlineBorderTop, AiOutlineBorderVerticle } from "react-icons/ai";
import React, { createRef, useState } from 'react';
import './App.css';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./react-datepicker.css";
import _ from 'lodash';

const MS_PER_MINUTE = 60000;

// ####################################
// ## Type Declarations
// ####################################

enum NumberColor {
  Red,
  Black,
  Green
}

type RouletteNumber = {
  value: string,
  color: NumberColor
}

type CalledNumber = {
  time: Date,
  number: RouletteNumber
}


// ####################################
// ## Component Declarations
// ####################################

const dateToString = (date: Date) => {
  var options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }
  return date.toLocaleDateString("en-GB", options);
}

const getButtonBackgroundColor = (colorProp: NumberColor) => {
  return colorProp === NumberColor.Red
    ? "red"
    : colorProp === NumberColor.Black
      ? "black"
      : "green";
}

const getButtonHoverBackgroundColor = (colorProp: NumberColor) => {
  return colorProp === NumberColor.Red
    ? "red.500"
    : colorProp === NumberColor.Black
      ? "blackAlpha.600"
      : "green.500";
}

type RouletteNumberButtonProps = {
  number: RouletteNumber,
  onClick: (value: RouletteNumber) => void
}
const RouletteNumberButton = ({number, onClick}: RouletteNumberButtonProps) => {
  return (
    <Button
      backgroundColor={getButtonBackgroundColor(number.color)}
      _hover={{backgroundColor: getButtonHoverBackgroundColor(number.color)}}
      color="white"
      width="50px"
      height="100%"
      borderRadius="sm"
      onClick={() => onClick(number)}
    >
      {number.value}
    </Button>
  )
}

type HeaderProps = {
  calledNumbers: CalledNumber[],
  setCalledNumbers: (newCalledNumbers: CalledNumber[]) => void
}
const Header = ({ calledNumbers, setCalledNumbers }: HeaderProps) => {
  const toast = useToast();
  
  const onImport = () => {
    importInputRef.current?.click();
  }

  const onExport = () => {
    var stringedCalledNumbers = calledNumbers.map(x => JSON.stringify(x)).join("~");
    
    const elem = document.createElement("a");
    const file = new Blob(
      [stringedCalledNumbers],
      {type : "text/plain"}
    );
    elem.href = URL.createObjectURL(file);
    elem.download = `rlte-${new Date().toISOString()}.txt`;
    document.body.appendChild(elem);
    elem.click();
  }
  const loadFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        var loaded = reader.result as string;
        var split = loaded.split("~");
        
        try {
          var parsed: CalledNumber[] = split.map(x => {
            var parsedX = JSON.parse(x);
            return {
              number: parsedX.number,
              time: new Date(parsedX.time)
            }
          });
          
          var array = [...calledNumbers, ...parsed];
          array.sort((a: CalledNumber, b: CalledNumber) => {
            return a.time.getTime() - b.time.getTime();
          });

          array = array.filter((x, idx) => array.map(y => y.time.getTime()).indexOf(x.time.getTime()) === idx);
          setCalledNumbers(array);
        } catch (err) {
          toast({
            description: "Invalid file.",
            position: "top",
            status: "error",
            duration: 3000,
            isClosable: true
          })
        }
      }
      reader.readAsText(file);

    }
  }

  const importInputRef = createRef<HTMLInputElement>();

  return (
    <Flex backgroundColor="gray.900" alignItems="center"
      justifyContent="space-between"
    >
      <Flex paddingX={2} paddingY={4} marginLeft={4}
        alignItems="center" fontSize="2xl"
      >
        <GiCartwheel />
        <Text ml={2} fontWeight="bold"         
          color="white" fontSize="md"
        >
          RLTE
        </Text>
      </Flex>

      <ButtonGroup variant="outline" size="sm" mr={2} colorScheme="cyan">
        <Button leftIcon={<FaFileImport />}
          onClick={() => onImport()}
        >Import</Button>
        <Input type="file" accept="text/plain"
          onChange={e => loadFile(e)}
          ref={importInputRef}
          display="none"
        />
        <Button leftIcon={<FaFileExport />}
          onClick={() => onExport()}
        >Export</Button>
      </ButtonGroup>
    </Flex>

  )
}

type RouletteTableProps = {
  appendToCalled: (num: RouletteNumber) => void
}
const RouletteTable = ({ appendToCalled }: RouletteTableProps) => {
  const rouletteNumbers: RouletteNumber[][] = [
    // Top row
    [
      { value: "00", color: NumberColor.Green },
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
      { value: "0", color: NumberColor.Green },
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

  return (
    <Flex maxWidth="700px" justifyContent="center" mt={3}>
      <Grid
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(13, 1fr)"
        gap={1}
        height="180px"
      >
        {
          rouletteNumbers.map(x => 
            x.map(y => 
              <GridItem key={y.value === "00"
                ? 37
                : y.value === "0"
                  ? 38
                  : y.value
                } rowSpan={y.value === "00" || y.value === "0" ? 3 : 2} colSpan={1}
              >
                <RouletteNumberButton
                  number={y}
                  onClick={appendToCalled}
                />
              </GridItem>
            )
          )
        }
      </Grid>
    </Flex>
  )
}

type ToolsAccordionProps = {
  filteredStartDate: Date | undefined,
  filteredEndDate: Date | undefined,
  setFilteredStartDate: (newDate: Date | undefined) => void,
  setFilteredEndDate: (newDate: Date | undefined) => void,
}
const ToolsAccordion = ({ filteredStartDate, filteredEndDate, setFilteredStartDate, setFilteredEndDate }: ToolsAccordionProps) => {
  const [numberOfBets, setNumberOfBets] = useState<number>(0);
  const [startingBet, setStartingBet] = useState<number>(0);
  const totalNeeded = () => {
    var sum = startingBet;
    for (var i = 1; i <= numberOfBets; i++) {
      sum *= 2;
    }

    return sum - startingBet;
  }

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [isFiltered, setIsFiltered] = useState(false);

  const onClickApply = () => {
    setFilteredStartDate(startDate);
    setFilteredEndDate(endDate);
    setIsFiltered(true);
  }

  const onClickLastXTime = (minutes: number) => {
    var closest15Mins = getClosest15Mins(new Date(), "ceil");
    var oneHourAgo = new Date(closest15Mins.getTime() - (minutes * MS_PER_MINUTE));

    setStartDate(oneHourAgo);
    setEndDate(closest15Mins);
    setFilteredStartDate(oneHourAgo);
    setFilteredEndDate(closest15Mins);
    setIsFiltered(true);
  }

  const onClickClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredStartDate(undefined);
    setFilteredEndDate(undefined);
    setIsFiltered(false);
  }

  const getClosest15Mins = (date: Date, type: "round" | "ceil" | "floor") => {
    var d = _.clone(date);
    var minutes = date.getMinutes();
    var hours = date.getHours();

    var m = (Math.floor(minutes/15) * 15) % 60;
    var h = minutes > 52 ? (hours === 23 ? 0 : hours + 1) : hours;
    if (type === "round") {
      m = (Math.round(minutes/15) * 15) % 60;
    } else if (type === "ceil") {
      m = (Math.ceil(minutes/15) * 15) % 60;
      if (m === 0 && h !== hours + 1) {
        h = hours + 1;
      }
    }
    else {
      h = hours;
    }

    d.setMinutes(m, 0, 0);
    d.setHours(h);
    return d;
  }

  return (
    <Accordion mt={4} allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Flex alignItems="center" flex={1}>
            <FaCalculator />
            <Text ml={4}>Double Down Calculator</Text>
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Flex flexDir="column">
            <Flex display="flex" alignItems="center">
              <Text minW="35px">I want to be safe for</Text>
              <Input size="lg" variant="flushed" placeholder="#" type="number"
                maxW="75px" textAlign="center"
                mx={2}
                onChange={(e) => setNumberOfBets(parseInt(e.target.value))}
              />
              
              <Text minW="225px">bets, with a starting bet of</Text>
              <InputGroup maxW="150px" mx={2} size="lg" >
                <InputLeftElement
                  maxW="20px"
                  pointerEvents='none'
                  height="100%"
                  children='$'
                />
                <Input variant="flushed" placeholder="123456" type="number"
                  onChange={(e) => setStartingBet(parseInt(e.target.value))}
                  textAlign="center"
                />
              </InputGroup>
              <Text>.</Text>
            </Flex>

            <Flex mt={4} alignItems="center">
              <Text fontWeight="bold">You will need:</Text>
              <Text ml={8} fontSize="2xl">${totalNeeded()}</Text>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Flex alignItems="center" flex={1}>
            <FaCalendar />
            <Text ml={4}>Filter by Date</Text>
          </Flex>
          {
            isFiltered
            ? <Flex alignItems="center" mr={2}>
              {
                (filteredStartDate && <Tag colorScheme="cyan">{dateToString(filteredStartDate)}</Tag>)
                || <Tag colorScheme="cyan">No start date</Tag>
              }
              <Box mx={2}><BsArrowRight /></Box>
              {
                (filteredEndDate && <Tag colorScheme="cyan">{dateToString(filteredEndDate)}</Tag>)
                || <Tag colorScheme="cyan">No end date</Tag>
              }
            </Flex>
            : null
          }
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Flex flexDirection="column">
            <Flex alignItems="center">
              <FormLabel mb={0} mr={2} flex={1}>Date Range:</FormLabel>
              <ReactDatePicker
                dateFormat="dd/MM/yy HH:mm"
                selected={startDate}
                onChange={(date) => setStartDate(date as Date)}
                selectsStart

                showTimeSelect
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                
                timeFormat="HH:mm"
                timeIntervals={15}

                placeholderText="Start Date..."
              />
              <Box flex={0} mx={4}><BsArrowRight /></Box>
              <ReactDatePicker
                dateFormat="dd/MM/yy HH:mm"
                selected={endDate}
                onChange={(date) => setEndDate(date as Date)}
                selectsEnd

                showTimeSelect
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}

                timeFormat="HH:mm"
                timeIntervals={15}

                placeholderText="End Date..."
              />

              <Button size="sm" colorScheme="cyan" variant="outline" ml={4}
                onClick={onClickApply} isDisabled={!startDate && !endDate}
              >
                Apply
              </Button>
            </Flex>
            <Flex mt={4} alignContent="center">
              <FormLabel mb={0} mr={2} flex={1} alignSelf="center">Quick Filter:</FormLabel>
              <ButtonGroup colorScheme="cyan" size="sm" variant="outline">
                <Button onClick={() => onClickLastXTime(60)}>Last hour</Button>
                <Button onClick={() => onClickLastXTime(30)}>Last 30 mins</Button>
                <Button onClick={() => onClickLastXTime(15)}>Last 15 mins</Button>
                <Button colorScheme="red" onClick={onClickClear}>Clear</Button>
              </ButtonGroup>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

type RecentlyCalledProps = {
  calledNumbers: CalledNumber[]
  removeCalledNumber: (number: CalledNumber) => void
}
const RecentlyCalled = ({ calledNumbers, removeCalledNumber }: RecentlyCalledProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeNumber, setActiveNumber] = useState<CalledNumber>({time: new Date(), number: { value: "1", color: NumberColor.Red }});
  const [showNumber, setShowNumber] = useState(true);

  const onClickHandle = (number: CalledNumber) => {
    setActiveNumber(number);
    onOpen();
  }

  const onDeleteConfirm = (number: CalledNumber) => {
    removeCalledNumber(number);
    onClose();
  }

  return (
    <>
    <Flex flexDir="column" mr={2}>
      <Flex alignItems="center" mb={2} justifyContent="space-between">
        <Flex alignItems="center">
          <Heading size="md">Recently Called:</Heading>
          <Button ml={2}
            size="sm"
            onClick={() => setShowNumber(!showNumber)}
            leftIcon={showNumber ? <FaEyeSlash /> : <FaEye />}
            mr={2}
          >
            Toggle Text
          </Button>
        </Flex>
      </Flex>
      <Flex border="1px solid white" boxShadow="0 0 0 1px white inset" justifyContent="center"
        borderRadius="md"
        h="188px" overflow="hidden"
      >
        {
          calledNumbers.length === 0
          ? <Flex alignItems="center">
                <FaInfoCircle />
                <Text ml={2}>No numbers called.</Text>
          </Flex>
          : <Flex overflowY="auto"  flex={1} height="inherit"
            p={2} border="1px solid white" 
          ><SimpleGrid columns={10} gap={1} flex={1} height="0%" maxH="20px"
            _after={{
              content: '" "',
              display: "block",
              width: "100%",
              height: "25px",
              marginTop: "10px"
            }}
          >
            {
              calledNumbers.slice().reverse().map(x => 
                <Button key={x.time.getTime().toString()}
                  size="sm" height="25px" width="26px"
                  backgroundColor={getButtonBackgroundColor(x.number.color)}
                  _hover={{backgroundColor: getButtonHoverBackgroundColor(x.number.color)}}
                  padding={0}
                  paddingInlineStart={0}
                  paddingInlineEnd={0}
                  minW={0}
                  onClick={() => onClickHandle(x)}
                >
                  {
                    showNumber ? x.number.value : null
                  }
                </Button>
              )
            }
          </SimpleGrid></Flex>
        }
      </Flex>
    </Flex>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex>
            <Text>Delete</Text>
            <Box backgroundColor={getButtonBackgroundColor(activeNumber.number.color)}
              width="35px" textAlign="center"
              mx={2} borderRadius="md"
            >
              {activeNumber.number.value}
            </Box>
            <Text>called at {dateToString(activeNumber.time)}?</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <ButtonGroup size="sm" justifyContent="space-between">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="outline" colorScheme="red"
              leftIcon={<FaTrash />}
              onClick={() => onDeleteConfirm(activeNumber)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}

type StatsTableProps = {
  calledNumbers: CalledNumber[]
}
const StatsTable = ({ calledNumbers }: StatsTableProps) => {
  const getCountByColor = (color: NumberColor) => {
    return calledNumbers.filter(x => x.number.color === color).length;
  }

  const getCountByModulo = (modulo: number, shouldEqual: number) => {
    return calledNumbers.filter(x => parseInt(x.number.value) > 0 && parseInt(x.number.value) % modulo === shouldEqual).length;
  }

  const getCountByRange = (start: number, end: number) => {
    return calledNumbers.filter(x => parseInt(x.number.value) >= start && parseInt(x.number.value) <= end).length;
  }

  const getPercentageOfTotal = (count: number) => {
    return Math.round((count / calledNumbers.length) * 10000) / 100;
  }

  return (
    <Flex flex={1} borderLeft="1px solid var(--chakra-colors-gray-700)" margin={0} marginInlineStart="0 !important"
      paddingX={2} flexDir="column"
    >
      <Heading size="md" mb={2} ml={4}>Statistics:</Heading>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Count</Th>
            <Th isNumeric>% of Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Total</Td>
            <Td isNumeric>{calledNumbers.length}</Td>
            <Td isNumeric>-</Td>
          </Tr>
          <Tr borderTopWidth={3}>
            <Td>
              <Flex alignItems="center">
                <Flex backgroundColor="red" width="15px" height="15px"
                  mr={2} borderRadius="full" ml="1px"
                />
                Red
              </Flex>
            </Td>
            <Td isNumeric>{getCountByColor(NumberColor.Red)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByColor(NumberColor.Red))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex backgroundColor="black" width="15px" height="15px"
                  mr={2} borderRadius="full" ml="1px"
                />
                Black
              </Flex>
            </Td>
            <Td isNumeric>{getCountByColor(NumberColor.Black)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByColor(NumberColor.Black))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex backgroundColor="green" width="15px" height="15px"
                  mr={2} borderRadius="full" ml="1px"
                />
                Green
              </Flex>
            </Td>
            <Td isNumeric>{getCountByColor(NumberColor.Green)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByColor(NumberColor.Green))} %</Td>
          </Tr>

          <Tr borderTopWidth={3}>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="md" mr={2}>
                  <BsSquareHalf />
                </Flex>
                Even
              </Flex>
            </Td>
            <Td isNumeric>{getCountByModulo(2, 0)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByModulo(2, 0))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="md" mr={2}><BsTriangleHalf /></Flex>
                Odd
              </Flex>
            </Td>
            <Td isNumeric>{getCountByModulo(2, 1)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByModulo(2, 1))} %</Td>
          </Tr>

          <Tr borderTopWidth={3}>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="md" mr={2}><BsCircleHalf /></Flex>
                1-18
              </Flex>
            </Td>
            <Td isNumeric>{getCountByRange(1, 18)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByRange(1, 18))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="md" mr={2} transform="rotate(180deg)"><BsCircleHalf /></Flex>
                19-36
              </Flex>
            </Td>
            <Td isNumeric>{getCountByRange(19, 36)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByRange(19, 36))} %</Td>
          </Tr>

          <Tr borderTopWidth={3}>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="lg" mr={2} ml="-2.5px"><AiOutlineBorderLeft /></Flex>
                1st 12
              </Flex>
            </Td>
            <Td isNumeric>{getCountByRange(1, 12)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByRange(1, 12))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="lg" mr={2} ml="-2.5px"><AiOutlineBorderHorizontal /></Flex>
                2nd 12
              </Flex>
            </Td>
            <Td isNumeric>{getCountByRange(13, 24)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByRange(13, 24))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="lg" mr={2} ml="-2.5px"><AiOutlineBorderRight /></Flex>
                3rd 12
              </Flex>
            </Td>
            <Td isNumeric>{getCountByRange(25, 36)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByRange(25, 36))} %</Td>
          </Tr>

          <Tr borderTopWidth={3}>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="lg" mr={2} ml="-2.5px"><AiOutlineBorderTop /></Flex>
                Top 2 to 1
              </Flex>
            </Td>
            <Td isNumeric>{getCountByModulo(3, 0)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByModulo(3, 0))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="lg" mr={2} ml="-2.5px"><AiOutlineBorderVerticle /></Flex>
                Mid 2 to 1
              </Flex>
            </Td>
            <Td isNumeric>{getCountByModulo(3, 2)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByModulo(3, 2))} %</Td>
          </Tr>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <Flex fontSize="lg" mr={2} ml="-2.5px"><AiOutlineBorderBottom /></Flex>
                Bot 2 to 1
              </Flex>
            </Td>
            <Td isNumeric>{getCountByModulo(3, 1)}</Td>
            <Td isNumeric>{getPercentageOfTotal(getCountByModulo(3, 1))} %</Td>
          </Tr>

        </Tbody>
      </Table>
    </Flex>
  )
}

const App = () => {
  const [calledNumbers, setCalledNumbers] = useState<CalledNumber[]>([]);

  const [filteredStartDate, setFilteredStartDate] = useState<Date | undefined>(undefined);
  const [filteredEndDate, setFilteredEndDate] = useState<Date | undefined>(undefined);
  
  const appendToCalled = (number: RouletteNumber) => {
    var cn: CalledNumber = {
      time: new Date(),
      number: number
    }
    setCalledNumbers(curr => [...curr, cn]);
  }

  const removeCalledNumber = (number: CalledNumber) => {
    var called = _.cloneDeep(calledNumbers);
    var idxToRemove = called.findIndex(x => x.time.getTime() === number.time.getTime());
    if (idxToRemove !== -1) {
      called.splice(idxToRemove, 1);

      setCalledNumbers(called);
    }
  }

  const filterCalledByDate = () => {
    return _.cloneDeep(calledNumbers).filter(x => {
      var t = x.time.getTime();
      if (filteredStartDate && filteredStartDate.getTime() > t) {
        return false;
      }

      if (filteredEndDate && filteredEndDate.getTime() < t) {
        return false;
      }

      return true;
    });
  }

  return (
    <Flex flexDir="column" justifyContent="center">
      <Header
        calledNumbers={calledNumbers}
        setCalledNumbers={setCalledNumbers}
      />
      <Flex maxWidth="800px" flexDir="column" flex={1} alignSelf="center"
        padding={4}
      >
        <RouletteTable appendToCalled={appendToCalled} />
        
        <ToolsAccordion
          filteredStartDate={filteredStartDate}
          filteredEndDate={filteredEndDate}
          setFilteredStartDate={setFilteredStartDate}
          setFilteredEndDate={setFilteredEndDate}        
        />
        
        <Flex mt={2} flexDir="column">
          <HStack flex={1} mt={2} alignItems="flex-start">
            
            <Flex flexDir="column" flex={1}>
              <RecentlyCalled
                calledNumbers={filterCalledByDate()}
                removeCalledNumber={removeCalledNumber}
              />
            </Flex>
            
            <StatsTable calledNumbers={filterCalledByDate()} />
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
