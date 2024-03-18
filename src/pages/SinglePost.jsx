import React, { useContext, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Grid,
  GridRow,
  GridColumn,
  Card,
  CardContent,
  CardHeader,
  CardMeta,
  CardDescription,
  Image,
  Button,
  Icon,
  Label,
  Form,
  Popup,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { useNavigate, useParams } from "react-router";

const SinglePost = (props) => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const [submitComment] = useMutation(SUBMIT_COMMENT, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const nav = useNavigate();
  const deletePostCallback = () => {
    nav("/");
  };

  const getPost = data?.getPost;

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;
    postMarkup = (
      <Grid>
        <GridRow>
          <GridColumn width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </GridColumn>
          <GridColumn width={10}>
            <Card fluid>
              <CardContent>
                <CardHeader>{username}</CardHeader>
                <CardMeta>{moment(createdAt).fromNow()}</CardMeta>
                <CardDescription>{body}</CardDescription>
              </CardContent>
              <hr />
              <CardContent extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup
                  content="Comment on post"
                  inverted
                  trigger={
                    <Button as="div" labelPosition="right">
                      <Button color="blue" basic>
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </CardContent>
            </Card>

            {user && (
              <Card fluid>
                <CardContent>
                  <p>Post a Comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.. "
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <CardContent>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <CardHeader>{comment.username}</CardHeader>
                  <CardMeta>{moment(comment.createdAt).fromNow()}</CardMeta>
                  <CardDescription>{comment.body}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </GridColumn>
        </GridRow>
      </Grid>
    );
  }
  return postMarkup;
};

const SUBMIT_COMMENT = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
