import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { FETCH_POST_QUERY } from "../util/graphql";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY,
        });
        const updatedPosts = data.posts.filter((p) => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POST_QUERY,
          data: {
            ...data,
            posts: updatedPosts,
          },
        });
        if (callback) callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <Popup
        content={commentId ? "Delete Comment" : "Delete Post"}
        inverted
        trigger={
          <Button
            as="div"
            floated="right"
            color="red"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
