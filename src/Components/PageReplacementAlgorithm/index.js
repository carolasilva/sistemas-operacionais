import React, { useRef, useState, useEffect } from 'react';
import { Form as UnForm } from "@unform/web";
import '../../App.scss';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup
} from "react-bootstrap";
import Header from '../Header'
import Input from '../Input';

const PageReplacementAlgorithm = () => {

  const formRef = useRef(null);
  const [sequence, setSequence] = useState([]);
  const [fifo, setFifo] = useState([]);
  const [optimum, setOptimum] = useState([]);
  const [lfu, setLfu] = useState([]);
  const [lfuWithLru, setLfuWithLru] = useState([]);
  const [mfu, setMfu] = useState([]);
  const [mfuWithLru, setMfuWithLru] = useState([]);
  const [lru, setLru] = useState([]);
  const [show, setShow] = useState(false);


  const fifoFunction = (memorySize, sequence) => {
    let queue = [];
    let memory = [];
    let result = [];
    let memoryInProgress = [];

    sequence.forEach((page) => {
      if (memory.indexOf(page) === -1){
        if (memory.length < memorySize) {
          memory.push(page);
          queue.push(page);
          memoryInProgress = [... memory];
          while (memoryInProgress.length < memorySize)
            memoryInProgress.push('');
        }
        else {
          const out = queue.shift();
          const index = memory.indexOf(out);
          memory[index] = page;
          queue.push(page);
          memoryInProgress = [... memory];
        }

      } else {
        memoryInProgress = ['', '', '']
      }

      result.push(memoryInProgress);
    })
    return result;
  }

  const optimumFunction = (memorySize, sequence) => {
    let memory = [];
    let result = [];
    let memoryInProgress = [];

    sequence.map((page, index) => {
      if (memory.indexOf(page) === -1){
        if (memory.length < memorySize) {
          memory.push(page);
          memoryInProgress = [... memory];
          while (memoryInProgress.length < memorySize)
          memoryInProgress.push('');
        } else {
           let elementToChange;
           let biggestIndex = -1;
           const nextElementsOfSequence = sequence.slice(index + 1, sequence.length);

           for (let i = 0; i < memorySize; i++) {
             let indexOfNextInstance = nextElementsOfSequence.indexOf(memory[i]);
             if (indexOfNextInstance === -1) {
               biggestIndex = indexOfNextInstance;
               elementToChange = memory[i];
               break;
             }
             else if (indexOfNextInstance > biggestIndex) {
               biggestIndex = indexOfNextInstance;
               elementToChange = memory[i];
             }
           }
          const indexOfElementToChangeInMemory = memory.indexOf(elementToChange);
          memory[indexOfElementToChangeInMemory] = page;
          memoryInProgress = [... memory];
        }

      } else {
        memoryInProgress = ['', '', '']
      }

      result.push(memoryInProgress);
    })
    return result;
  }

  const lruFunction = (memorySize, sequence) => {
    let memory = [];
    let result = [];
    let memoryInProgress = [];

    sequence.map((page, index) => {
      // page isn't in memory
      if (memory.indexOf(page) === -1){
        // there's still room in memory
        if (memory.length < memorySize) {
          memory.push(page);
          memoryInProgress = [... memory];
          while (memoryInProgress.length < memorySize)
            memoryInProgress.push('');
        }
        // there isn't room in memory
        else {
          let elementToChange;
          let biggestIndex = -1;
          const previousElementsOfSequence = sequence.slice(0, index, sequence.length);
          previousElementsOfSequence.reverse();
          console.log(previousElementsOfSequence);
          for (let i = 0; i < memorySize; i++) {
            let indexOfNextInstance = previousElementsOfSequence.indexOf(memory[i]);
            if (indexOfNextInstance === -1) {
              biggestIndex = indexOfNextInstance;
              elementToChange = memory[i];
              break;
            }
            else if (indexOfNextInstance > biggestIndex) {
              biggestIndex = indexOfNextInstance;
              elementToChange = memory[i];
            }
          }
          const indexOfElementToChangeInMemory = memory.indexOf(elementToChange);
          memory[indexOfElementToChangeInMemory] = page;
          memoryInProgress = [... memory];
        }

      } else {
        memoryInProgress = ['', '', '']
      }

      result.push(memoryInProgress);
    })
    return result;
  }

  const lfuFunction = (memorySize, sequence) => {
    let queue = [];
    let memory = [];
    let result = [];
    let memoryInProgress = [];
    let frequencyTable = {};


    sequence.forEach((page) => {
      // if page isn't in memory yet
      if (memory.indexOf(page) === -1){
        // If there's room in memory
        if (memory.length < memorySize) {
          memory.push(page);
          queue.push(page);
          memoryInProgress = [...memory];
          while (memoryInProgress.length < memorySize)
            memoryInProgress.push('');
        }
        // there isn't room in memory
        else {
          let leastFrequentlyUsed = [];
          let minimum;
          for (var[key, value] of Object.entries(frequencyTable)) {
            if (minimum == undefined || value <= minimum) {
              minimum = value
            }
          }

          for (var[key, value] of Object.entries(frequencyTable)) {
            if (value === minimum)
              leastFrequentlyUsed.push(parseInt(key));
          }

          let elementToRemove;
          if (leastFrequentlyUsed.length === 1) {
            elementToRemove = leastFrequentlyUsed[0];
          } else {
            let firstIn;
            let leastIndex;
            leastFrequentlyUsed.forEach((element) => {
              if (queue.indexOf(element) < leastIndex || leastIndex == undefined) {
                leastIndex = queue.indexOf(element);
                firstIn = element;
              }
            });

            elementToRemove = firstIn;

          }

          queue.splice(queue.indexOf(elementToRemove), 1);
          const index = memory.indexOf(elementToRemove);
          memory[index] = page;
          queue.push(page);
          memoryInProgress = [...memory];
          delete frequencyTable[elementToRemove]
        }
        frequencyTable[page] = 1;
      // Page is already in memory
      } else {
        memoryInProgress = ['', '', '']
        frequencyTable[page] = frequencyTable[page] + 1;
      }
      // console.log(frequencyTable)
      result.push(memoryInProgress);
    })

    return result;
  }

  const lfuWithLruFunction = (memorySize, sequence) => {
    let queue = [];
    let memory = [];
    let result = [];
    let memoryInProgress = [];
    let frequencyTable = {};


    sequence.map((page, index) => {
      let indexInSequence = index;
      // if page isn't in memory yet
      if (memory.indexOf(page) === -1){
        // If there's room in memory
        if (memory.length < memorySize) {
          memory.push(page);
          queue.push(page);
          memoryInProgress = [...memory];
          while (memoryInProgress.length < memorySize)
            memoryInProgress.push('');
        }
        // there isn't room in memory
        else {
          let leastFrequentlyUsed = [];
          let minimum;
          for (var[key, value] of Object.entries(frequencyTable)) {
            if (minimum == undefined || value <= minimum) {
              minimum = value
            }
          }

          for (var[key, value] of Object.entries(frequencyTable)) {
            if (value === minimum)
              leastFrequentlyUsed.push(parseInt(key));
          }

          let elementToRemove;
          if (leastFrequentlyUsed.length === 1) {
            elementToRemove = leastFrequentlyUsed[0];
          } else {
            let biggestIndex = -1;

            const previousElementsOfSequence = sequence.slice(0, indexInSequence, sequence.length);
            previousElementsOfSequence.reverse();

            for (let i = 0; i < memorySize; i++) {
              let indexOfNextInstance = previousElementsOfSequence.indexOf(memory[i]);
              if (indexOfNextInstance === -1) {
                biggestIndex = indexOfNextInstance;
                elementToRemove = memory[i];
                break;
              }
              else if (indexOfNextInstance > biggestIndex) {
                biggestIndex = indexOfNextInstance;
                elementToRemove = memory[i];
              }
            }

          }

          queue.splice(queue.indexOf(elementToRemove), 1);
          const index = memory.indexOf(elementToRemove);
          memory[index] = page;
          queue.push(page);
          memoryInProgress = [...memory];
          delete frequencyTable[elementToRemove]
        }
        frequencyTable[page] = 1;
        // Page is already in memory
      } else {
        memoryInProgress = ['', '', '']
        frequencyTable[page] = frequencyTable[page] + 1;
      }
      // console.log(frequencyTable)
      result.push(memoryInProgress);
    })

    return result;
  }

  const mfuFunction = (memorySize, sequence) => {
    let queue = [];
    let memory = [];
    let result = [];
    let memoryInProgress = [];
    let frequencyTable = {};


    sequence.forEach((page) => {
      // if page isn't in memory yet
      if (memory.indexOf(page) === -1){
        // If there's room in memory
        if (memory.length < memorySize) {
          memory.push(page);
          queue.push(page);
          memoryInProgress = [...memory];
          while (memoryInProgress.length < memorySize)
            memoryInProgress.push('');
        }
        // there isn't room in memory
        else {
          let mostFrequentlyUsed = [];
          let maximum;
          for (var[key, value] of Object.entries(frequencyTable)) {
            if (maximum == undefined || value >= maximum) {
              maximum = value
            }
          }

          for (var[key, value] of Object.entries(frequencyTable)) {
            if (value === maximum)
              mostFrequentlyUsed.push(parseInt(key));
          }

          let elementToRemove;
          if (mostFrequentlyUsed.length === 1) {
            elementToRemove = mostFrequentlyUsed[0];
          } else {
            let firstIn;
            let leastIndex;
            mostFrequentlyUsed.forEach((element) => {
              if (queue.indexOf(element) < leastIndex || leastIndex == undefined) {
                leastIndex = queue.indexOf(element);
                firstIn = element;
              }
            });

            elementToRemove = firstIn;

          }

          queue.splice(queue.indexOf(elementToRemove), 1);
          const index = memory.indexOf(elementToRemove);
          memory[index] = page;
          queue.push(page);
          memoryInProgress = [...memory];
          delete frequencyTable[elementToRemove]
        }
        frequencyTable[page] = 1;
        // Page is already in memory
      } else {
        memoryInProgress = ['', '', '']
        frequencyTable[page] = frequencyTable[page] + 1;
      }
      // console.log(frequencyTable)
      result.push(memoryInProgress);
    })
    return result;
  }

  const mfuWithLruFunction = (memorySize, sequence) => {
    let queue = [];
    let memory = [];
    let result = [];
    let memoryInProgress = [];
    let frequencyTable = {};


    sequence.map((page, index) => {
      let indexInSequence = index;
      // if page isn't in memory yet
      if (memory.indexOf(page) === -1){
        // If there's room in memory
        if (memory.length < memorySize) {
          memory.push(page);
          queue.push(page);
          memoryInProgress = [...memory];
          while (memoryInProgress.length < memorySize)
            memoryInProgress.push('');
        }
        // there isn't room in memory
        else {
          let mostFrequentlyUsed = [];
          let maximum;
          for (var[key, value] of Object.entries(frequencyTable)) {
            if (maximum == undefined || value >= maximum) {
              maximum = value
            }
          }

          for (var[key, value] of Object.entries(frequencyTable)) {
            if (value === maximum)
              mostFrequentlyUsed.push(parseInt(key));
          }

          let elementToRemove;
          if (mostFrequentlyUsed.length === 1) {
            elementToRemove = mostFrequentlyUsed[0];
          } else {
            let biggestIndex = -1;

            const previousElementsOfSequence = sequence.slice(0, indexInSequence, sequence.length);
            previousElementsOfSequence.reverse();

            for (let i = 0; i < memorySize; i++) {
              let indexOfNextInstance = previousElementsOfSequence.indexOf(memory[i]);
              if (indexOfNextInstance === -1) {
                biggestIndex = indexOfNextInstance;
                elementToRemove = memory[i];
                break;
              } else if (indexOfNextInstance > biggestIndex) {
                biggestIndex = indexOfNextInstance;
                elementToRemove = memory[i];
              }
            }
          }

          queue.splice(queue.indexOf(elementToRemove), 1);
          const index = memory.indexOf(elementToRemove);
          memory[index] = page;
          queue.push(page);
          memoryInProgress = [...memory];
          delete frequencyTable[elementToRemove]
        }
        frequencyTable[page] = 1;
        // Page is already in memory
      } else {
        memoryInProgress = ['', '', '']
        frequencyTable[page] = frequencyTable[page] + 1;
      }
      // console.log(frequencyTable)
      result.push(memoryInProgress);
    })
    return result;
  }

  const manageResult = (result, rows) => {
    const columns = result.length;
    const data = [];
    let auxVector = [];

    for (let i = 0; i < rows; i++) {
      auxVector = [];
      result.map((column) => {
        auxVector.push(column[i]);
      })
      data.push(auxVector);
    }

    return data;
  }

  const renderTd = (element) => {
    return <td>{element}</td>;
  }

  const renderRow = (data) => {
    if (data.length > 0) {
      return (
        <tr>
          {data.map(renderTd)}
        </tr>
      )
    } else
     return;
  }

  async function handleSubmit(data, { reset }) {
    const memorySize = data.memorySize;
    setSequence(data.sequence.split('-').map(item => Number(item)));

    const fifoResult = fifoFunction(memorySize, sequence);
    setFifo(manageResult(fifoResult, memorySize));

    const optimumResult = optimumFunction(memorySize, sequence);
    setOptimum(manageResult(optimumResult, memorySize));

    const lfuResult = lfuFunction(memorySize, sequence);
    setLfu(manageResult(lfuResult, memorySize));

    const lfuWithLruResult = lfuWithLruFunction(memorySize, sequence);
    setLfuWithLru(manageResult(lfuWithLruResult, memorySize));

    const mfuResult = mfuFunction(memorySize, sequence);
    setMfu(manageResult(mfuResult, memorySize));

    const mfuWithLruResult = mfuWithLruFunction(memorySize, sequence);
    setMfuWithLru(manageResult(mfuWithLruResult, memorySize));

    const lruResult = lruFunction(memorySize, sequence);
    setLru(manageResult(lruResult, memorySize));
  }

  useEffect(() => {
    if (lru.length !== 0) {
      setShow(true);
    }
  }, [lru]);

  return (
    <>
      <Header />
      <Container className="pageWrapper mt-5">
        <Row>
          <Col sm={2}>
            <div className="containerTitle">
              <p>Algoritmos de Substituição de Páginas</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="containerContent">
              <Row>
                <Col>
                  <UnForm ref={formRef} onSubmit={handleSubmit}>
                    <Form.Group>
                      <Form.Label className="label">Tamanho da Memória</Form.Label>
                      <br />
                      <Input
                        className="input"
                        name="memorySize"
                        type="number"
                        placeholder="Ex: 3"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="label">Sequência</Form.Label>
                      <br />
                      <Input
                        className="input"
                        name="sequence"
                        type="text"
                        placeholder="Ex: 3-1-2-3-2-1-6-5-7-3"
                      />
                    </Form.Group>
                    <InputGroup>
                      <Button variant="primary" type="submit" className="px-4 button" >Calcular</Button>
                    </InputGroup>
                  </UnForm>
                </Col>
              </Row>
              {
                show &&
                <>
                  <Container className='results'>
                    <Row>
                      <h3>FIFO: </h3>
                      <table className="table table-bordered">
                        <tbody>
                          {fifo.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                    <Row>
                      <h3>Optimum: </h3>
                      <table className="table table-bordered">
                        <tbody>
                        {optimum.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                    <Row>
                      <h3>LRU: </h3>
                      <table className="table table-bordered">
                        <tbody>
                        {lru.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                    <Row>
                      <h3>LFU (desempate com FIFO): </h3>
                      <table className="table table-bordered">
                        <tbody>
                        {lfu.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                    <Row>
                      <h3>LFU (desempate com LRU): </h3>
                      <table className="table table-bordered">
                        <tbody>
                        {lfuWithLru.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                    <Row>
                      <h3>MFU (desempate com FIFO): </h3>
                      <table className="table table-bordered">
                        <tbody>
                        {mfu.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                    <Row>
                      <h3>MFU (desempate com LRU): </h3>
                      <table className="table table-bordered">
                        <tbody>
                        {mfuWithLru.map(renderRow)}
                        </tbody>
                      </table>
                    </Row>
                  </Container>
                </>
              }
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PageReplacementAlgorithm;
