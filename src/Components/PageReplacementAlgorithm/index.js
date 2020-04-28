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

  const [fifo, setFifo] = useState([]);
  const [show, setShow] = useState(false);

  async function handleSubmit(data, { reset }) {
    const memorySize = data.memorySize;
    setSequence(data.sequence.split('-').map(item => Number(item)));
    const result = fifoFunction(memorySize, sequence);
    setFifo(manageResult(result, memorySize));
    const optimum = optimumFunction(memorySize, sequence);
  }

  useEffect(() => {
    if (fifo.length !== 0) {
      setShow(true);
    }
  }, [fifo]);

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
                      <table className="table">
                        <tbody>
                          {fifo.map(renderRow)}
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
