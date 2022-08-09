//useEffect utiliza um parametros: o primeiro é uma função e o segundo (opcional) pode ser um array https://www.w3schools.com/react/react_useeffect.asp.
import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger'; //trasmite o reducer para o navegador para debugar o estado
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
//import data from '../data';

//reducer aceita dois parametros: o primeiro é o estado atual e o segundo é a ação passada pelo 'UseReducer' que altera o estado inicial
//a ação recebe um "tipo" e um "payload (que é a ação propriamente dita)"

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      //...state mantem o estado inicial e apenas atualiza o loading to true
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  //cria uma array que recebe o estado incial (ou podem ser objetos) e dispacth (função que altera o estado incial ou os objetos)
  //e a função "useReducer" que recebe o nosso reducer criado e o estado incial dele.
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      //função que valida o pedido e aplica a ação tratada no reducer
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
      //setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="product">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              //sempre que tem um map, preciso dizer qual a key a buscar
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
