import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { setTokens } from "../services/slices/authSlice";
import { setProfile } from '../services/slices/profileSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../services/hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import logo_ytn from "../assets/logo_ytn.png"

export default function Login() {

    const dispatch = useDispatch();

    const accessToken = useSelector(state => state.auth.accessToken);
    const refreshToken = useSelector(state => state.auth.refreshToken);
    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken && refreshToken) {
            axios.get('/api/users/me').then(res => {

                dispatch(setProfile(res.data))
                if (res.data.is_professor === true) {
                    navigate('/home/prof');
                } else if (res.data.is_responsavel === true) {
                    navigate('/home/parent');
                } else if (res.data.is_superuser === true) {
                    navigate('/home/admin/classrooms')
                }

            }).catch(err => {
                console.log(err)
                alert("Falha ao logar. Tente novamente mais tarde")
            })
        }
    }, [accessToken, refreshToken]);

    function handleSubmit(e) {
        e.preventDefault();
        const data = {
            email: e.target[0].value,
            password: e.target[1].value
        }
        axios.post('/api/token/', data).then(res => {
            console.log(res)
            dispatch(setTokens({
                accessToken: res.data['access'],
                refreshToken: res.data['refresh']
            }))
            navigate('/home'); // Redirect to the new empty home page
        }).catch(err => {
            const code = err.response.status
            if (code === 400)
                alert("Usuário ou senha inválidos")
            else
                alert("Falha ao logar. Tente novamente mais tarde")
        })
        console.log(data)
    }

    return (
        <Container className="d-flex align-items-center justify-content-center w-100 h-100" >
            <Row className="justify-content-center">
                <Col>
                    <Card className=' rounded-4 shadow ' style={{ width: '761px', height: '410px' }}>
                        <Card.Body className=''>
                            <Container className='h-100'>
                                <Row className='h-100'>
                                    <Col className='d-flex align-items-center justify-content-center flex-column'>
                                        <div
                                          style={{
                                            width: '300px',
                                            height: '110px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: '#5d9cb2',
                                            maskImage: `url(${logo_ytn})`,
                                            WebkitMaskImage: `url(${logo_ytn})` // For Safari support
                                          }}
                                        />
                                        <p className='mt-4 fw-medium text-secondary text-center'>Esta é uma área restrita para usuários cadastrados.Informe seu usuário e senha para obter acesso ao sistema.</p>
                                    </Col>
                                    <Col className='d-flex justify-content-center flex-column'>
                                        <Form className='ms-3 me-3 border pt-5 pb-5 ps-3 pe-3 rounded-4' onSubmit={handleSubmit}>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>E-mail</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Insira seu e-mail"
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Senha</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Insira sua senha"
                                                />
                                            </Form.Group>
                                            <Button className='float-sm-end mt-3' variant="primary" type="submit">
                                                Login
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
