import React, { useRef, useState } from 'react';
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
        }
        else {
          const out = queue.shift();
          const index = memory.indexOf(out);
          memory[index] = page;
          queue.push(page);
        }
        memoryInProgress = [... memory];
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
        } else {
          debugger
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
        }
        memoryInProgress = [... memory];
      } else {
        memoryInProgress = ['', '', '']
      }

      result.push(memoryInProgress);
    })
    return result;
  }

  async function handleSubmit(data, { reset }) {
    const memorySize = data.memorySize;
    const sequence = data.sequence.split('-').map(item => Number(item));
    const fifo = fifoFunction(memorySize, sequence);
    const optimum = optimumFunction(memorySize, sequence);
    console.log(optimum);
  }

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
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PageReplacementAlgorithm;
