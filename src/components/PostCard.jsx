import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMeta,
  Image,
  Label,
  Icon,
  Button,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = ({
  post: { body, createdAt, id, username, likeCount, likes, commentCount },
}) => {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <CardContent>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <CardHeader>{username}</CardHeader>
        <CardMeta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </CardMeta>
        <CardDescription>{body} </CardDescription>
      </CardContent>
      <CardContent extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === username && <DeleteButton postId={id} />}
      </CardContent>
    </Card>
  );
};

export default PostCard;
