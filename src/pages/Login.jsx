import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormInput } from "semantic-ui-react";
import { useForm } from '../util/hooks';
import { AuthContext } from "../context/auth";
import { useContext } from "react";



const Login = (props) => {
  const context = useContext(AuthContext);
  console.log(context)
  const navigate = useNavigate();
  
  const [errors,setErrors] = useState({})

  
  const { onChange,onSubmit,values } =useForm(loginUserCallback,{
    username:'',
    password:''
  })
  
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    update(_, {data:{login:userData}}) {
      context.login(userData)
      navigate('/')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.errors)
    },
    variables: values,
  });

  function loginUserCallback(){
    loginUser();
  }

  return (
    
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <FormInput
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error ={errors.username? true :false}
          onChange={onChange}
        />
        <FormInput
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error = {errors.password?true:false}
          onChange={onChange}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>

      {Object.keys(errors).length>0 && (
        <div className="ui error message">
        <ul className="list">
          {Object.values(errors).map(value=>{
            return <li key={value}>{value}</li>
          })}
        </ul>
      </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username:$username
      password:$password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
