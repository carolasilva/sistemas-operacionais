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
  debugger
  const fifoFunction = (memorySize, sequence) => {
    let queue = [];
    let memory = [];
    let result = [];

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
      }

      console.log(memory);
      //result.push(memoryInProgress);
      //console.log(result);
    })
  }

  async function handleSubmit(data, { reset }) {
    const memorySize = data.memorySize;
    const sequence = data.sequence.split('-').map(item => Number(item));
    const fifo = fifoFunction(memorySize, sequence);
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
