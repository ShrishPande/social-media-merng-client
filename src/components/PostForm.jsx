import React from "react";
import { Button, Form, FormInput } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { FETCH_POST_QUERY } from "../util/graphql";

const PostForm = () => {
  const { values, onSubmit, onChange } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });
      const updatedPosts = [result.data.createPost, ...data.posts];

      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          ...data,
          posts: updatedPosts,
        },
      });
      values.body = "";
    },

    onError(err) {
      console.error(err);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post:</h2>
        <FormInput
          placeholde="Hi World!"
          name="body"
          onChange={onChange}
          value={values.body}
          error={error ?true:false}
        />

        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form>
      {error && (
        <div className="ui error message" style={{marginBottom:"20px"}}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
